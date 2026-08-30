import { readFileSync } from "node:fs";
import type { ProviderConfig } from "./types.js";

function isProviderConfig(value: unknown): value is ProviderConfig {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.name === "string" &&
    typeof v.baseUrl === "string" &&
    typeof v.apiKeyEnv === "string" &&
    typeof v.model === "string"
  );
}

/**
 * Loads the provider catalog from a JSON config file. Providers whose API
 * key environment variable is unset are dropped, since we should never
 * report a provider as usable without credentials to reach it.
 */
export function loadProviders(configPath: string): ProviderConfig[] {
  let raw: string;
  try {
    raw = readFileSync(configPath, "utf-8");
  } catch {
    return [];
  }

  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error(`Provider config at ${configPath} must be a JSON array`);
  }

  return parsed.filter(isProviderConfig).filter((provider) => Boolean(process.env[provider.apiKeyEnv]));
}
