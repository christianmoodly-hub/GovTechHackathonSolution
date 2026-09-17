import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const OTP_PREFIX = "ncap.registrationOtp.";
const OTP_TTL_MS = 10 * 60 * 1000;

type StoredOtp = {
  hash: string;
  expiresAt: number;
  attempts: number;
};

function storageKey(email: string) {
  return `${OTP_PREFIX}${email.trim().toLowerCase()}`;
}

async function hashCode(code: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    code.trim(),
  );
}

function generateCode(): string {
  const n = Math.floor(Math.random() * 1_000_000);
  return String(n).padStart(6, "0");
}

async function deliverOtpEmail(email: string, code: string): Promise<boolean> {
  // Best-effort email delivery without a Cloud Function.
  // FormSubmit delivers to the recipient address; first use may require inbox activation.
  try {
    const res = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(email)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: "Khetha NCAP verification code",
          _template: "box",
          message: `Your Khetha NCAP one-time verification code is ${code}. It expires in 10 minutes. If you did not request this, ignore this email.`,
        }),
      },
    );
    if (!res.ok) {
      const body = await res.text();
      console.warn("[otp] email provider responded", res.status, body.slice(0, 200));
      return false;
    }
    console.log("[otp] verification email requested for", email);
    return true;
  } catch (err) {
    console.warn("[otp] email delivery failed", err);
    return false;
  }
}

export type IssueOtpResult = {
  email: string;
  emailed: boolean;
  /** Present when email delivery failed so the user can still complete signup. */
  fallbackCode?: string;
  expiresInSeconds: number;
};

export async function issueRegistrationOtp(email: string): Promise<IssueOtpResult> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed.includes("@")) {
    throw new Error("Enter a valid email address to receive your verification code.");
  }

  const code = generateCode();
  const hash = await hashCode(code);
  const payload: StoredOtp = {
    hash,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  };
  await AsyncStorage.setItem(storageKey(trimmed), JSON.stringify(payload));

  // Always log so Metro shows the code when email delivery is blocked.
  console.log(`[otp] Khetha verification code for ${trimmed}: ${code}`);

  const emailed = await deliverOtpEmail(trimmed, code);
  return {
    email: trimmed,
    emailed,
    fallbackCode: emailed ? undefined : code,
    expiresInSeconds: Math.floor(OTP_TTL_MS / 1000),
  };
}

export async function verifyRegistrationOtp(
  email: string,
  code: string,
): Promise<void> {
  const trimmed = email.trim().toLowerCase();
  const raw = await AsyncStorage.getItem(storageKey(trimmed));
  if (!raw) {
    throw new Error("No verification code found. Request a new code.");
  }

  const stored = JSON.parse(raw) as StoredOtp;
  if (Date.now() > stored.expiresAt) {
    await AsyncStorage.removeItem(storageKey(trimmed));
    throw new Error("That code has expired. Request a new one.");
  }
  if (stored.attempts >= 5) {
    await AsyncStorage.removeItem(storageKey(trimmed));
    throw new Error("Too many incorrect attempts. Request a new code.");
  }

  const hash = await hashCode(code);
  if (hash !== stored.hash) {
    stored.attempts += 1;
    await AsyncStorage.setItem(storageKey(trimmed), JSON.stringify(stored));
    throw new Error("Incorrect verification code. Check the email and try again.");
  }

  await AsyncStorage.removeItem(storageKey(trimmed));
}

export async function clearRegistrationOtp(email: string): Promise<void> {
  await AsyncStorage.removeItem(storageKey(email.trim().toLowerCase()));
}
