import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";

export default function SignInScreen() {
  const { sendSignInLink, error, clearError, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const onSubmit = async () => {
    setLocalError(null);
    clearError();
    setBusy(true);
    try {
      await sendSignInLink(email);
      setSentTo(email.trim().toLowerCase());
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Could not send sign-in link.",
      );
    } finally {
      setBusy(false);
    }
  };

  const message = localError || error;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.brand}>NCAP</Text>
        <Text style={styles.title}>Sign in with email</Text>
        <Text style={styles.subtitle}>
          We will email you a one-tap sign-in link. No password needed.
        </Text>

        {sentTo ? (
          <View style={styles.card}>
            <Text style={styles.sentTitle}>Check your inbox</Text>
            <Text style={styles.sentBody}>
              A sign-in link was sent to{" "}
              <Text style={styles.emailHighlight}>{sentTo}</Text>. Open it on
              this device to finish signing in.
            </Text>
            <Pressable
              onPress={() => {
                setSentTo(null);
                setEmail("");
              }}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Use a different email</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="you@example.com"
              placeholderTextColor="#7A8A82"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              editable={!busy && !isLoading}
            />

            {message ? <Text style={styles.error}>{message}</Text> : null}

            <Pressable
              onPress={onSubmit}
              disabled={busy || isLoading || !email.trim()}
              style={[
                styles.button,
                (!email.trim() || busy || isLoading) && styles.buttonDisabled,
              ]}
            >
              {busy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Email me a sign-in link</Text>
              )}
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F4F7F5",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    justifyContent: "center",
  },
  brand: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#0B3D2E",
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#10231C",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: "#4A5C54",
    marginBottom: 28,
  },
  form: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10231C",
  },
  input: {
    borderWidth: 1,
    borderColor: "#C9D5CF",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: "#10231C",
  },
  button: {
    marginTop: 8,
    backgroundColor: "#0B3D2E",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "#A11B1B",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#D7E2DC",
    gap: 12,
  },
  sentTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#10231C",
  },
  sentBody: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4A5C54",
  },
  emailHighlight: {
    fontWeight: "700",
    color: "#0B3D2E",
  },
  secondaryButton: {
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: "#0B3D2E",
    fontWeight: "600",
  },
});
