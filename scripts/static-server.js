const http = require("http");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const port = 4173;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
};

function resolvePath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0]);
  const normalizedPath = cleanPath === "/" ? "/index.html" : cleanPath;
  const filePath = path.normalize(path.join(rootDir, normalizedPath));

  if (!filePath.startsWith(rootDir)) {
    return null;
  }

  return filePath;
}

const server = http.createServer((request, response) => {
  const filePath = resolvePath(request.url || "/");

  if (!filePath) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";

    response.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(filePath).pipe(response);
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Static server running at http://127.0.0.1:${port}`);
});
