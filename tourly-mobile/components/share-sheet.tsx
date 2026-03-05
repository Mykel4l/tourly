import { useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  Share,
  Platform,
  Linking,
} from "react-native";
import * as Haptics from "expo-haptics";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/lib/i18n";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ShareContent {
  /** Main title (used in native share + as share card title) */
  title: string;
  /** Full share message (text body) */
  message: string;
  /** Deep link / web URL to share */
  url: string;
}

interface ShareSheetProps {
  content: ShareContent;
  /** Render prop receiving the trigger onPress handler */
  children: (onPress: () => void) => React.ReactNode;
}

// ─── Platform helpers ───────────────────────────────────────────────────────

const SOCIAL_PLATFORMS = [
  {
    key: "whatsapp" as const,
    icon: "chat" as const,
    color: "#25D366",
    getUrl: (text: string) =>
      `https://wa.me/?text=${encodeURIComponent(text)}`,
  },
  {
    key: "twitter" as const,
    icon: "alternate-email" as const,
    color: "#000000",
    getUrl: (text: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
  },
  {
    key: "facebook" as const,
    icon: "facebook" as const,
    color: "#1877F2",
    getUrl: (_text: string, url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(_text)}`,
  },
  {
    key: "telegram" as const,
    icon: "send" as const,
    color: "#0088CC",
    getUrl: (text: string, url: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    key: "email" as const,
    icon: "email" as const,
    color: "#EA4335",
    getUrl: (text: string, _url: string, title: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text)}`,
  },
  {
    key: "sms" as const,
    icon: "sms" as const,
    color: "#34B7F1",
    getUrl: (text: string) =>
      Platform.OS === "ios"
        ? `sms:&body=${encodeURIComponent(text)}`
        : `sms:?body=${encodeURIComponent(text)}`,
  },
] as const;

// Key-to-label accessor for translations
const LABEL_MAP = {
  whatsapp: "shareWhatsApp",
  twitter: "shareTwitter",
  facebook: "shareFacebook",
  telegram: "shareTelegram",
  email: "shareEmail",
  sms: "shareSMS",
} as const;

// ─── Component ──────────────────────────────────────────────────────────────

export function ShareSheet({ content, children }: ShareSheetProps) {
  const colors = useColors();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullText = `${content.message}\n\n${content.url}`;

  const open = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // On native, use the OS share sheet directly
    if (Platform.OS !== "web") {
      Share.share(
        Platform.OS === "ios"
          ? { message: content.message, url: content.url, title: content.title }
          : { message: fullText, title: content.title }
      ).catch(() => {});
      return;
    }

    // On web, try the Web Share API first, fall back to custom modal
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: content.title,
          text: content.message,
          url: content.url,
        })
        .catch(() => {
          // User cancelled or API failed — show custom modal
          setVisible(true);
        });
    } else {
      setVisible(true);
    }
  }, [content, fullText]);

  const close = useCallback(() => {
    setVisible(false);
    setCopied(false);
  }, []);

  const handlePlatform = useCallback(
    async (getUrl: (...args: string[]) => string) => {
      const url = getUrl(fullText, content.url, content.title);
      try {
        if (Platform.OS === "web") {
          window.open(url, "_blank", "noopener,noreferrer");
        } else {
          await Linking.openURL(url);
        }
      } catch {}
      close();
    },
    [fullText, content.url, content.title, close]
  );

  const handleCopy = useCallback(async () => {
    try {
      if (Platform.OS === "web" && typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(`${content.message}\n${content.url}`);
      }
      // No expo-clipboard installed — web only
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [content.message, content.url]);

  const handleNativeShare = useCallback(async () => {
    try {
      await Share.share(
        Platform.OS === "ios"
          ? { message: content.message, url: content.url, title: content.title }
          : { message: fullText, title: content.title }
      );
    } catch {}
    close();
  }, [content, fullText, close]);

  return (
    <>
      {children(open)}

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={close}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}
          onPress={close}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: colors.background,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingBottom: 32,
            }}
          >
            {/* Handle bar */}
            <View style={{ alignItems: "center", paddingTop: 12, paddingBottom: 8 }}>
              <View
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: colors.muted + "40",
                }}
              />
            </View>

            {/* Title */}
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: colors.foreground,
                textAlign: "center",
                marginBottom: 20,
                paddingHorizontal: 16,
              }}
            >
              {t.shareVia}
            </Text>

            {/* Social platform grid */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                paddingHorizontal: 16,
                gap: 8,
              }}
            >
              {SOCIAL_PLATFORMS.map((platform) => (
                <Pressable
                  key={platform.key}
                  onPress={() => handlePlatform(platform.getUrl as (...args: string[]) => string)}
                  style={({ pressed }) => [
                    {
                      width: 80,
                      alignItems: "center",
                      paddingVertical: 12,
                      borderRadius: 16,
                      backgroundColor: colors.surface,
                    },
                    pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
                  ]}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: platform.color + "18",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 6,
                    }}
                  >
                    <MaterialIcons
                      name={platform.icon}
                      size={24}
                      color={platform.color}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "600",
                      color: colors.foreground,
                      textAlign: "center",
                    }}
                    numberOfLines={1}
                  >
                    {t[LABEL_MAP[platform.key] as keyof typeof t] as string}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Divider */}
            <View
              style={{
                height: 1,
                backgroundColor: colors.muted + "20",
                marginHorizontal: 24,
                marginVertical: 16,
              }}
            />

            {/* Copy Link */}
            <Pressable
              onPress={handleCopy}
              style={({ pressed }) => [
                {
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 16,
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  borderRadius: 14,
                  backgroundColor: colors.surface,
                  gap: 12,
                },
                pressed && { opacity: 0.7 },
              ]}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.primary + "18",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons
                  name={copied ? "check" : "content-copy"}
                  size={20}
                  color={colors.primary}
                />
              </View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: copied ? colors.success : colors.foreground,
                  flex: 1,
                }}
              >
                {copied ? t.shareLinkCopied : t.shareCopyLink}
              </Text>
            </Pressable>

            {/* More Options (native share fallback) */}
            {Platform.OS !== "web" && (
              <Pressable
                onPress={handleNativeShare}
                style={({ pressed }) => [
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    marginHorizontal: 16,
                    marginTop: 8,
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderRadius: 14,
                    backgroundColor: colors.surface,
                    gap: 12,
                  },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.muted + "18",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons name="share" size={20} color={colors.muted} />
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: colors.foreground,
                    flex: 1,
                  }}
                >
                  {t.shareMoreOptions}
                </Text>
              </Pressable>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
