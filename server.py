import os
from functions import *
from flask import Flask, jsonify, render_template, abort

BASE_DIR = os.path.abspath("./static/markdown")

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/<path:page>")
def render_page(page:str):
    try:
        return render_template(page)
    except:
        abort(404)

@app.route("/api/hello")
def api_hello():
    return jsonify({"message": "Hello from API"})


@app.route("/api/directorylisting/<filename>")
def api_directory_listing(filename: str):
    try:
        base_path = os.path.abspath("./static/markdown")
        path_structure = get_markdown_directory_structure(base_path)

        abs_path = find_path(path_structure, filename)

        if abs_path:
            return jsonify({"path": abs_path})
        else:
            return jsonify({"error": "File not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
    
@app.errorhandler(404)
def not_found(e):
    return render_template("404.html"), 404

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=7575, debug=True)