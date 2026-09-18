import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { useAuth } from "./AuthContext";
import { useConnectivity } from "./ConnectivityContext";
import { flushProfileOutbox } from "../services/ncapData";
import { flushHelplineOutbox } from "../services/offlineProfile";

/**
 * When connectivity returns (or app resumes online), flush pending
 * profile and helpline outbox writes.
 */
export function ConnectivitySync() {
  const { canSync } = useConnectivity();
  const { user, refreshProfile } = useAuth();
  const flushing = useRef(false);
  const wasOnline = useRef(canSync);

  const flush = async () => {
    if (flushing.current || !canSync) return;
    flushing.current = true;
    try {
      if (user?.uid) {
        const n = await flushProfileOutbox(user.uid);
        if (n > 0) await refreshProfile();
      }
      await flushHelplineOutbox();
    } catch (err) {
      console.warn("[ConnectivitySync] flush failed", err);
    } finally {
      flushing.current = false;
    }
  };

  useEffect(() => {
    const cameOnline = canSync && !wasOnline.current;
    wasOnline.current = canSync;
    if (cameOnline) {
      void flush();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSync, user?.uid]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && canSync) {
        void flush();
      }
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSync, user?.uid, refreshProfile]);

  return null;
}
