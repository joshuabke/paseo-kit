import assert from "node:assert/strict";
import { test } from "node:test";
import { displaySettings } from "../shared/settings";

test("no saved settings hide nothing", () => {
  assert.deepEqual(displaySettings.schema.parse({}), { hidden: {} });
});

test("hidden metrics are kept per host and unknown metrics are rejected", () => {
  const values = { hidden: { srv_pc: ["network", "gpu"], srv_linux: [] } };
  assert.deepEqual(displaySettings.schema.parse(values), values);
  assert.equal(displaySettings.schema.safeParse({ hidden: { srv_pc: ["fan"] } }).success, false);
});
