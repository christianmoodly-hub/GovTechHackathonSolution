import Constants from "expo-constants";

/** Read EXPO_PUBLIC_* from Metro inline env or app.config.js `extra` (EAS release). */
export function publicEnv(name: string): string | undefined {
  const fromProcess = process.env[name];
  if (fromProcess) return fromProcess;
  const extra = Constants.expoConfig?.extra as Record<string, unknown> | undefined;
  const fromExtra = extra?.[name];
  return typeof fromExtra === "string" && fromExtra.length > 0
    ? fromExtra
    : undefined;
}
