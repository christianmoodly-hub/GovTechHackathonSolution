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
  search: "search",
  bookmark: "bookmark",
  bookmark_border: "bookmark-border",
  bookmark_add: "bookmark-add",
  tune: "tune",
  build: "build",
  computer: "computer",
  medical_services: "medical-services",
  agriculture: "agriculture",
  eco: "eco",
  nature: "nature",
  wb_sunny: "wb-sunny",
  code: "code",
  trending_up: "trending-up",
  payments: "payments",
  tips_and_updates: "tips-and-updates",
  download: "download",
  share: "share",
  menu_book: "menu-book",
  calculate: "calculate",
  assignment_turned_in: "assignment-turned-in",
  biotech: "biotech",
  palette: "palette",
  fitness_center: "fitness-center",
  thumb_up: "thumb-up",
  cloud_sync: "cloud-sync",
  offline_pin: "offline-pin",
  chevron_left: "chevron-left",
  translate: "translate",
  location_on: "location-on",
  groups: "groups",
  schedule: "schedule",
  precision_manufacturing: "precision-manufacturing",
  psychology: "psychology",
  work_history: "work-history",
  handyman: "handyman",
  grid_view: "grid-view",
  local_fire_department: "local-fire-department",
  format_quote: "format-quote",
  policy: "policy",
  sync: "sync",
  alt_route: "alt-route",
  account_tree: "account-tree",
  data_saver_on: "data-saver-on",
  rule: "rule",
  folder_shared: "folder-shared",
  cloud_done: "cloud-done",
  psychology: "psychology",
  bookmarks: "bookmarks",
  task_alt: "task-alt",
  pin_drop: "place",
  handshake: "handshake",
  picture_as_pdf: "picture-as-pdf",
  inventory_2: "inventory-2",
  lightbulb: "lightbulb",
  roofing: "roofing",
  pause_circle: "pause-circle-filled",
  save: "save",
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
