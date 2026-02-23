import React from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { TOP_NAV_HEIGHT } from "@/lib/nav-mode";

export { TOP_NAV_HEIGHT } from "@/lib/nav-mode";

// ─── Props ──────────────────────────────────────────────────────────────────

export interface TopNavBarProps {
  /** Center title. Omit for icon-only / brand use. */
  title?: string;
  /** Show a back button on the left. */
  showBack?: boolean;
  /** Custom back handler — defaults to router.back(). */
  onBack?: () => void;
  /** Extra icon/button(s) on the right side. */
  rightContent?: React.ReactNode;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function TopNavBar({ title, showBack, onBack, rightContent }: TopNavBarProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onBack) { onBack(); return; }
    if (router.canGoBack()) router.back(); else router.replace("/");
  };

  return (
    <View
      style={{
        backgroundColor: colors.background,
        paddingTop: insets.top,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: TOP_NAV_HEIGHT,
          paddingHorizontal: 8,
        }}
      >
        {/* Left slot — back button */}
        <View style={{ width: 44, alignItems: "center", justifyContent: "center" }}>
          {showBack && (
            <Pressable
              onPress={handleBack}
              hitSlop={12}
              style={({ pressed }) => [
                { padding: 8, borderRadius: 50 },
                pressed && { opacity: 0.7 },
              ]}
            >
              <IconSymbol name="chevron.left" size={22} color={colors.foreground} />
            </Pressable>
          )}
        </View>

        {/* Centre — title */}
        <View style={{ flex: 1, alignItems: "center" }}>
          {title ? (
            <Text
              numberOfLines={1}
              style={{ fontSize: 16, fontWeight: "700", color: colors.foreground }}
            >
              {title}
            </Text>
          ) : null}
        </View>

        {/* Right slot */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, minWidth: 44, justifyContent: "flex-end" }}>
          {rightContent}
        </View>
      </View>
    </View>
  );
}
