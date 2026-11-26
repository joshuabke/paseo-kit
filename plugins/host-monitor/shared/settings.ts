import { defineSettings } from "@getpaseo/plugin";
import { z } from "zod";

export const METRICS = ["cpu", "memory", "disk", "network", "gpu"] as const;
export type MetricKey = (typeof METRICS)[number];

/**
 * What each host's sidebar line leaves out, by server id. Device scope keeps it on this device, and
 * Paseo keys device settings by plugin id alone, so the installations on every host read and write
 * this one document: the Mac can hide the PC's network speed without touching what the PC shows.
 */
export const displaySettings = defineSettings({
  id: "display",
  scope: "device",
  version: 1,
  schema: z.object({
    hidden: z.record(z.string(), z.array(z.enum(METRICS))).default({}),
  }),
});

/**
 * The sidebar item id for one host. Paseo shows an item that several hosts contribute under the
 * same id only once, from one host, so each host's line needs its own id to appear next to the others.
 */
export function hostItemId(hostname: string): string {
  // ponytail: two daemons with the same hostname share one line again; key by server id if that happens.
  const slug = hostname.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug ? `host-status-${slug}` : "host-status";
}
