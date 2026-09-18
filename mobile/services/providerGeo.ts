import { Linking, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ProviderSummary } from "./types";
import { publicEnv } from "../utils/publicEnv";

const CACHE_KEY = "ncap.providerGeo.v1";
const GEOCODE_ENDPOINT = "https://maps.googleapis.com/maps/api/geocode/json";

export type LatLng = { latitude: number; longitude: number };

export type ProviderWithDistance = ProviderSummary & {
  distanceKm: number | null;
  coords: LatLng | null;
};

type GeoCache = Record<string, LatLng>;

function mapsApiKey(): string | null {
  const key = publicEnv("EXPO_PUBLIC_GOOGLE_MAPS_API_KEY")?.trim();
  return key ? key : null;
}

export function hasGoogleMapsApiKey(): boolean {
  return Boolean(mapsApiKey());
}

async function readCache(): Promise<GeoCache> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as GeoCache;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function writeCache(cache: GeoCache): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore cache write failures
  }
}

function cacheKeyFor(provider: ProviderSummary): string {
  return [
    provider.id,
    provider.name,
    provider.streetAddress ?? "",
  ]
    .join("|")
    .toLowerCase();
}

function geocodeQuery(provider: ProviderSummary): string {
  const address = provider.streetAddress?.trim();
  if (address) return `${address}, South Africa`;
  return `${provider.name}, South Africa`;
}

/** Haversine distance in kilometres. */
export function distanceKm(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function formatDistanceKm(km: number | null): string {
  if (km == null || !Number.isFinite(km)) return "Distance unknown";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

export async function geocodeProvider(
  provider: ProviderSummary,
  cache?: GeoCache,
): Promise<LatLng | null> {
  const key = mapsApiKey();
  if (!key) return null;

  const store = cache ?? (await readCache());
  const cacheId = cacheKeyFor(provider);
  if (store[cacheId]) return store[cacheId];

  const query = encodeURIComponent(geocodeQuery(provider));
  const url = `${GEOCODE_ENDPOINT}?address=${query}&region=za&key=${key}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      status: string;
      results?: Array<{ geometry?: { location?: { lat: number; lng: number } } }>;
    };
    if (data.status !== "OK" || !data.results?.[0]?.geometry?.location) {
      return null;
    }
    const loc = data.results[0].geometry.location;
    const coords: LatLng = { latitude: loc.lat, longitude: loc.lng };
    store[cacheId] = coords;
    await writeCache(store);
    return coords;
  } catch {
    return null;
  }
}

/**
 * Geocode a batch of providers (sequential to respect Geocoding rate limits).
 * Returns the same list annotated with coords + distance from `origin`.
 */
export async function rankProvidersByDistance(
  providers: ProviderSummary[],
  origin: LatLng,
  opts?: { limit?: number; onProgress?: (done: number, total: number) => void },
): Promise<ProviderWithDistance[]> {
  const limit = opts?.limit ?? 40;
  const slice = providers.slice(0, limit);
  const cache = await readCache();
  const ranked: ProviderWithDistance[] = [];

  for (let i = 0; i < slice.length; i++) {
    const provider = slice[i];
    const coords = await geocodeProvider(provider, cache);
    const km = coords ? distanceKm(origin, coords) : null;
    ranked.push({ ...provider, coords, distanceKm: km });
    opts?.onProgress?.(i + 1, slice.length);
  }

  ranked.sort((a, b) => {
    if (a.distanceKm == null && b.distanceKm == null) return 0;
    if (a.distanceKm == null) return 1;
    if (b.distanceKm == null) return -1;
    return a.distanceKm - b.distanceKm;
  });

  return ranked;
}

export async function openProviderInMaps(
  name: string,
  streetAddress?: string | null,
  coords?: LatLng | null,
): Promise<void> {
  const label = [name, streetAddress].filter(Boolean).join(", ");
  if (coords) {
    const { latitude, longitude } = coords;
    const url =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?ll=${latitude},${longitude}&q=${encodeURIComponent(label || name)}`
        : `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    await Linking.openURL(url);
    return;
  }
  await Linking.openURL(
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(label || name)}`,
  );
}

/** Open Google Maps search for public tertiary institutions near a point. */
export async function openNearbyEducationSearch(origin: LatLng): Promise<void> {
  const { latitude, longitude } = origin;
  const query = encodeURIComponent("university OR TVET college");
  await Linking.openURL(
    `https://www.google.com/maps/search/${query}/@${latitude},${longitude},12z`,
  );
}
