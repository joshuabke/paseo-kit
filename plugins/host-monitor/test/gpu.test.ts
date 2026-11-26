import assert from "node:assert/strict";
import { test } from "node:test";
import { parseNvidiaSmi } from "../server/sampler";

const MIB = 1024 * 1024;

test("reads nvidia-smi on Windows", () => {
  // RTX 5070 Ti, idle, as cmd.exe prints it (CRLF).
  const output = "NVIDIA GeForce RTX 5070 Ti, 0, 23.15, 300.00, 0, 16303, 43\r\n";
  assert.deepEqual(parseNvidiaSmi(output), [
    {
      name: "NVIDIA GeForce RTX 5070 Ti",
      utilizationPercent: 0,
      powerWatts: 23.15,
      powerLimitWatts: 300,
      memoryUsedBytes: 0,
      memoryTotalBytes: 16303 * MIB,
      temperatureCelsius: 43,
    },
  ]);
});

test("turns missing readings into null and keeps every GPU", () => {
  const output = [
    "NVIDIA A100-SXM4-40GB, 87, 251.30, 400.00, 30120, 40960, 61",
    "Tesla K80, [N/A], [Not Supported], [N/A], 11, 11441, 30",
    "",
  ].join("\n");
  const [a100, k80] = parseNvidiaSmi(output);
  assert.equal(a100?.utilizationPercent, 87);
  assert.equal(a100?.memoryUsedBytes, 30120 * MIB);
  assert.equal(k80?.name, "Tesla K80");
  assert.equal(k80?.utilizationPercent, null);
  assert.equal(k80?.powerWatts, null);
  assert.equal(k80?.powerLimitWatts, null);
  assert.equal(k80?.temperatureCelsius, 30);
});

test("a comma in the name does not shift the numbers", () => {
  const [gpu] = parseNvidiaSmi("Some, GPU, 5, 10.5, 100, 1, 2, 40\n");
  assert.equal(gpu?.name, "Some, GPU");
  assert.equal(gpu?.utilizationPercent, 5);
});

test("no GPU, no rows", () => {
  assert.deepEqual(parseNvidiaSmi(""), []);
  assert.deepEqual(parseNvidiaSmi("No devices were found\n"), []);
});
