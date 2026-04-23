import json

class Handlers:
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
        # For now, return an empty list. Task 2 will implement the RegistryManager.
        response = []
        handler.wfile.write(json.dumps(response).encode('utf-8'))

    @staticmethod
    def not_found(handler):
        handler.send_response(404)
        handler.send_header('Content-type', 'application/json')
        handler.send_header('Access-Control-Allow-Origin', '*')
        handler.end_headers()
        response = {'error': 'Not Found'}
        handler.wfile.write(json.dumps(response).encode('utf-8'))
