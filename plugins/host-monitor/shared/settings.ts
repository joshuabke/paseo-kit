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
export const displaySettings = defineSettings({
  id: "display",
  scope: "device",
  version: 1,
  schema: z.object({
    hidden: z.record(z.string(), z.array(z.enum(METRICS))).default({}),
  }),
});

