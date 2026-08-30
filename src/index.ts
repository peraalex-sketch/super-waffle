import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { loadProviders } from "./providers.js";
import { HealthRegistry } from "./router.js";
import { routeChatCompletion } from "./gateway.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = process.env.PROVIDERS_CONFIG_PATH ?? path.join(__dirname, "..", "config", "providers.json");
const PORT = Number(process.env.PORT ?? 8787);

const providers = loadProviders(CONFIG_PATH);
const registry = new HealthRegistry();

const server = createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/healthz") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ status: "ok", providers: providers.map((p) => p.id) }));
    return;
  }

  if (req.method === "POST" && req.url === "/v1/chat/completions") {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);

    let requestBody: unknown;
    try {
      requestBody = JSON.parse(Buffer.concat(chunks).toString("utf-8") || "{}");
    } catch {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "invalid_json" }));
      return;
    }

    const result = await routeChatCompletion(providers, registry, requestBody);
    res.writeHead(result.status, { "content-type": "application/json" });
    res.end(JSON.stringify(result.body));
    return;
  }

  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: "not_found" }));
});

server.listen(PORT, () => {
  console.log(`super-waffle gateway listening on :${PORT} (${providers.length} provider(s) configured)`);
});
