import type { Href } from "expo-router";

/** Bypass stale typed-routes until Expo regenerates `.expo/types`. */
export function href(path: string): Href {
  return path as Href;
}
