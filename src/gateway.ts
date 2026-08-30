import type { ProviderConfig } from "./types.js";
import { HealthRegistry, rankProviders, shouldFailover } from "./router.js";

export interface GatewayResult {
  status: number;
  body: unknown;
  providerId?: string;
}

const REQUEST_TIMEOUT_MS = 20_000;

async function callProvider(provider: ProviderConfig, requestBody: unknown): Promise<Response> {
  const apiKey = process.env[provider.apiKeyEnv];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(`${provider.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ ...(requestBody as Record<string, unknown>), model: provider.model }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Routes an OpenAI-compatible chat completion request across the given
 * providers, ranked by health, falling over to the next candidate on a
 * retryable failure (timeout, network error, 429, or 5xx).
 */
export async function routeChatCompletion(
  providers: ProviderConfig[],
  registry: HealthRegistry,
  requestBody: unknown
): Promise<GatewayResult> {
  const ranked = rankProviders(providers, registry);
  if (ranked.length === 0) {
    return { status: 503, body: { error: "no_available_providers" } };
  }

  let lastFailure: GatewayResult = { status: 502, body: { error: "all_providers_failed" } };

  for (const provider of ranked) {
    const startedAt = Date.now();
    try {
      const response = await callProvider(provider, requestBody);
      const latencyMs = Date.now() - startedAt;

      if (response.ok) {
        registry.recordSuccess(provider.id, latencyMs);
        return { status: response.status, body: await response.json(), providerId: provider.id };
      }

      registry.recordFailure(provider.id);
      lastFailure = { status: response.status, body: await response.json().catch(() => ({})), providerId: provider.id };
      if (!shouldFailover(response.status, undefined)) return lastFailure;
    } catch (error) {
      registry.recordFailure(provider.id);
      lastFailure = { status: 502, body: { error: "provider_unreachable" }, providerId: provider.id };
      if (!shouldFailover(undefined, error)) return lastFailure;
    }
  }

  return lastFailure;
}
