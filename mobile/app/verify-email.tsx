import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AuthFooter } from "../components/auth/AuthFooter";
import { AuthHeader } from "../components/auth/AuthHeader";
import { MaterialIcon } from "../components/MaterialIcon";
import { useAuth } from "../contexts/AuthContext";
import { useLocale } from "../contexts/LocaleContext";
import { colors, layout, radii, shadows, spacing, typography } from "../theme";
import { href } from "../utils/href";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { strings } = useLocale();
  const t = strings.auth;
  const {
    user,
    profile,
    resendEmailVerification,
    refreshEmailVerification,
    signOut,
    error,
    clearError,
  } = useAuth();

  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const message = localError || error;

  const continueIfVerified = useCallback(
    async (opts?: { silent?: boolean }) => {
      setLocalError(null);
      clearError();
      if (!opts?.silent) setBusy(true);
      try {
        const verified = await refreshEmailVerification();
        if (!verified) {
          if (!opts?.silent) {
            setLocalError(t.errNotVerified);
          }
          return false;
        }
        const hasDemographics = Boolean(profile?.demographics?.completedAt);
        router.replace(href(hasDemographics ? "/" : "/onboarding"));
        return true;
      } catch (err) {
        if (!opts?.silent) {
          setLocalError(
            err instanceof Error ? err.message : t.errRefreshVerification,
          );
        }
        return false;
      } finally {
        if (!opts?.silent) setBusy(false);
      }
    },
    [
      clearError,
      profile?.demographics?.completedAt,
      refreshEmailVerification,
      router,
      t.errNotVerified,
      t.errRefreshVerification,
    ],
  );

  // When returning from the browser after tapping the email link, re-check automatically.
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (next === "active") {
        void continueIfVerified({ silent: true });
      }
    });
    return () => sub.remove();
  }, [continueIfVerified]);

  const onResend = async () => {
    setLocalError(null);
    clearError();
    setBusy(true);
    try {
      await resendEmailVerification();
      setResent(true);
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : t.errResendVerification,
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <AuthHeader title={t.verifyTitle} showBack={false} />
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <MaterialIcon name="mail" size={32} color={colors.primary} />
          </View>
          <Text style={styles.title}>{t.confirmEmail}</Text>
          <Text style={styles.body}>
            {t.verifyBodyPrefix}{" "}
            <Text style={styles.emphasis}>
              {user?.email ?? t.yourEmail}
            </Text>
            {t.verifyBodySuffix}
          </Text>

          {resent ? (
            <Text style={styles.success}>{t.resentSuccess}</Text>
          ) : null}
          {message ? <Text style={styles.error}>{message}</Text> : null}

          <Pressable
            style={[styles.primaryBtn, busy && styles.disabled]}
            disabled={busy}
            onPress={() => void continueIfVerified()}
          >
            {busy ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <>
                <MaterialIcon name="check_circle" size={20} color={colors.onPrimary} />
                <Text style={styles.primaryText}>{t.iveVerified}</Text>
              </>
            )}
          </Pressable>

          <Pressable
            style={[styles.secondaryBtn, busy && styles.disabled]}
            disabled={busy}
            onPress={() => void onResend()}
          >
            <MaterialIcon name="mail" size={18} color={colors.primary} />
            <Text style={styles.secondaryText}>{t.resendVerification}</Text>
          </Pressable>

          <Pressable
            onPress={() => void signOut()}
            disabled={busy}
            style={styles.signOut}
          >
            <Text style={styles.signOutText}>{t.useDifferentAccount}</Text>
          </Pressable>
        </View>
      </View>
      <AuthFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9F9FF" },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: "center",
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadows.card,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  title: {
    ...typography.headlineSm,
    color: colors.text,
    textAlign: "center",
  },
  body: {
    ...typography.bodySm,
    color: colors.textSecondary,
    textAlign: "center",
  },
  emphasis: { fontWeight: "700", color: colors.primary },
  success: { ...typography.bodySm, color: colors.success, textAlign: "center" },
  error: { ...typography.bodySm, color: colors.error, textAlign: "center" },
  primaryBtn: {
    minHeight: layout.minTouch,
    backgroundColor: colors.primaryDark,
    borderRadius: radii.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: spacing.sm,
  },
  primaryText: { ...typography.labelLg, color: colors.onPrimary },
  secondaryBtn: {
    minHeight: layout.minTouch,
    backgroundColor: "#E7EEFF",
    borderRadius: radii.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  secondaryText: { ...typography.labelLg, color: colors.primary },
  disabled: { opacity: 0.5 },
  signOut: { alignItems: "center", paddingVertical: spacing.sm },
  signOutText: {
    ...typography.labelMd,
    color: colors.textSecondary,
    textDecorationLine: "underline",
  },
});
