import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { MaterialIcon } from "./MaterialIcon";
import { useAuth } from "../contexts/AuthContext";
import { toggleFavourite } from "../services/ncapData";
import { scheduleFavouriteReminderStub } from "../services/notifications";
import type { FavouriteType } from "../services/types";
import { colors, radii, spacing, typography } from "../theme";

type Props = {
  type: FavouriteType;
  url: string;
  title: string;
  entityId?: string;
  compact?: boolean;
};

export function FavouriteToggle({
  type,
  url,
  title,
  entityId,
  compact = false,
}: Props) {
  const { user, profile, refreshProfile, applyLocalProfile } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const favourited = (profile?.favourites ?? []).some((item) => item.url === url);

  if (!user) {
    return compact ? null : (
      <Text style={styles.hint}>Sign in to save favourites</Text>
    );
  }

  const onToggle = async () => {
    if (busy || !url) return;
    setBusy(true);
    setError(null);
    try {
      const { favourites, added } = await toggleFavourite(
        user.uid,
        { type, url, title, entityId },
        profile?.favourites ?? [],
      );
      if (profile) {
        applyLocalProfile({ ...profile, favourites });
      } else {
        await refreshProfile();
      }
      if (added) {
        await scheduleFavouriteReminderStub(title);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update favourite");
    } finally {
      setBusy(false);
    }
  };

  if (compact) {
    return (
      <Pressable
        onPress={() => void onToggle()}
        disabled={busy}
        style={[styles.iconBtn, favourited && styles.iconBtnActive]}
        accessibilityRole="button"
        accessibilityState={{ selected: favourited, busy }}
        accessibilityLabel={favourited ? "Remove from favourites" : "Add to favourites"}
      >
        {busy ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <MaterialIcon
            name={favourited ? "bookmark" : "bookmark_border"}
            size={22}
            color={favourited ? colors.primary : colors.textSecondary}
          />
        )}
      </Pressable>
    );
  }

  return (
    <>
      <Pressable
        onPress={() => void onToggle()}
        disabled={busy}
        style={[styles.button, favourited && styles.buttonActive]}
        accessibilityRole="button"
        accessibilityState={{ selected: favourited, busy }}
        accessibilityLabel={favourited ? "Remove from favourites" : "Add to favourites"}
      >
        {busy ? (
          <ActivityIndicator color={favourited ? colors.primary : colors.onPrimary} />
        ) : (
          <Text style={[styles.label, favourited && styles.labelActive]}>
            {favourited ? "★ Favourited" : "☆ Favourite"}
          </Text>
        )}
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minWidth: 120,
    alignItems: "center",
  },
  buttonActive: {
    backgroundColor: colors.primaryMuted,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  label: {
    ...typography.labelLg,
    color: colors.onPrimary,
  },
  labelActive: {
    color: colors.primary,
  },
  hint: {
    ...typography.bodySm,
    color: colors.textMuted,
  },
  error: {
    marginTop: spacing.sm,
    color: colors.error,
    ...typography.bodySm,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnActive: {
    backgroundColor: colors.muted,
  },
});
