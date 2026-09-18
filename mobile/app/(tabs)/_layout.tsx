import { Tabs } from "expo-router";
import { MaterialIcon } from "../../components/MaterialIcon";
import { useAccessibility } from "../../contexts/AccessibilityContext";
import { useLocale } from "../../contexts/LocaleContext";
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
  const { tabs } = useLocale();

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
          title: tabs.home,
          tabBarIcon: ({ color }) => <TabIcon name="roofing" color={color} />,
        }}
      />
      <Tabs.Screen
        name="questionnaires"
        options={{
          title: tabs.decisions,
          tabBarIcon: ({ color }) => <TabIcon name="explore" color={color} />,
        }}
      />
      <Tabs.Screen
        name="directory"
        options={{
          title: tabs.directory,
          tabBarIcon: ({ color }) => <TabIcon name="menu_book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: tabs.saved,
          tabBarIcon: ({ color }) => <TabIcon name="bookmark" color={color} />,
        }}
      />
      <Tabs.Screen
        name="helpline"
        options={{
          title: tabs.helpline,
          tabBarIcon: ({ color }) => (
            <TabIcon name="support_agent" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
