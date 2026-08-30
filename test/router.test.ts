import { test } from "node:test";
import assert from "node:assert/strict";
import { HealthRegistry, rankProviders, shouldFailover } from "../src/router.js";
import type { ProviderConfig } from "../src/types.js";

const providerA: ProviderConfig = {
  id: "a",
  name: "A",
  baseUrl: "https://a.example/v1",
  apiKeyEnv: "A_KEY",
  model: "model-a",
  preference: 0.9,
};

const providerB: ProviderConfig = {
  id: "b",
  name: "B",
  baseUrl: "https://b.example/v1",
  apiKeyEnv: "B_KEY",
  model: "model-b",
  preference: 0.2,
};

test("ranks a higher-preference, healthy provider first", () => {
  const registry = new HealthRegistry();
  const ranked = rankProviders([providerB, providerA], registry);
  assert.deepEqual(ranked.map((p) => p.id), ["a", "b"]);
});

test("opens the circuit after repeated failures and drops the provider from ranking", () => {
  const registry = new HealthRegistry();
  registry.recordFailure("a");
  registry.recordFailure("a");
  registry.recordFailure("a");

  const ranked = rankProviders([providerA, providerB], registry);
  assert.deepEqual(ranked.map((p) => p.id), ["b"]);
});

test("a success resets the failure streak and closes the circuit", () => {
  const registry = new HealthRegistry();
  registry.recordFailure("a");
  registry.recordFailure("a");
  registry.recordSuccess("a", 120);

  const health = registry.get("a");
  assert.equal(health.circuit, "closed");
  assert.equal(health.consecutiveFailures, 0);
});

test("shouldFailover retries on network errors, timeouts, 429, and 5xx", () => {
  assert.equal(shouldFailover(undefined, new Error("network")), true);
  assert.equal(shouldFailover(429, undefined), true);
  assert.equal(shouldFailover(503, undefined), true);
  assert.equal(shouldFailover(400, undefined), false);
  assert.equal(shouldFailover(200, undefined), false);
});
