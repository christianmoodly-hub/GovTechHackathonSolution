import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getOfflineVaultStats,
  type OfflineVaultStats,
} from "../services/offlineVault";

const EMPTY: OfflineVaultStats = {
  careersCached: 0,
  qualificationsCached: 0,
  providersCached: 0,
  blueprintsCached: 0,
  pendingProfileWrites: 0,
  pendingHelplineWrites: 0,
  storageLabel: "0 MB cached",
  meterPercent: 0,
};

/** Live offline vault counts for status bars and Saved screen. */
export function useVaultStats(): OfflineVaultStats & { refresh: () => void } {
  const { user } = useAuth();
  const [stats, setStats] = useState<OfflineVaultStats>(EMPTY);

  const refresh = useCallback(() => {
    void getOfflineVaultStats(user?.uid).then(setStats);
  }, [user?.uid]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...stats, refresh };
}
