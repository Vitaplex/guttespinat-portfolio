from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os

class CustomHandler(SimpleHTTPRequestHandler):
    def send_error(self, code, message=None):
        if code == 404:
            self.send_response(404)
            self.send_header('Content-Type', 'text/html')
            self.end_headers()
            with open('404.html', 'rb') as f:
                self.wfile.write(f.read())
        else:
            super().send_error(code, message)

if __name__ == '__main__':
    PORT = 8080
    with ThreadingHTTPServer(('localhost', PORT), CustomHandler) as server:
        print(f"Serving on http://localhost:{PORT}")
        server.serve_forever()
