from .handlers import Handlers

class Router:
    def __init__(self):
        self.routes = {
            'GET': {
                '/api/health': Handlers.health,
                '/api/registry': Handlers.get_registry,
            },
            'POST': {
                '/api/registry': Handlers.post_registry,
            }
        }

    def handle(self, handler):
        method = handler.command
        path = handler.path.split('?')[0] # Basic path without query params

        if method in self.routes and path in self.routes[method]:
            self.routes[method][path](handler)
        else:
            Handlers.not_found(handler)
