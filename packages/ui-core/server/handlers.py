import json
import os
from urllib.parse import parse_qs, urlparse

from .detection import detect_methods
from .registry import RegistryManager
from .state_focus import parse_state

_METHOD_LABELS = {"gsd": "GSD", "bmad": "BMAD", "spec-kit": "Spec-Kit"}


class Handlers:
    registry_manager = RegistryManager()

    @staticmethod
    def health(handler):
        handler.send_response(200)
        handler.send_header("Content-type", "application/json")
        handler.send_header("Access-Control-Allow-Origin", "*")
        handler.end_headers()
        response = {"status": "ok"}
        handler.wfile.write(json.dumps(response).encode("utf-8"))

    @staticmethod
    def get_registry(handler):
        handler.send_response(200)
        handler.send_header("Content-type", "application/json")
        handler.send_header("Access-Control-Allow-Origin", "*")
        handler.end_headers()
        registry = Handlers.registry_manager.get_all()
        handler.wfile.write(json.dumps(registry).encode("utf-8"))

    @staticmethod
    def post_registry(handler):
        content_length = int(handler.headers.get("Content-Length", 0))
        if content_length > 0:
            post_data = handler.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode("utf-8"))
                name = data.get("name")
                path = data.get("path")
                source_type = data.get("type", "unknown")

                if name and path:
                    success, result = Handlers.registry_manager.add_source(
                        name, path, source_type
                    )
                    if success:
                        handler.send_response(201)
                        handler.send_header("Content-type", "application/json")
                        handler.send_header("Access-Control-Allow-Origin", "*")
                        handler.end_headers()
                        handler.wfile.write(json.dumps(result).encode("utf-8"))
                        return
                    handler.send_response(400)
                    handler.send_header("Content-type", "application/json")
                    handler.send_header("Access-Control-Allow-Origin", "*")
                    handler.end_headers()
                    handler.wfile.write(json.dumps({"error": result}).encode("utf-8"))
                    return
            except json.JSONDecodeError:
                pass

        handler.send_response(400)
        handler.send_header("Content-type", "application/json")
        handler.send_header("Access-Control-Allow-Origin", "*")
        handler.end_headers()
        handler.wfile.write(json.dumps({"error": "Invalid request"}).encode("utf-8"))

    @staticmethod
    def get_source_overview(handler):
        q = parse_qs(urlparse(handler.path).query)
        source_id = (q.get("sourceId") or [""])[0]
        if not source_id:
            handler.send_response(400)
            handler.send_header("Content-type", "application/json")
            handler.send_header("Access-Control-Allow-Origin", "*")
            handler.end_headers()
            handler.wfile.write(
                json.dumps({"error": "sourceId is required"}).encode("utf-8")
            )
            return

        item = Handlers.registry_manager.get_by_id(source_id)
        if not item:
            handler.send_response(404)
            handler.send_header("Content-type", "application/json")
            handler.send_header("Access-Control-Allow-Origin", "*")
            handler.end_headers()
            handler.wfile.write(json.dumps({"error": "Unknown source"}).encode("utf-8"))
            return

        root = item.get("path")
        if not root or not os.path.isdir(root):
            handler.send_response(400)
            handler.send_header("Content-type", "application/json")
            handler.send_header("Access-Control-Allow-Origin", "*")
            handler.end_headers()
            handler.wfile.write(json.dumps({"error": "Path not found"}).encode("utf-8"))
            return

        raw = detect_methods(root)
        methods = [_METHOD_LABELS[m] for m in raw if m in _METHOD_LABELS]
        state_path = os.path.join(root, ".planning", "STATE.md")
        state_obj = None
        state_mtime = None
        if os.path.isfile(state_path):
            state_mtime = os.path.getmtime(state_path)
            state_obj = parse_state(state_path)

        payload = {
            "id": str(item.get("id", "")),
            "path": root,
            "methods": methods,
            "raw_methods": raw,
            "state": state_obj,
            "stateMtime": state_mtime,
        }
        handler.send_response(200)
        handler.send_header("Content-type", "application/json")
        handler.send_header("Access-Control-Allow-Origin", "*")
        handler.end_headers()
        handler.wfile.write(json.dumps(payload).encode("utf-8"))

    @staticmethod
    def not_found(handler):
        handler.send_response(404)
        handler.send_header("Content-type", "application/json")
        handler.send_header("Access-Control-Allow-Origin", "*")
        handler.end_headers()
        response = {"error": "Not Found"}
        handler.wfile.write(json.dumps(response).encode("utf-8"))
