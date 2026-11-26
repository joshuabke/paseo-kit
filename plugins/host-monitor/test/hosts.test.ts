import assert from "node:assert/strict";
import { test } from "node:test";
import { displaySettings, hostItemId } from "../shared/settings";

// Paseo's rule for contribution ids (packages/app/src/plugins/evaluate.ts).
const CONTRIBUTION_ID = /^[a-z][a-z0-9-]*$/;

test("each host gets its own sidebar item, so Paseo does not merge them into one", () => {
  const ids = ["Joshua-PC", "factory", "joshuas-mbp.local"].map(hostItemId);
  assert.deepEqual(ids, ["host-status-joshua-pc", "host-status-factory", "host-status-joshuas-mbp-local"]);
  for (const id of ids) assert.match(id, CONTRIBUTION_ID);
});

test("a host name with nothing usable still gives a valid id", () => {
  assert.equal(hostItemId("___"), "host-status");
});

test("no saved settings hide nothing", () => {
  assert.deepEqual(displaySettings.schema.parse({}), { hidden: {} });
});
