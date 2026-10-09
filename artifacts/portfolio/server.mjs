import { createServer } from "node:http";
import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handleContactRequest } from "./server/contact-handler.mjs";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const publicDirectory = path.join(projectRoot, "dist", "public");
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function sendText(res, status, text) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(text);
}

async function serveFile(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    sendText(res, 405, "Method not allowed");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url ?? "/", "http://localhost").pathname);
  } catch {
    sendText(res, 400, "Bad request");
    return;
  }

  const requestedPath = path.resolve(publicDirectory, `.${pathname}`);
  if (
    requestedPath !== publicDirectory &&
    !requestedPath.startsWith(`${publicDirectory}${path.sep}`)
  ) {
    sendText(res, 403, "Forbidden");
    return;
  }

  let filePath = requestedPath;
  try {
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) filePath = path.join(filePath, "index.html");
    await fs.access(filePath);
  } catch {
    if (path.extname(pathname)) {
      sendText(res, 404, "Not found");
      return;
    }
    filePath = path.join(publicDirectory, "index.html");
  }

  try {
    const stats = await fs.stat(filePath);
    res.statusCode = 200;
    res.setHeader(
      "Content-Type",
      mimeTypes[path.extname(filePath).toLowerCase()] ?? "application/octet-stream",
    );
    res.setHeader("Content-Length", stats.size);
    res.setHeader("X-Content-Type-Options", "nosniff");
    if (req.method === "HEAD") {
      res.end();
    } else {
      createReadStream(filePath).pipe(res);
    }
  } catch {
    sendText(res, 404, "Not found");
  }
}

const port = Number(process.env.PORT || 21113);
const server = createServer(async (req, res) => {
  try {
    if (await handleContactRequest(req, res)) return;
    await serveFile(req, res);
  } catch {
    if (!res.headersSent) sendText(res, 500, "Internal server error");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.info(`Portfolio server listening on port ${port}`);
});
