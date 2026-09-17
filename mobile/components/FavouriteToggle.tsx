import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
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
};

export function FavouriteToggle({ type, url, title, entityId }: Props) {
  const { user, profile, refreshProfile } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const favourited = (profile?.favourites ?? []).some((item) => item.url === url);

  if (!user) {
    return <Text style={styles.hint}>Sign in to save favourites</Text>;
  }

  const onToggle = async () => {
    if (busy || !url) return;
    setBusy(true);
    setError(null);
    try {
      const { added } = await toggleFavourite(
        user.uid,
        { type, url, title, entityId },
        profile?.favourites ?? [],
      );
      await refreshProfile();
      if (added) {
        await scheduleFavouriteReminderStub(title);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update favourite");
    } finally {
      setBusy(false);
    }
  };

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
});
