export interface ProviderConfig {
  id: string;
  name: string;
  /** Base URL of an OpenAI-compatible chat completions API. */
  baseUrl: string;
  /** Name of the environment variable holding this provider's API key. */
  apiKeyEnv: string;
  /** Model ID to request at this provider. */
  model: string;
  /** Relative preference when multiple providers are otherwise equal (0-1, default 0.5). */
  preference?: number;
}

export type CircuitState = "closed" | "open" | "half_open";

export interface ProviderHealth {
  circuit: CircuitState;
  consecutiveFailures: number;
  openedAt?: number;
  recentLatencyMs?: number;
}

export interface RoutingCandidate {
  provider: ProviderConfig;
  health: ProviderHealth;
}

export interface RoutingExplanation {
  providerId: string;
  score: number;
  eligible: boolean;
  reasons: string[];
}
