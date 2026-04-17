import glob
import os
import re
from pathlib import Path

BASE_DIR = os.path.join(os.getcwd(), "static", "markdown")
BASE_URL = "/static/markdown"
HTML_DIR = "/templates"

def get_markdown_directory_structure(path=BASE_DIR):
    rel_path = os.path.relpath(path, BASE_DIR).replace("\\", "/")

    d = {
        'name': os.path.basename(path),
        'url': f"{BASE_URL}/{rel_path}" if rel_path != "." else BASE_URL,
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
        d['title'] = get_title_from_markdown_file(os.path.join(path))
        d['html'] = get_corresponding_html_file(os.path.join(path))

    return d

def get_title_from_markdown_file(path):
    file = ''.join(open(path, errors="ignore").readlines(512))
    title = re.search(r"#\s*(.*?)\n",file)
    return title.groups(1)[0] if title is not None else str(os.path.basename(path)).split(".")[0]

def get_corresponding_html_file(file_name:str):
    file_name = os.path.basename(file_name).replace(".md",".html")
    files = glob.glob(f"{HTML_DIR}**/{file_name}")
    
    return files

def find_path(structure, target):
    if structure.get("type") == "file" and (structure["name"] == target or structure["name"] == target + ".md"):
        return structure["url"]

    if structure.get("type") == "directory":
        for child in structure.get("children", []):
            result = find_path(child, target)
            if result:
                return result

    return None