import { useCallback, useRef, useState } from "react";
import {
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import {
  MAX_RECORDING_SECONDS,
  MIN_RECORDING_MS,
  VOICE_RECORDING_OPTIONS,
  deleteClip,
  readClip,
  type VoiceClip,
} from "../services/voice/recording";
import { stopSpeaking } from "../services/voice/speech";

export type RecorderFailure =
  | "permission-denied"
  | "too-short"
  | "empty"
  | "failed";

export type StopResult =
  | { ok: true; clip: VoiceClip }
  | { ok: false; reason: RecorderFailure };

export function useVoiceRecorder() {
  const recorder = useAudioRecorder(VOICE_RECORDING_OPTIONS);
  const [isRecording, setIsRecording] = useState(false);
  const startedAtRef = useRef(0);
  /** Guards against overlapping start/stop from a key, a shake and a tap. */
  const transitioningRef = useRef(false);

  const ensurePermission = useCallback(async () => {
    const existing = await getRecordingPermissionsAsync();
    if (existing.granted) return true;
    if (!existing.canAskAgain) return false;
    const asked = await requestRecordingPermissionsAsync();
    return asked.granted;
  }, []);

  const start = useCallback(async (): Promise<
    { ok: true } | { ok: false; reason: RecorderFailure }
  > => {
    if (transitioningRef.current || isRecording) return { ok: true };
    transitioningRef.current = true;

    try {
      if (!(await ensurePermission())) {
        return { ok: false, reason: "permission-denied" };
      }

      // Never record our own voice back into the prompt.
      stopSpeaking();

      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync(VOICE_RECORDING_OPTIONS);
      recorder.record({ forDuration: MAX_RECORDING_SECONDS });

      startedAtRef.current = Date.now();
      setIsRecording(true);
      return { ok: true };
    } catch (err) {
      console.warn("[assistant] could not start recording", err);
      return { ok: false, reason: "failed" };
    } finally {
      transitioningRef.current = false;
    }
  }, [ensurePermission, isRecording, recorder]);

  const stop = useCallback(async (): Promise<StopResult> => {
    if (!isRecording) return { ok: false, reason: "failed" };

    const heldFor = Date.now() - startedAtRef.current;
    setIsRecording(false);

    let uri: string | null = null;
    try {
      await recorder.stop();
      uri = recorder.uri;
    } catch (err) {
      console.warn("[assistant] could not stop recording", err);
      return { ok: false, reason: "failed" };
    } finally {
      // Hand the audio session back so text-to-speech is audible again.
      await setAudioModeAsync({ allowsRecording: false }).catch(() => undefined);
    }

    if (heldFor < MIN_RECORDING_MS) {
      if (uri) await deleteClip(uri);
      return { ok: false, reason: "too-short" };
    }
    if (!uri) return { ok: false, reason: "empty" };

    try {
      const clip = await readClip(uri);
      await deleteClip(uri);
      // A fraction of a second of silence still produces a header-only file.
      if (clip.bytes < 1024) return { ok: false, reason: "empty" };
      return { ok: true, clip };
    } catch (err) {
      console.warn("[assistant] could not read recording", err);
      await deleteClip(uri);
      return { ok: false, reason: "empty" };
    }
  }, [isRecording, recorder]);

  const cancel = useCallback(async () => {
    if (!isRecording) return;
    setIsRecording(false);
    try {
      await recorder.stop();
      if (recorder.uri) await deleteClip(recorder.uri);
    } catch {
      // Nothing usable to clean up.
    } finally {
      await setAudioModeAsync({ allowsRecording: false }).catch(() => undefined);
    }
  }, [isRecording, recorder]);

  return { isRecording, start, stop, cancel };
}
