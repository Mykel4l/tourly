import { Text, View, ScrollView, Pressable, Alert, Platform } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/lib/i18n";
import { useCurrency } from "@/lib/currency";
import { useBookings, useWishlist, Booking, BookingStatus } from "@/lib/store";
import { TopNavBar } from "@/components/top-nav-bar";
import { useAuth } from "@/hooks/use-auth";

const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: "#F59E0B",
  confirmed: "#22C55E",
  cancelled: "#EF4444",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProfileScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const { format } = useCurrency();
  const { bookings, cancelBooking } = useBookings();
  const { items: wishlistItems } = useWishlist();
  const { user, logout } = useAuth({ autoFetch: false });

  const handleLogout = () => {
    Alert.alert(
      t.signOut,
      t.signOutConfirm,
      [
        { text: t.cancel, style: "cancel" },
        {
          text: t.signOut,
          style: "destructive",
          onPress: async () => {
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
            await logout();
          },
        },
      ]
    );
  };

  const handleCancelBooking = (booking: Booking) => {
    if (booking.status !== "pending") return;
    Alert.alert(
      t.cancelBookingTitle,
      `${t.cancelBookingMessage}`,
      [
        { text: t.keepIt, style: "cancel" },
        {
          text: t.cancelBookingAction,
          style: "destructive",
          onPress: () => {
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
            cancelBooking(booking.id);
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: "bell.fill" as const,
      label: t.notificationsTitle,
      onPress: () => router.push("/notifications"),
    },
    {
      icon: "gearshape.fill" as const,
      label: t.settings,
      onPress: () => router.push("/settings"),
    },
    {
      icon: "info.circle.fill" as const,
      label: t.aboutUs,
      onPress: () => router.push("/about"),
    },
    {
      icon: "phone.fill" as const,
      label: t.contactUs,
      onPress: () => router.push("/contact"),
    },
  ];

  return (
    <ScreenContainer className="px-4" edges={["left", "right"]}>
      <TopNavBar title={t.profileTitle} showBack />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8 }}>

        {/* Avatar + Stats */}
        <View
          style={{
            backgroundColor: colors.primary,
            borderRadius: 24,
            padding: 24,
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "rgba(255,255,255,0.25)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <IconSymbol name="person.fill" size={40} color="white" />
          </View>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>{user?.name || t.defaultUsername}</Text>
          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 4 }}>
            {user?.email || t.welcomeBack}
          </Text>

          {/* Stats row */}
          <View
            style={{
              flexDirection: "row",
              marginTop: 20,
              width: "100%",
              borderTopWidth: 1,
              borderTopColor: "rgba(255,255,255,0.2)",
              paddingTop: 16,
            }}
          >
            {[
              { label: t.myBookings, value: bookings.length.toString() },
              { label: t.saved, value: wishlistItems.length.toString() },
              { label: t.countriesLabel, value: "0" },
            ].map((stat, i) => (
              <View key={i} style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>
                  {stat.value}
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 }}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 24,
          }}
        >
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              onPress={item.onPress}
              style={({ pressed }) => [
                {
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 18,
                  paddingVertical: 16,
                  borderBottomWidth: index < menuItems.length - 1 ? 0.5 : 0,
                  borderBottomColor: colors.border,
                },
                pressed && { backgroundColor: colors.border + "40" },
              ]}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: colors.primary + "18",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 14,
                }}
              >
                <IconSymbol name={item.icon} size={18} color={colors.primary} />
              </View>
              <Text
                style={{ flex: 1, color: colors.foreground, fontSize: 15, fontWeight: "500" }}
              >
                {item.label}
              </Text>
              <IconSymbol name="chevron.right" size={16} color={colors.muted} />
            </Pressable>
          ))}
        </View>

        {/* Bookings */}
        <Text
          style={{
            color: colors.foreground,
            fontSize: 18,
            fontWeight: "700",
            marginBottom: 14,
          }}
        >
          {t.myBookings} ({bookings.length})
        </Text>

        {bookings.length === 0 ? (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 20,
              padding: 32,
              alignItems: "center",
              marginBottom: 32,
            }}
          >
            <IconSymbol name="calendar" size={36} color={colors.muted} />
            <Text
              style={{
                color: colors.muted,
                fontSize: 14,
                textAlign: "center",
                marginTop: 12,
              }}
            >
              {t.noBookingsHint}
            </Text>
            <Pressable
              onPress={() => router.push("/(tabs)/packages")}
              style={({ pressed }) => [
                {
                  marginTop: 16,
                  backgroundColor: colors.primary,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 50,
                },
                pressed && { opacity: 0.9 },
              ]}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>{t.browsePackages}</Text>
            </Pressable>
          </View>
        ) : (
          bookings.map((booking) => (
            <View
              key={booking.id}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 20,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    color: colors.foreground,
                    fontSize: 15,
                    fontWeight: "700",
                    marginRight: 8,
                  }}
                  numberOfLines={2}
                >
                  {booking.packageName || t.customTrip}
                </Text>
                <View
                  style={{
                    backgroundColor: STATUS_COLORS[booking.status] + "20",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 20,
                  }}
                >
                  <Text
                    style={{
                      color: STATUS_COLORS[booking.status],
                      fontSize: 11,
                      fontWeight: "700",
                      textTransform: "capitalize",
                    }}
                  >
                    {booking.status}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                {[
                  { icon: "person.fill" as const, text: `${booking.travelers} ${t.travellersCount}` },
                  ...(booking.checkIn ? [{ icon: "calendar" as const, text: booking.checkIn }] : []),
                  ...(booking.price ? [{ icon: "creditcard.fill" as const, text: `${format(Number(booking.price))}${t.perPersonShort}` }] : []),
                ].map((meta, i) => (
                  <View
                    key={i}
                    style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                  >
                    <IconSymbol name={meta.icon} size={12} color={colors.muted} />
                    <Text style={{ color: colors.muted, fontSize: 12 }}>{meta.text}</Text>
                  </View>
                ))}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTopWidth: 0.5,
                  borderTopColor: colors.border,
                  paddingTop: 10,
                }}
              >
                <Text style={{ color: colors.muted, fontSize: 11 }}>
                  {t.bookedOn} {formatDate(booking.createdAt)}
                </Text>
                {booking.status === "pending" && (
                  <Pressable
                    onPress={() => handleCancelBooking(booking)}
                    style={({ pressed }) => [
                      {
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: colors.error,
                      },
                      pressed && { opacity: 0.7 },
                    ]}
                  >
                    <Text style={{ color: colors.error, fontSize: 12, fontWeight: "600" }}>
                      {t.cancel}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))
        )}

        {/* Sign Out */}
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              backgroundColor: colors.surface,
              paddingVertical: 16,
              borderRadius: 16,
              marginBottom: 32,
              borderWidth: 1,
              borderColor: colors.error + "30",
            },
            pressed && { opacity: 0.7 },
          ]}
        >
          <IconSymbol name="rectangle.portrait.and.arrow.right" size={18} color={colors.error} />
          <Text style={{ color: colors.error, fontSize: 15, fontWeight: "600" }}>
            {t.signOut}
          </Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}
