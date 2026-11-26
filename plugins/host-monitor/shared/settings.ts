import { defineSettings } from "@getpaseo/plugin";
import { z } from "zod";

export const METRICS = ["cpu", "memory", "disk", "network", "gpu"] as const;
export type MetricKey = (typeof METRICS)[number];

/**
 * What the sidebar line leaves out for each host, by server id; the line shows whichever host the
 * app selects. Device scope keeps it on this device, and Paseo keys device settings by plugin id
 * alone, so the installations on every host read and write this one document: the Mac can hide
 * the PC's network speed without touching what the PC shows.
 */
const schema = z.object({
  hidden: z.record(z.string(), z.array(z.enum(METRICS))).default({}),
});
export type DisplayValues = z.output<typeof schema>;

export const displaySettings = defineSettings({ id: "display", scope: "device", version: 1, schema });

/** The metrics the line leaves out while it shows the host with this server id. */
export function hiddenMetrics(values: DisplayValues, serverId: string): readonly MetricKey[] {
  return values.hidden[serverId] ?? [];
}

/** The document after one switch: other hosts keep their choices. */
export function withMetricShown(
  values: DisplayValues,
  serverId: string,
  metric: MetricKey,
  shown: boolean,
): DisplayValues {
  const hidden = hiddenMetrics(values, serverId).filter((key) => key !== metric);
  if (!shown) hidden.push(metric);
  return { ...values, hidden: { ...values.hidden, [serverId]: hidden } };
}

