import http.server
import json
import os
import socketserver

DEFAULT_PORT = 3007
PORT = int(os.environ.get("SDD_UI_PORT", DEFAULT_PORT))
TARGET_DIR = os.environ.get("SDD_UI_PROJECT", os.environ.get("TARGET_DIR", "/Users/me/Sites/BMAD-METHOD"))


class BMADHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api/stats":
            self.send_stats()
        elif self.path == "/api/skills":
            self.send_skills()
        elif self.path == "/api/agents":
            self.send_agents()
        else:
            super().do_GET()

    def send_stats(self):
        skills = self.get_skills_data()
        flat_skills = [skill for group in skills.values() for skill in group]
        stats = {
            "pillarsCount": 4,
            "skillsCount": len(flat_skills),
            "agentsCount": 7
        }
        self.send_json(stats)

    def get_skills_data(self):
        skills_path = os.path.join(TARGET_DIR, "src", "bmm-skills")
        data = {
            "Analysis": [],
            "Planning": [],
            "Solutioning": [],
            "Implementation": []
        }
        mapping = {
            "1-analysis": "Analysis",
            "2-plan-workflows": "Planning",
            "3-solutioning": "Solutioning",
            "4-implementation": "Implementation"
        }

        if os.path.exists(skills_path):
            for directory in os.listdir(skills_path):
                if directory in mapping:
                    pillar_path = os.path.join(skills_path, directory)
                    if os.path.isdir(pillar_path):
                        for skill in os.listdir(pillar_path):
                            full_path = os.path.join(pillar_path, skill)
                            if not skill.startswith(".") and os.path.isdir(full_path):
                                data[mapping[directory]].append({
                                    "id": skill,
                                    "name": skill.replace("bmad-", "").replace("-", " ").title(),
                                    "path": f"{directory}/{skill}"
                                })
        return data

    def send_skills(self):
        self.send_json(self.get_skills_data())

    def send_agents(self):
        agents = [
            {"name": "Architect", "role": "System design and structural integrity"},
            {"name": "Analyst", "role": "Requirement gathering and business logic"},
            {"name": "Developer", "role": "Implementation and code quality"},
            {"name": "UX Designer", "role": "User experience and flow"},
            {"name": "Tester", "role": "Quality assurance and risk assessment"},
            {"name": "PM", "role": "Project management and timeline"},
            {"name": "Security", "role": "Threat modeling and hardening"}
        ]
        self.send_json(agents)

    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())


with socketserver.TCPServer(("127.0.0.1", PORT), BMADHandler) as httpd:
    print(f"BMAD UI Server running at http://127.0.0.1:{PORT}")
    print(f"Targeting: {TARGET_DIR}")
    httpd.serve_forever()

