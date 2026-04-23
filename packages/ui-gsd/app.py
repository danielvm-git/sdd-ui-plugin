import http.server
import json
import os
import re
import socketserver

DEFAULT_PORT = 3006
PORT = int(os.environ.get("SDD_UI_PORT", DEFAULT_PORT))
DEFAULT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sample_project")
TARGET_DIR = os.environ.get("SDD_UI_PROJECT", os.environ.get("TARGET_DIR", DEFAULT_DIR))


def get_frontmatter(content):
    meta = {}
    body = content
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            header = parts[1]
            body = parts[2].strip()
            for line in header.strip().split("\n"):
                if ":" in line:
                    key, value = line.split(":", 1)
                    meta[key.strip()] = value.strip().strip('"').strip("'")
    return meta, body


class GSDHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api/stats":
            self.send_stats()
        elif self.path == "/api/roadmap":
            self.send_roadmap()
        elif self.path == "/api/phases":
            self.send_phases()
        elif self.path == "/api/state":
            self.send_file_content("STATE.md")
        elif self.path == "/api/codebase":
            self.send_codebase()
        else:
            super().do_GET()

    def send_stats(self):
        stats = {
            "milestone": "v1.0.0",
            "progress": 65,
            "phasesCount": len(self.get_roadmap_phases()),
            "plansCount": self.count_files_by_pattern(r".*-PLAN\.md")
        }
        self.send_json(stats)

    def count_files_by_pattern(self, pattern):
        count = 0
        if os.path.exists(TARGET_DIR):
            for file_name in os.listdir(TARGET_DIR):
                if re.match(pattern, file_name):
                    count += 1
        planning_dir = os.path.join(TARGET_DIR, ".planning")
        if os.path.exists(planning_dir):
            for file_name in os.listdir(planning_dir):
                if re.match(pattern, file_name):
                    count += 1
        return count

    def get_roadmap_phases(self):
        roadmap_path = os.path.join(TARGET_DIR, "ROADMAP.md")
        phases = []
        if os.path.exists(roadmap_path):
            with open(roadmap_path, "r", encoding="utf-8") as handle:
                content = handle.read()
                matches = re.finditer(r"## Phase (\d+): (.*)", content)
                for match in matches:
                    phases.append({
                        "number": match.group(1),
                        "title": match.group(2).strip(),
                        "status": "todo"
                    })
        return phases

    def send_roadmap(self):
        self.send_json(self.get_roadmap_phases())

    def send_phases(self):
        files = []
        search_dirs = [TARGET_DIR, os.path.join(TARGET_DIR, ".planning")]
        for directory in search_dirs:
            if not os.path.exists(directory):
                continue
            for file_name in os.listdir(directory):
                if re.match(r"\d+-.*\.md", file_name):
                    with open(os.path.join(directory, file_name), "r", encoding="utf-8") as handle:
                        content = handle.read()
                        meta, body = get_frontmatter(content)
                        files.append({
                            "id": file_name[:-3],
                            "filename": file_name,
                            "title": meta.get("title", file_name[:-3]),
                            "content": body,
                            "metadata": meta,
                            "phase": file_name.split("-")[0]
                        })
        self.send_json(files)

    def send_codebase(self):
        codebase_dir = os.path.join(TARGET_DIR, ".planning", "codebase")
        docs = []
        if os.path.exists(codebase_dir):
            for file_name in os.listdir(codebase_dir):
                if file_name.endswith(".md"):
                    with open(os.path.join(codebase_dir, file_name), "r", encoding="utf-8") as handle:
                        content = handle.read()
                        meta, body = get_frontmatter(content)
                        docs.append({
                            "id": file_name[:-3],
                            "filename": file_name,
                            "title": meta.get("title", file_name[:-3]),
                            "content": body,
                            "metadata": meta
                        })
        self.send_json(docs)

    def send_file_content(self, filename):
        file_path = os.path.join(TARGET_DIR, filename)
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as handle:
                content = handle.read()
                meta, body = get_frontmatter(content)
                self.send_json({"title": filename, "content": body, "metadata": meta})
        else:
            self.send_json({"error": "File not found"}, 404)

    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())


with socketserver.TCPServer(("127.0.0.1", PORT), GSDHandler) as httpd:
    print(f"GSD UI Server running at http://127.0.0.1:{PORT}")
    print(f"Targeting: {TARGET_DIR}")
    httpd.serve_forever()

