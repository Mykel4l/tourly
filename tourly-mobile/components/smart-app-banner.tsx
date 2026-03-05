import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/lib/i18n";

// ─── Config ─────────────────────────────────────────────────────────────────

const DISMISSED_KEY = "@tourly:app-banner-dismissed";
/** Don't show the banner again for this many days after dismissal */
const DISMISS_DURATION_DAYS = 7;

// Replace these with your actual store URLs when published
const APP_STORE_URL = "https://apps.apple.com/app/tourly/id000000000";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.tourly.app";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getMobilePlatform(): "ios" | "android" | null {
  if (Platform.OS !== "web") return null; // native — no need for banner
  if (typeof navigator === "undefined") return null;

  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return null;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function SmartAppBanner() {
  const colors = useColors();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [mobilePlatform, setMobilePlatform] = useState<"ios" | "android" | null>(null);

  useEffect(() => {
    const platform = getMobilePlatform();
    if (!platform) return; // desktop or native — bail

    setMobilePlatform(platform);

    // Check if banner was recently dismissed
    AsyncStorage.getItem(DISMISSED_KEY).then((raw) => {
      if (raw) {
        const dismissedAt = Number(raw);
        const elapsed = Date.now() - dismissedAt;
        if (elapsed < DISMISS_DURATION_DAYS * 24 * 60 * 60 * 1000) return;
      }
      setVisible(true);
    });
  }, []);

  const dismiss = () => {
    setVisible(false);
    AsyncStorage.setItem(DISMISSED_KEY, String(Date.now()));
  };

  const openStore = () => {
    const url = mobilePlatform === "ios" ? APP_STORE_URL : PLAY_STORE_URL;
    Linking.openURL(url);
  };

  if (!visible) return null;

  const isIOS = mobilePlatform === "ios";
  const storeLabel = isIOS ? "App Store" : "Google Play";
  const storeIcon = isIOS ? "apple.logo" : "arrow.down.app.fill";

  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      exiting={FadeOutUp.duration(300)}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        paddingHorizontal: 12,
        paddingBottom: Platform.OS === "web" ? 12 : 0,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surface,
          borderRadius: 16,
          paddingVertical: 12,
          paddingHorizontal: 14,
          borderWidth: 1,
          borderColor: colors.border,
          // shadow
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
          gap: 12,
        }}
      >
        {/* App icon */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 22 }}>🌍</Text>
        </View>

        {/* Text content */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "800",
              color: colors.foreground,
              marginBottom: 2,
            }}
          >
            {t.bannerGetApp}
          </Text>
          <Text
            style={{ fontSize: 12, color: colors.muted, lineHeight: 16 }}
            numberOfLines={1}
          >
            {t.bannerFasterOn} {storeLabel}
          </Text>
        </View>

        {/* Open Store button */}
        <Pressable
          onPress={openStore}
          style={({ pressed }) => [
            {
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: colors.primary,
              paddingHorizontal: 14,
              paddingVertical: 9,
              borderRadius: 10,
            },
            pressed && { opacity: 0.8 },
          ]}
        >
          <IconSymbol name={storeIcon as any} size={14} color="#fff" />
          <Text style={{ fontSize: 12, fontWeight: "700", color: "#fff" }}>
            {t.bannerOpen}
          </Text>
        </Pressable>

        {/* Dismiss button */}
        <Pressable
          onPress={dismiss}
          hitSlop={8}
          style={({ pressed }) => [
            {
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: colors.muted + "18",
              alignItems: "center",
              justifyContent: "center",
            },
            pressed && { opacity: 0.6 },
          ]}
        >
          <IconSymbol name="xmark" size={11} color={colors.muted} />
        </Pressable>
      </View>
    </Animated.View>
  );
}
