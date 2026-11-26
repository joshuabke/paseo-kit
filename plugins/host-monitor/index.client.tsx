import type { PluginClientContext } from "@getpaseo/plugin/client";
import { DisplaySettings } from "./client/settings";
import { createHostStatusItem } from "./client/sidebar";
import { hostItemId } from "./shared/settings";
import { hostStatsRpc } from "./shared/stats";

const RETRY_MS = 5000;

// Paseo runs this once per host that has the plugin, and `client.rpc` reaches that host. The item
// id comes from the host's name, so every host gets its own footer line instead of one shared
// line with a host picker.
export default function contribute(client: PluginClientContext) {
  let stopped = false;
  let retry: ReturnType<typeof setTimeout> | undefined;
  const HostStatusItem = createHostStatusItem(() => client.openSettings("display"));

  const addItem = () => {
    client.rpc(hostStatsRpc, {}).then(
      ({ hostname }) => {
        if (stopped) return;
        client.addSidebarFooterItem({
          id: hostItemId(hostname),
          title: `Host status: ${hostname}`,
          Component: HostStatusItem,
        });
      },
      () => {
        if (!stopped) retry = setTimeout(addItem, RETRY_MS);
      },
    );
  };
  addItem();
  client.addSettingsScreen({
    id: "display",
    title: "Display",
    icon: "SlidersHorizontal",
    Component: DisplaySettings,
  });

  // Paseo removes the registrations itself when the plugin stops.
  return () => {
    stopped = true;
    clearTimeout(retry);
  };
}
