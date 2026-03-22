import os

BASE_DIR = os.path.join(os.getcwd(), "static", "markdown")
BASE_URL = "/static/markdown"

def get_markdown_directory_structure(path=BASE_DIR):
    rel_path = os.path.relpath(path, BASE_DIR).replace("\\", "/")

    d = {
        'name': os.path.basename(path),
        'url': f"{BASE_URL}/{rel_path}" if rel_path != "." else BASE_URL
    }

    if os.path.isdir(path):
        d['type'] = "directory"
        d['children'] = [
            get_markdown_directory_structure(os.path.join(path, x))
            for x in os.listdir(path)
        ]
    else:
        d['type'] = "file"
        d['size'] = os.path.getsize(path)

    return d


def find_path(structure, target):
    if structure.get("type") == "file" and (structure["name"] == target or structure["name"] == target + ".md"):
        return structure["url"]

    if structure.get("type") == "directory":
        for child in structure.get("children", []):
            result = find_path(child, target)
            if result:
                return result

    return None