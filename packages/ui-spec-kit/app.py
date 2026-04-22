import http.server
import json
import os
import socketserver

DEFAULT_PORT = 3005
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


class SpecKitHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api/stats":
            self.send_stats()
        elif self.path == "/api/specs":
            self.send_items("specs")
        elif self.path == "/api/plans":
            self.send_items("plans")
        elif self.path == "/api/tasks":
            self.send_items("tasks")
        else:
            super().do_GET()

    def send_stats(self):
        stats = {
            "specsCount": self.count_files("specs"),
            "plansCount": self.count_files("plans"),
            "tasksCount": self.count_files("tasks"),
            "tasksByStatus": self.get_tasks_stats()
        }
        self.send_json(stats)

    def count_files(self, subdir):
        subdir_path = os.path.join(TARGET_DIR, subdir)
        if not os.path.exists(subdir_path):
            return 0
        return len([name for name in os.listdir(subdir_path) if name.endswith(".md")])

    def get_items(self, subdir):
        subdir_path = os.path.join(TARGET_DIR, subdir)
        items = []
        if os.path.exists(subdir_path):
            for file_name in os.listdir(subdir_path):
                if file_name.endswith(".md"):
                    with open(os.path.join(subdir_path, file_name), "r", encoding="utf-8") as handle:
                        content = handle.read()
                        meta, body = get_frontmatter(content)
                        items.append({
                            "id": file_name[:-3],
                            "title": meta.get("title", file_name[:-3]),
                            "content": body,
                            "metadata": meta,
                            "status": meta.get("status", "todo") if subdir == "tasks" else None
                        })
        return items

    def get_tasks_stats(self):
        tasks = self.get_items("tasks")
        stats = {"todo": 0, "in-progress": 0, "done": 0}
        for task in tasks:
            status = task.get("status", "todo").lower()
            if status in stats:
                stats[status] += 1
            else:
                stats["todo"] += 1
        return stats

    def send_items(self, subdir):
        self.send_json(self.get_items(subdir))

    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())


with socketserver.TCPServer(("127.0.0.1", PORT), SpecKitHandler) as httpd:
    print(f"Spec-Kit UI Server running at http://127.0.0.1:{PORT}")
    print(f"Targeting: {TARGET_DIR}")
    httpd.serve_forever()

