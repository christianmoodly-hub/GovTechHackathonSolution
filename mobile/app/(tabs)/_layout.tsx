import { Tabs } from "expo-router";
import { MaterialIcon } from "../../components/MaterialIcon";
import { useAccessibility } from "../../contexts/AccessibilityContext";
import { typography } from "../../theme";

function TabIcon({
  name,
  color,
}: {
  name: string;
  color: string;
}) {
  return <MaterialIcon name={name} size={22} color={color} />;
}

export default function TabsLayout() {
  const { colors, highContrast } = useAccessibility();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: highContrast ? "#444444" : colors.textMuted,
        tabBarLabelStyle: {
          ...typography.caption,
          fontWeight: "600",
        },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: highContrast ? 2 : 1,
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
          tabBarIcon: ({ color }) => <TabIcon name="roofing" color={color} />,
        }}
      />
      <Tabs.Screen
        name="questionnaires"
        options={{
          title: "Decisions",
          tabBarIcon: ({ color }) => <TabIcon name="explore" color={color} />,
        }}
      />
      <Tabs.Screen
        name="directory"
        options={{
          title: "Directory",
          tabBarIcon: ({ color }) => <TabIcon name="menu_book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color }) => <TabIcon name="bookmark" color={color} />,
        }}
      />
      <Tabs.Screen
        name="helpline"
        options={{
          title: "Helpline",
          tabBarIcon: ({ color }) => (
            <TabIcon name="support_agent" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
