# super-waffle

A minimal multi-provider AI gateway with adaptive routing and automatic
failover, architecturally inspired by
[OmniRoute](https://github.com/diegosouzapw/OmniRoute)'s provider-catalog
and adaptive-routing design, scaled down to a small, dependency-light
starting point.

It exposes a single OpenAI-compatible endpoint and forwards each request to
the healthiest configured provider, falling over to the next one on a
retryable failure (timeout, network error, `429`, or `5xx`).

## How it works

- **`src/providers.ts`** loads a provider catalog from a JSON config file,
  dropping any provider whose API key environment variable isn't set.
- **`src/router.ts`** tracks per-provider health with a simple circuit
  breaker (`closed` → `open` after repeated failures → `half_open` after a
  cooldown) and ranks eligible providers by reliability, recent latency,
  and configured preference.
- **`src/gateway.ts`** sends the request to the top-ranked provider and, on
  a retryable failure, falls through to the next one.
- **`src/index.ts`** wires this into a small HTTP server with
  `POST /v1/chat/completions` and `GET /healthz`.

## Getting started

```bash
npm install
cp config/providers.example.json config/providers.json
export OPENAI_API_KEY=sk-...
export GROQ_API_KEY=gsk-...
npm run dev
```

```bash
curl localhost:8787/v1/chat/completions \
  -H 'content-type: application/json' \
  -d '{"messages":[{"role":"user","content":"hello"}]}'
```

Only providers with a set API key environment variable are loaded, so you
can configure as many or as few as you have keys for.

## Tests

```bash
npm test
```
