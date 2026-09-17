/**
 * Deterministic Firestore doc IDs matching scripts/seed_firestore.py
 * stable_url_id — sha256(url).hexdigest()[:32].
 */
import * as Crypto from "expo-crypto";

export async function stableUrlId(
  url: string,
  length = 32,
): Promise<string> {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    url.trim(),
  );
  return digest.slice(0, length);
}
