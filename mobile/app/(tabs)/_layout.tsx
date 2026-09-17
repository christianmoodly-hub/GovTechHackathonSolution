import { Tabs } from "expo-router";
import { Text } from "react-native";
import { colors, typography } from "../../theme";

function TabIcon({ label, color }: { label: string; color: string }) {
  return (
    <Text style={{ color, fontSize: 16, fontWeight: "700" }}>{label}</Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          ...typography.caption,
          fontWeight: "600",
        },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabIcon label="⌂" color={color} />,
        }}
      />
      <Tabs.Screen
        name="questionnaires"
        options={{
          title: "Decisions",
          tabBarIcon: ({ color }) => <TabIcon label="◎" color={color} />,
        }}
      />
      <Tabs.Screen
        name="directory"
        options={{
          title: "Directory",
          tabBarIcon: ({ color }) => <TabIcon label="▦" color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color }) => <TabIcon label="★" color={color} />,
        }}
      />
      <Tabs.Screen
        name="helpline"
        options={{
          title: "Helpline",
          tabBarIcon: ({ color }) => <TabIcon label="☎" color={color} />,
        }}
      />
    </Tabs>
  );
}
