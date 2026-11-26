import assert from "node:assert/strict";
import { test } from "node:test";
import { displaySettings, hiddenMetrics, withMetricShown } from "../shared/settings";

test("no saved settings hide nothing", () => {
  const values = displaySettings.schema.parse({});
  assert.deepEqual(values, { hidden: {} });
  assert.deepEqual(hiddenMetrics(values, "srv_pc"), []);
});

test("each host keeps its own choice", () => {
  const values = displaySettings.schema.parse({ hidden: { srv_pc: ["network"], srv_linux: ["gpu"] } });
  assert.deepEqual(hiddenMetrics(values, "srv_pc"), ["network"]);
  assert.deepEqual(hiddenMetrics(values, "srv_linux"), ["gpu"]);
  assert.deepEqual(hiddenMetrics(values, "srv_mac"), []);
});

test("a switch changes only its host and metric", () => {
  const start = displaySettings.schema.parse({ hidden: { srv_linux: ["gpu"] } });
  const hidden = withMetricShown(start, "srv_pc", "network", false);
  assert.deepEqual(hidden.hidden, { srv_linux: ["gpu"], srv_pc: ["network"] });
  assert.deepEqual(withMetricShown(hidden, "srv_pc", "network", false).hidden.srv_pc, ["network"]);
  assert.deepEqual(withMetricShown(hidden, "srv_pc", "network", true).hidden, {
    srv_linux: ["gpu"],
    srv_pc: [],
  });
  assert.deepEqual(start, { hidden: { srv_linux: ["gpu"] } }, "the saved document is not mutated");
});

test("unknown metrics are rejected", () => {
  assert.equal(displaySettings.schema.safeParse({ hidden: { srv_pc: ["fan"] } }).success, false);
});
