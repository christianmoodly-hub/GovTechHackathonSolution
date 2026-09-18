import { publicEnv } from "../../utils/publicEnv";

/**
 * App Check for the assistant's Gemini calls.
 *
 * The Firebase JS SDK only ships browser attestation providers (reCAPTCHA);
 * there is no Play Integrity / DeviceCheck provider for React Native. So on
 * device we register a CustomProvider that replays a debug token minted in the
 * Firebase console. That is enough to keep App Check in monitor mode while the
 * app is distributed as an internal APK.
 *
 * Before public launch: move to the native Firebase SDKs (or a Cloud Function
 * proxy) so real Play Integrity verdicts can be enforced.
 */
let initialised = false;

export function initAssistantAppCheck(): void {
  if (initialised) return;
  initialised = true;

  const debugToken = publicEnv("EXPO_PUBLIC_APP_CHECK_DEBUG_TOKEN");
  if (!debugToken) return;

  void (async () => {
    try {
      const [{ initializeAppCheck, CustomProvider }, { getFirebaseApp }] =
        await Promise.all([
          import("firebase/app-check"),
          import("../../firebase/client"),
        ]);

      initializeAppCheck(getFirebaseApp(), {
        provider: new CustomProvider({
          getToken: async () => ({
            token: debugToken,
            expireTimeMillis: Date.now() + 30 * 60 * 1000,
          }),
        }),
        isTokenAutoRefreshEnabled: true,
      });
    } catch (err) {
      console.warn("[assistant] App Check unavailable", err);
    }
  })();
}
