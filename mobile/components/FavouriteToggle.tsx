import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { toggleFavourite } from "../services/ncapData";
import { scheduleFavouriteReminderStub } from "../services/notifications";
import type { FavouriteType } from "../services/types";

type Props = {
  type: FavouriteType;
  url: string;
  title: string;
};

export function FavouriteToggle({ type, url, title }: Props) {
  const { user, profile, refreshProfile } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const favourited = (profile?.favourites ?? []).some((item) => item.url === url);

  if (!user) {
    return (
      <Text style={styles.hint}>Sign in to save favourites</Text>
    );
  }

  const onToggle = async () => {
    if (busy || !url) return;
    setBusy(true);
    setError(null);
    try {
      const { added } = await toggleFavourite(
        user.uid,
        { type, url, title },
        profile?.favourites ?? [],
      );
      await refreshProfile();
      if (added) {
        // DEMO STUB: local one-off reminder — see notifications.ts
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
          <ActivityIndicator color={favourited ? "#0B3D2E" : "#fff"} />
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
    backgroundColor: "#0B3D2E",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 120,
    alignItems: "center",
  },
  buttonActive: {
    backgroundColor: "#D8E8E0",
    borderWidth: 1,
    borderColor: "#0B3D2E",
  },
  label: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  labelActive: {
    color: "#0B3D2E",
  },
  hint: {
    fontSize: 13,
    color: "#6A7B73",
  },
  error: {
    marginTop: 6,
    color: "#A11B1B",
    fontSize: 13,
  },
});
