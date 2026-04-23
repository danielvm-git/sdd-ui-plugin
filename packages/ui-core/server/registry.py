import os
import json
from datetime import datetime

class RegistryManager:
    def __init__(self, registry_path=None):
        if registry_path is None:
            self.registry_dir = os.path.expanduser("~/.sdd-ui")
            self.registry_path = os.path.join(self.registry_dir, "registry.json")
        else:
            self.registry_path = registry_path
            self.registry_dir = os.path.dirname(self.registry_path)
            
        self._ensure_dir()

    def _ensure_dir(self):
        if not os.path.exists(self.registry_dir):
            os.makedirs(self.registry_dir, exist_ok=True)

    def load(self):
        if not os.path.exists(self.registry_path):
            return []
        try:
            with open(self.registry_path, 'r') as f:
                data = json.load(f)
                if not isinstance(data, list):
                    return []
                return data
        except (json.JSONDecodeError, IOError):
            return []

    def save(self, registry_data):
        self._ensure_dir()
        try:
            with open(self.registry_path, 'w') as f:
                json.dump(registry_data, f, indent=2)
            # Set permissions to 600 as per T-01-01-01
            os.chmod(self.registry_path, 0o600)
            return True
        except IOError:
            return False

    def get_all(self):
        return self.load()

    def add_source(self, name, path, source_type='unknown'):
        # T-01-01-02: Validate path exists and is absolute
        if not os.path.isabs(path):
            return False, "Path must be absolute"
        if not os.path.exists(path):
            return False, "Path does not exist on disk"

        registry = self.load()
        
        # Check if path already exists
        for item in registry:
            if item['path'] == path:
                return False, "Source already registered"

        new_item = {
            "id": str(int(datetime.now().timestamp() * 1000)),
            "name": name,
            "path": path,
            "type": source_type,
            "added_at": datetime.now().isoformat()
        }
        
        registry.append(new_item)
        if self.save(registry):
            return True, new_item
        return False, "Failed to save registry"
