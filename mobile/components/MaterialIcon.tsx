import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { ComponentProps } from "react";
import { StyleProp, TextStyle } from "react-native";

type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];
type CommunityIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

/** Map Stitch Material Symbols (snake_case) → Expo MaterialIcons / CommunityIcons. */
const MATERIAL_MAP: Record<string, MaterialIconName> = {
  arrow_back: "arrow-back",
  arrow_forward: "arrow-forward",
  badge: "badge",
  bolt: "bolt",
  call: "call",
  celebration: "celebration",
  chat: "chat",
  check: "check",
  check_circle: "check-circle",
  chevron_right: "chevron-right",
  close: "close",
  contact_phone: "contact-phone",
  contact_support: "contact-support",
  contrast: "contrast",
  engineering: "engineering",
  expand_more: "expand-more",
  explore: "explore",
  fingerprint: "fingerprint",
  flight: "flight",
  format_size: "format-size",
  history_edu: "history-edu",
  lock: "lock",
  lock_open: "lock-open",
  lock_reset: "lock-reset",
  mail: "mail",
  mark_chat_read: "mark-chat-read",
  open_in_new: "open-in-new",
  person: "person",
  person_add: "person-add",
  pin: "pin",
  rocket_launch: "rocket-launch",
  school: "school",
  sms: "sms",
  stars: "stars",
  support_agent: "support-agent",
  timer: "timer",
  verified: "verified",
  verified_user: "verified-user",
  visibility: "visibility",
  visibility_off: "visibility-off",
  warning: "warning",
  wifi_tethering: "wifi-tethering",
  work_outline: "work-outline",
  account_balance: "account-balance",
  auto_stories: "auto-stories",
  accessible_forward: "accessible-forward",
  send_to_mobile: "phonelink-setup",
};

const COMMUNITY_MAP: Record<string, CommunityIconName> = {
  cell_tower: "broadcast",
  whatsapp: "whatsapp",
};

type Props = {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export function MaterialIcon({ name, size = 20, color, style }: Props) {
  const community = COMMUNITY_MAP[name];
  if (community) {
    return (
      <MaterialCommunityIcons
        name={community}
        size={size}
        color={color}
        style={style}
      />
    );
  }

  const mapped =
    MATERIAL_MAP[name] ?? (name.replace(/_/g, "-") as MaterialIconName);

  return <MaterialIcons name={mapped} size={size} color={color} style={style} />;
}
