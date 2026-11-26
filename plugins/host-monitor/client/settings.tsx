import { useSettings, type PluginSurfaceProps } from "@getpaseo/plugin/client";
import {
  SettingsAction,
  SettingsCard,
  SettingsSection,
  SettingsSwitch,
} from "@getpaseo/plugin/client/ui";
import { Text } from "react-native";
import { displaySettings, METRICS, type MetricKey } from "../shared/settings";

const LABELS: Record<MetricKey, string> = {
  cpu: "CPU",
  memory: "RAM",
  disk: "Disk",
  network: "Network speed",
  gpu: "GPU (NVIDIA only)",
};

/** The metrics the sidebar line shows for this host on this device. */
export function DisplaySettings({ theme, host }: PluginSurfaceProps) {
  const settings = useSettings(displaySettings);
  if (settings.status === "loading") return null;
  if (settings.status !== "ready") {
    return (
      <SettingsSection title="Sidebar">
        <SettingsCard>
          <SettingsAction
            label="The saved display settings cannot be read"
            hint={settings.error}
            actionLabel="Reset"
            onPress={() => void settings.reset()}
          />
        </SettingsCard>
      </SettingsSection>
    );
  }
  const { values, revision } = settings;
  const hidden = values.hidden[host.id] ?? [];
  const setShown = (metric: MetricKey, shown: boolean) => {
    const next = hidden.filter((key) => key !== metric);
    if (!shown) next.push(metric);
    void settings.save({ ...values, hidden: { ...values.hidden, [host.id]: next } }, revision);
  };
  return (
    <SettingsSection title={`Sidebar line for ${host.label}`}>
      <SettingsCard>
        {METRICS.map((metric) => (
          <SettingsSwitch
            key={metric}
            label={LABELS[metric]}
            value={!hidden.includes(metric)}
            disabled={settings.saving}
            onValueChange={(shown) => setShown(metric, shown)}
          />
        ))}
      </SettingsCard>
      <Text style={{ color: theme.colors.foregroundMuted, fontSize: 12, marginTop: 8 }}>
        Applies to this device, while the sidebar shows this host. With every metric off, the line
        disappears for this host. Other hosts have their own settings.
      </Text>
      {settings.saveError ? (
        <Text style={{ color: theme.colors.statusDanger, fontSize: 12, marginTop: 4 }}>
          {settings.saveError}
        </Text>
      ) : null}
    </SettingsSection>
  );
}
