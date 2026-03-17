import os
from functions import *
from flask import Flask, jsonify, render_template, abort, request

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


@app.route("/api/directorylisting")
def api_directory_listing():
    try:
        path_structure = get_markdown_directory_structure()
        fileName = request.args.get('fileName')
        
        if fileName == None: 
            return jsonify(path_structure)
        
        abs_path = find_path(path_structure, fileName)

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