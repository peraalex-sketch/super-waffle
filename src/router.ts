import type { ProviderConfig, ProviderHealth, RoutingCandidate, RoutingExplanation } from "./types.js";

const CIRCUIT_OPEN_THRESHOLD = 3;
const CIRCUIT_COOLDOWN_MS = 30_000;

/** Tracks per-provider failure streaks and applies a simple circuit breaker. */
export class HealthRegistry {
  private readonly health = new Map<string, ProviderHealth>();

  get(providerId: string): ProviderHealth {
    let entry = this.health.get(providerId);
    if (!entry) {
      entry = { circuit: "closed", consecutiveFailures: 0 };
      this.health.set(providerId, entry);
    }
    // A circuit that has cooled down moves to half-open, allowing one trial request.
    if (entry.circuit === "open" && entry.openedAt !== undefined) {
      if (Date.now() - entry.openedAt >= CIRCUIT_COOLDOWN_MS) {
        entry.circuit = "half_open";
      }
    }
    return entry;
  }

  recordSuccess(providerId: string, latencyMs: number): void {
    const entry = this.get(providerId);
    entry.circuit = "closed";
    entry.consecutiveFailures = 0;
    entry.openedAt = undefined;
    entry.recentLatencyMs = latencyMs;
  }

  recordFailure(providerId: string): void {
    const entry = this.get(providerId);
    entry.consecutiveFailures += 1;
    if (entry.circuit === "half_open" || entry.consecutiveFailures >= CIRCUIT_OPEN_THRESHOLD) {
      entry.circuit = "open";
      entry.openedAt = Date.now();
    }
  }
}

function clamp01(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}

function latencyFactor(latencyMs?: number): number {
  if (latencyMs === undefined) return 1;
  return Math.max(0.4, 1 - Math.min(latencyMs, 30_000) / 50_000);
}

/**
 * Scores a single provider candidate. Mirrors OmniRoute's adaptive routing
 * shape (health x reliability x latency x preference x circuit) reduced to
 * the factors this minimal gateway actually tracks.
 */
export function scoreCandidate(candidate: RoutingCandidate): RoutingExplanation {
  const { provider, health } = candidate;
  const reliability = clamp01(1 - health.consecutiveFailures / (CIRCUIT_OPEN_THRESHOLD * 2));
  const latency = latencyFactor(health.recentLatencyMs);
  const preference = clamp01(provider.preference ?? 0.5);
  const circuit = health.circuit === "open" ? 0 : health.circuit === "half_open" ? 0.5 : 1;

  const score = Number((reliability * latency * (0.5 + preference / 2) * circuit).toFixed(6));

  const reasons = [
    `circuit ${health.circuit}`,
    `${health.consecutiveFailures} consecutive failures`,
  ];
  if (health.recentLatencyMs !== undefined) {
    reasons.push(`recent latency ${Math.round(health.recentLatencyMs)}ms`);
  }

  return {
    providerId: provider.id,
    score,
    eligible: health.circuit !== "open" && score > 0,
    reasons,
  };
}

/** Ranks providers best-first, dropping ones whose circuit is open. */
export function rankProviders(providers: ProviderConfig[], registry: HealthRegistry): ProviderConfig[] {
  const ranked = providers
    .map((provider) => ({
      provider,
      explanation: scoreCandidate({ provider, health: registry.get(provider.id) }),
    }))
    .filter((entry) => entry.explanation.eligible)
    .sort((a, b) => b.explanation.score - a.explanation.score);

  return ranked.map((entry) => entry.provider);
}

/** Whether a failed attempt should fall through to the next ranked provider. */
export function shouldFailover(status: number | undefined, error: unknown): boolean {
  if (error !== undefined) return true; // network error / timeout
  if (status === undefined) return false;
  return status === 429 || status >= 500;
}
