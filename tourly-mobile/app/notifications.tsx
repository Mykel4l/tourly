import { Text, View, FlatList, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/lib/i18n";
import { useNotifications, AppNotification } from "@/lib/store";
import { TopNavBar } from "@/components/top-nav-bar";

const TYPE_ICONS: Record<AppNotification["type"], "bell.fill" | "tag.fill" | "clock.fill"> = {
  booking: "bell.fill",
  offer: "tag.fill",
  reminder: "clock.fill",
};

const TYPE_COLORS: Record<AppNotification["type"], string> = {
  booking: "#4A90D9",
  offer: "#22C55E",
  reminder: "#F59E0B",
};

function timeAgo(iso: string, t: any): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t.timeJustNow;
  if (mins < 60) return `${mins}${t.timeMinutesAgo}`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}${t.timeHoursAgo}`;
  return `${Math.floor(hours / 24)}${t.timeDaysAgo}`;
}

export default function NotificationsScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const { notifications, markRead, markAllRead, unreadCount } = useNotifications();

  const handlePress = (notif: AppNotification) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    markRead(notif.id);
  };

  const renderItem = ({ item }: { item: AppNotification }) => {
    const iconColor = TYPE_COLORS[item.type];
    const tAny = t as unknown as Record<string, string>;
    const title = item.titleKey ? tAny[item.titleKey] ?? item.title : item.title;
    const body = item.bodyKey ? tAny[item.bodyKey] ?? item.body : item.body;
    return (
      <Pressable
        onPress={() => handlePress(item)}
        style={({ pressed }) => [
          {
            flexDirection: "row",
            backgroundColor: item.read ? colors.surface : colors.primary + "10",
            borderRadius: 16,
            padding: 14,
            marginBottom: 10,
            borderLeftWidth: item.read ? 0 : 3,
            borderLeftColor: colors.primary,
          },
          pressed && { opacity: 0.85 },
        ]}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: iconColor + "20",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
            flexShrink: 0,
          }}
        >
          <IconSymbol name={TYPE_ICONS[item.type]} size={20} color={iconColor} />
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                flex: 1,
                color: colors.foreground,
                fontSize: 14,
                fontWeight: item.read ? "500" : "700",
              }}
              numberOfLines={1}
            >
              {title}
            </Text>
            {!item.read && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.primary,
                  marginLeft: 8,
                }}
              />
            )}
          </View>
          <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 18 }} numberOfLines={2}>
            {body}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 11, marginTop: 6 }}>
            {timeAgo(item.createdAt, t)}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <ScreenContainer className="px-4" edges={["left", "right"]}>
      <TopNavBar
        title={t.notificationsTitle}
        showBack
        rightContent={
          unreadCount > 0 ? (
            <Pressable
              onPress={() => {
                if (Platform.OS !== "web") Haptics.selectionAsync();
                markAllRead();
              }}
              hitSlop={8}
              style={({ pressed }) => [pressed && { opacity: 0.7 }]}
            >
              <Text style={{ color: colors.primary, fontSize: 13, fontWeight: "600" }}>
                {t.markAllRead}
              </Text>
            </Pressable>
          ) : undefined
        }
      />

      {unreadCount > 0 && (
        <View
          style={{
            backgroundColor: colors.primary + "14",
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 10,
            marginBottom: 14,
          }}
        >
          <Text style={{ color: colors.primary, fontSize: 13, fontWeight: "600" }}>
            {unreadCount} {t.unreadNotifications}
          </Text>
        </View>
      )}

      {notifications.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 80,
          }}
        >
          <IconSymbol name="bell.slash" size={48} color={colors.muted} />
          <Text
            style={{
              color: colors.muted,
              fontSize: 15,
              marginTop: 16,
              textAlign: "center",
            }}
          >
            {t.noNotifications}
          </Text>
        </View>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 12 }}
        />
      )}
    </ScreenContainer>
  );
}
