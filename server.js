import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.join(root, "index.html");
const notFoundPath = path.join(root, "404.html");
const port = Number(process.env.PORT ?? 3001);

const server = createServer(async (request, response) => {
  if (request.method !== "GET") {
    response.writeHead(405, {
      Allow: "GET",
      "Content-Type": "text/plain; charset=utf-8",
    });
    response.end("Method not allowed");
    return;
  }

  const found = ["/", "/index.html"].includes(request.url);

  try {
    const page = await readFile(found ? indexPath : notFoundPath);
    response.writeHead(found ? 200 : 404, {
      "Content-Type": "text/html; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(page);
  } catch (error) {
    console.error("Failed to load index.html:", error);
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Unable to load page.");
  }
});

server.listen(port, () => {
  console.log(`Website available at http://localhost:${port}`);
});
