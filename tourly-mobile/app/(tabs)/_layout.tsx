import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/lib/i18n";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 68 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 2,
          marginBottom: 2,
        },
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabHome,
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="destinations"
        options={{
          title: t.tabExplore,
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="map.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="packages"
        options={{
          title: t.tabTrips,
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="suitcase.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: t.tabSaved,
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="heart.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: t.tabGallery,
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="photo.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
