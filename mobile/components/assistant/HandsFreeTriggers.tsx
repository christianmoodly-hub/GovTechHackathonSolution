import { useEffect, useRef } from "react";
import { NativeModules, Platform } from "react-native";
import { Accelerometer } from "expo-sensors";
import { useAssistant } from "../../contexts/AssistantContext";

const SHAKE_G = 2.15;
const SHAKE_COOLDOWN_MS = 1600;
const VOLUME_HOLD_MS = 550;
const VOLUME_RESET_MS = 380;

/**
 * Hands-free entry: long-press volume-down (Android) and shake-to-talk.
 * Each trigger opens the overlay and asks it to start recording; the overlay
 * announces "Listening" so a blind user knows the mic is live.
 *
 * Volume-down is Android-only (iOS owns the button). A single tap still
 * changes volume — only a held stream of down events is captured.
 *
 * `react-native-volume-manager` is a bare native module. Requiring it in Expo
 * Go throws at import time and takes down the root layout, so we only load it
 * when NativeModules.VolumeManager is actually present (dev / production builds).
 */
export function HandsFreeTriggers() {
  const { status, busy, requestListen } = useAssistant();
  const armedRef = useRef(false);
  const lastShakeRef = useRef(0);

  useEffect(() => {
    armedRef.current = busy || status === "listening" || status === "transcribing";
  }, [busy, status]);

  useEffect(() => {
    const fire = () => {
      if (armedRef.current) return;
      armedRef.current = true;
      requestListen();
    };

    const shakeSub = subscribeShake(fire, lastShakeRef);
    const volumeSub = Platform.OS === "android" ? subscribeVolumeHold(fire) : null;

    return () => {
      shakeSub?.remove();
      volumeSub?.remove();
    };
  }, [requestListen]);

  return null;
}

function subscribeShake(
  fire: () => void,
  lastShakeRef: { current: number },
): { remove: () => void } | null {
  try {
    Accelerometer.setUpdateInterval(80);
    return Accelerometer.addListener(({ x, y, z }) => {
      const g = Math.sqrt(x * x + y * y + z * z);
      if (g < SHAKE_G) return;
      const now = Date.now();
      if (now - lastShakeRef.current < SHAKE_COOLDOWN_MS) return;
      lastShakeRef.current = now;
      fire();
    });
  } catch {
    return null;
  }
}

function loadVolumeManager(): typeof import("react-native-volume-manager").VolumeManager | null {
  if (Platform.OS === "web") return null;
  if (!NativeModules.VolumeManager) return null;
  try {
    return require("react-native-volume-manager").VolumeManager ?? null;
  } catch {
    return null;
  }
}

function subscribeVolumeHold(fire: () => void): { remove: () => void } | null {
  const VolumeManager = loadVolumeManager();
  if (typeof VolumeManager?.addVolumeListener !== "function") return null;

  let last = -1;
  let holdOrigin: number | null = null;
  let holdStarted = 0;
  let resetTimer: ReturnType<typeof setTimeout> | null = null;
  let restoring = false;

  let sub: { remove: () => void };
  try {
    sub = VolumeManager.addVolumeListener((result) => {
      const volume = result.volume;
      if (restoring) {
        restoring = false;
        last = volume;
        return;
      }
      if (last < 0) {
        last = volume;
        return;
      }

      const previous = last;
      const goingDown = volume < previous - 0.008;
      last = volume;

      if (!goingDown) {
        holdOrigin = null;
        if (resetTimer) clearTimeout(resetTimer);
        return;
      }

      if (holdOrigin === null) {
        holdOrigin = previous;
        holdStarted = Date.now();
      }

      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        holdOrigin = null;
      }, VOLUME_RESET_MS);

      if (Date.now() - holdStarted < VOLUME_HOLD_MS) return;

      const restoreTo = Math.min(1, Math.max(0, holdOrigin));
      holdOrigin = null;
      restoring = true;
      void VolumeManager.setVolume(restoreTo, {
        showUI: false,
        playSound: false,
      }).catch(() => undefined);
      fire();
    });
  } catch {
    return null;
  }

  return {
    remove() {
      if (resetTimer) clearTimeout(resetTimer);
      sub.remove();
    },
  };
}
