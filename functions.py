import os

def get_markdown_directory_structure(path):
    d = {'name': os.path.basename(path), 'abspath': path}
    if os.path.isdir(path):
        d['type'] = "directory"
        d['children'] = [get_markdown_directory_structure(os.path.join(path, x)) for x in os.listdir(path)]
    else:
        d['type'] = "file"
        d['size'] = os.path.getsize(path) 
    return d

def find_path(structure, target):
    if structure["name"] == target:
        return structure["abspath"]

    if structure.get("type") == "directory":
        for child in structure.get("children", []):
            result = find_path(child, target)
            if result:
                return result

    return None