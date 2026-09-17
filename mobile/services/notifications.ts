import { Platform } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";

type NotificationsModule = typeof import("expo-notifications");

/** Expo Go (SDK 53+) throws on Android if expo-notifications is imported for push. */
function isExpoGo(): boolean {
  return Constants.appOwnership === "expo";
}

let notificationsPromise: Promise<NotificationsModule | null> | null = null;

async function loadNotifications(): Promise<NotificationsModule | null> {
  if (isExpoGo()) return null;
  if (!notificationsPromise) {
    notificationsPromise = import("expo-notifications")
      .then((Notifications) => {
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
          }),
        });
        return Notifications;
      })
      .catch((err) => {
        console.warn("[notifications] Failed to load expo-notifications", err);
        return null;
      });
  }
  return notificationsPromise;
}

/**
 * Register for Expo push notifications and return the Expo push token.
 * Returns null on web / Expo Go / simulators / permission denied.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Platform.OS === "web" || isExpoGo()) return null;
  if (!Device.isDevice) {
    console.log("[notifications] Push tokens require a physical device");
    return null;
  }

  const Notifications = await loadNotifications();
  if (!Notifications) return null;

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;
  if (status !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }
  if (status !== "granted") return null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  const token = await Notifications.getExpoPushTokenAsync(
    projectId ? { projectId } : undefined,
  );
  return token.data;
}

/**
 * DEMO STUB ONLY — not a real backend scheduler.
 * Skipped in Expo Go (push/local notification APIs unavailable there on Android).
 */
export async function scheduleFavouriteReminderStub(
  title: string,
): Promise<void> {
  if (Platform.OS === "web" || isExpoGo()) return;

  const Notifications = await loadNotifications();
  if (!Notifications) return;

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;
  if (status !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }
  if (status !== "granted") return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Come back and check your saved careers",
      body: `You saved “${title}”. Open NCAP to continue your path.`,
      data: { kind: "favourite-reminder-stub" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 20,
    },
  });
}
