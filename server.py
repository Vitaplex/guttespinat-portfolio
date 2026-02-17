from flask import Flask, jsonify, render_template, abort

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

@app.errorhandler(404)
def not_found(e):
    return render_template("404.html"), 404

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=7575, debug=True)
