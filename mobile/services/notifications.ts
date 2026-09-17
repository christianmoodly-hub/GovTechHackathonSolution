import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Register for Expo push notifications and return the Expo push token.
 * Returns null on web / simulators without support / permission denied.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Platform.OS === "web") return null;
  if (!Device.isDevice) {
    console.log("[notifications] Push tokens require a physical device");
    return null;
  }

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
 * When a user favourites something, schedule a one-off local reminder
 * on-device so the pitch can show "notifications" without Cloud Functions
 * or a push fan-out service. Replace with a real campaign/scheduler later.
 */
export async function scheduleFavouriteReminderStub(
  title: string,
): Promise<void> {
  if (Platform.OS === "web") return;

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
    // Short delay so the demo fires during a walkthrough without waiting overnight.
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 20,
    },
  });
}
