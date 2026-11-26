import type { PluginClientContext } from "@getpaseo/plugin/client";
import { DisplaySettings } from "./client/settings";
import { createHostStatusItem } from "./client/sidebar";

export default function contribute(client: PluginClientContext) {
  client.addSidebarFooterItem({
    id: "host-status",
    title: "Host status",
    Component: createHostStatusItem(() => client.openSettings("display")),
  });
  client.addSettingsScreen({
    id: "display",
    title: "Display",
    icon: "SlidersHorizontal",
    Component: DisplaySettings,
  });
  return () => {};
}
