import http.server
import socketserver
import sys
import os
from server.router import Router

PORT = int(os.environ.get('PORT', 3000))

class UnifiedHandler(http.server.SimpleHTTPRequestHandler):
    router = Router()

    def do_GET(self):
        if self.path.startswith('/api/'):
            self.router.handle(self)
        else:
            # Fallback to serving static files from current directory
            # In Phase 1 Plan 02 we will add proper static serving
            super().do_GET()

    def do_POST(self):
        if self.path.startswith('/api/'):
            self.router.handle(self)
        else:
            self.send_error(404)

    def end_headers(self):
        # Ensure CORS for local dev
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

def run_server():
    # Ensure we are in the directory of app.py to serve files correctly if needed
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), UnifiedHandler) as httpd:
        print(f"Serving SDD UI Core at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            httpd.shutdown()

if __name__ == "__main__":
    run_server()
