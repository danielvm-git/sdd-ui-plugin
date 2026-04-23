import json
from .registry import RegistryManager

class Handlers:
    registry_manager = RegistryManager()

    @staticmethod
    def health(handler):
        handler.send_response(200)
        handler.send_header('Content-type', 'application/json')
        handler.send_header('Access-Control-Allow-Origin', '*')
        handler.end_headers()
        response = {'status': 'ok'}
        handler.wfile.write(json.dumps(response).encode('utf-8'))

    @staticmethod
    def get_registry(handler):
        handler.send_response(200)
        handler.send_header('Content-type', 'application/json')
        handler.send_header('Access-Control-Allow-Origin', '*')
        handler.end_headers()
        registry = Handlers.registry_manager.get_all()
        handler.wfile.write(json.dumps(registry).encode('utf-8'))

    @staticmethod
    def post_registry(handler):
        # Stub for now as per plan
        content_length = int(handler.headers.get('Content-Length', 0))
        if content_length > 0:
            post_data = handler.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                name = data.get('name')
                path = data.get('path')
                source_type = data.get('type', 'unknown')
                
                if name and path:
                    success, result = Handlers.registry_manager.add_source(name, path, source_type)
                    if success:
                        handler.send_response(201)
                        handler.send_header('Content-type', 'application/json')
                        handler.send_header('Access-Control-Allow-Origin', '*')
                        handler.end_headers()
                        handler.wfile.write(json.dumps(result).encode('utf-8'))
                        return
                    else:
                        handler.send_response(400)
                        handler.send_header('Content-type', 'application/json')
                        handler.send_header('Access-Control-Allow-Origin', '*')
                        handler.end_headers()
                        handler.wfile.write(json.dumps({'error': result}).encode('utf-8'))
                        return
            except json.JSONDecodeError:
                pass

        handler.send_response(400)
        handler.send_header('Content-type', 'application/json')
        handler.send_header('Access-Control-Allow-Origin', '*')
        handler.end_headers()
        handler.wfile.write(json.dumps({'error': 'Invalid request'}).encode('utf-8'))

    @staticmethod
    def not_found(handler):
        handler.send_response(404)
        handler.send_header('Content-type', 'application/json')
        handler.send_header('Access-Control-Allow-Origin', '*')
        handler.end_headers()
        response = {'error': 'Not Found'}
        handler.wfile.write(json.dumps(response).encode('utf-8'))
