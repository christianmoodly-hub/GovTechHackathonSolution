import {
  flushProfileOutbox,
  getOccupationSummaries,
  getOccupation,
  getQualification,
  getProvider,
  getBursary,
  prefetchProviderIndex,
  prefetchQualificationIndex,
  prefetchBursaryIndex,
  readCachedOccupationCount,
  readCachedProviderCount,
  readCachedQualificationCount,
  readCachedBursaryCount,
} from "./ncapData";
import { listOfflineBlueprints } from "./offlineBlueprint";
import {
  flushHelplineOutbox,
  outboxPendingCount,
  readHelplineOutbox,
} from "./offlineProfile";
import type { FavouriteRef } from "./types";

export type OfflineVaultStats = {
  careersCached: number;
  qualificationsCached: number;
  providersCached: number;
  bursariesCached: number;
  blueprintsCached: number;
  pendingProfileWrites: number;
  pendingHelplineWrites: number;
  /** Approximate label e.g. "2.1 MB cached" */
  storageLabel: string;
  /** 0–100 rough fill based on expected offline pack size */
  meterPercent: number;
};

function estimateMb(stats: {
  careers: number;
  quals: number;
  providers: number;
  bursaries: number;
  blueprints: number;
}): number {
  // Rough JSON/PDF estimates for the status UI only
  const bytes =
    stats.careers * 180 +
    stats.quals * 220 +
    stats.providers * 200 +
    stats.bursaries * 260 +
    stats.blueprints * 120_000;
  return bytes / (1024 * 1024);
}

export async function getOfflineVaultStats(
  uid?: string | null,
): Promise<OfflineVaultStats> {
  const [
    careersCached,
    qualificationsCached,
    providersCached,
    bursariesCached,
    blueprints,
    pendingProfileWrites,
    helpline,
  ] = await Promise.all([
    readCachedOccupationCount(),
    readCachedQualificationCount(),
    readCachedProviderCount(),
    readCachedBursaryCount(),
    listOfflineBlueprints(),
    uid ? outboxPendingCount(uid) : Promise.resolve(0),
    readHelplineOutbox(),
  ]);

  const mb = estimateMb({
    careers: careersCached,
    quals: qualificationsCached,
    providers: providersCached,
    bursaries: bursariesCached,
    blueprints: blueprints.length,
  });
  const targetMb = 12;
  const meterPercent = Math.min(100, Math.round((mb / targetMb) * 100));

  return {
    careersCached,
    qualificationsCached,
    providersCached,
    bursariesCached,
    blueprintsCached: blueprints.length,
    pendingProfileWrites,
    pendingHelplineWrites: helpline.length,
    storageLabel: `${mb < 0.1 ? mb.toFixed(2) : mb.toFixed(1)} MB cached`,
    meterPercent,
  };
}

export type PrepareOfflinePackResult = {
  careers: number;
  qualifications: number;
  providers: number;
  bursaries: number;
  favouritesCached: number;
};

export async function prepareOfflinePack(options: {
  uid?: string | null;
  favourites?: FavouriteRef[];
  onProgress?: (message: string) => void;
}): Promise<PrepareOfflinePackResult> {
  const { onProgress } = options;

  onProgress?.("Caching careers…");
  const occ = await getOccupationSummaries({ forceRefresh: true });

  onProgress?.("Caching qualifications…");
  const quals = await prefetchQualificationIndex();

  onProgress?.("Caching campuses…");
  const providers = await prefetchProviderIndex();

  onProgress?.("Caching bursaries…");
  const bursaries = await prefetchBursaryIndex();

  let favouritesCached = 0;
  const favourites = options.favourites ?? [];
  if (favourites.length) {
    onProgress?.("Caching favourites…");
    for (const fav of favourites) {
      if (!fav.entityId) continue;
      try {
        if (fav.type === "occupation") {
          await getOccupation(fav.entityId);
        } else if (fav.type === "qualification") {
          await getQualification(fav.entityId);
        } else if (fav.type === "bursary") {
          await getBursary(fav.entityId);
        } else {
          await getProvider(fav.entityId);
        }
        favouritesCached += 1;
      } catch {
        // skip
      }
    }
  }

  return {
    careers: occ.summaries.length,
    qualifications: quals.count,
    providers: providers.count,
    bursaries: bursaries.count,
    favouritesCached,
  };
}

export type SyncVaultResult = {
  profileFlushed: number;
  helplineFlushed: number;
  refreshedCareers: number;
};

export async function syncVault(options: {
  uid?: string | null;
  online: boolean;
}): Promise<SyncVaultResult> {
  if (!options.online) {
    throw new Error("Connect to the internet to sync your vault.");
  }

  let profileFlushed = 0;
  if (options.uid) {
    profileFlushed = await flushProfileOutbox(options.uid);
  }
  const helplineFlushed = await flushHelplineOutbox();

  let refreshedCareers = 0;
  try {
    const occ = await getOccupationSummaries({ forceRefresh: true });
    refreshedCareers = occ.summaries.length;
  } catch {
    // Keep existing career cache if refresh fails
  }

  return { profileFlushed, helplineFlushed, refreshedCareers };
}
