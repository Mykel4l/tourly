import {
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  TextInput,
  Alert,
  FlatList,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import { useState, useRef, useEffect, useCallback } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";

import { ScreenContainer } from "@/components/screen-container";
import { TopNavBar } from "@/components/top-nav-bar";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/lib/i18n";
import { destinations, type Destination } from "@/data/destinations";
import { packages, type TravelPackage } from "@/data/packages";
import { useBookings, type Booking, type BookingStatus, useChat, useNotifications } from "@/lib/store";

// ─── Types ──────────────────────────────────────────────────────────────────

type AdminTab = "dashboard" | "bookings" | "destinations" | "packages" | "users" | "chat";

// ─── Mock user data ─────────────────────────────────────────────────────────

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "suspended";
  joinedAt: string;
  bookings: number;
  avatar?: string | null;
}

const MOCK_USERS: MockUser[] = [
  {
    id: "u1",
    name: "Sarah Mitchell",
    email: "sarah@example.com",
    role: "user",
    status: "active",
    joinedAt: "2025-06-15",
    bookings: 4,
  },
  {
    id: "u2",
    name: "Kenji Tanaka",
    email: "kenji@example.com",
    role: "user",
    status: "active",
    joinedAt: "2025-08-22",
    bookings: 2,
  },
  {
    id: "u3",
    name: "Amara Osei",
    email: "amara@example.com",
    role: "admin",
    status: "active",
    joinedAt: "2024-11-05",
    bookings: 7,
  },
  {
    id: "u4",
    name: "Carlos Rivera",
    email: "carlos@example.com",
    role: "user",
    status: "suspended",
    joinedAt: "2025-12-01",
    bookings: 0,
  },
  {
    id: "u5",
    name: "Emma Larsson",
    email: "emma@example.com",
    role: "user",
    status: "active",
    joinedAt: "2026-01-18",
    bookings: 3,
  },
];

// ─── Helper components ──────────────────────────────────────────────────────

function haptic() {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

/** Metric card with icon, value, label, and optional trend */
function MetricCard({
  icon,
  value,
  label,
  trend,
  trendUp,
  gradient,
  colors,
  index,
}: {
  icon: string;
  value: string;
  label: string;
  trend?: string;
  trendUp?: boolean;
  gradient: [string, string];
  colors: any;
  index: number;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(200 + index * 100).duration(600).springify()}
      style={{
        flex: 1,
        minWidth: 140,
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <LinearGradient
        colors={gradient}
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <IconSymbol name={icon as any} size={18} color="#fff" />
      </LinearGradient>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "800",
          color: colors.foreground,
          marginBottom: 4,
        }}
      >
        {value}
      </Text>
      <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 6 }}>
        {label}
      </Text>
      {trend && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <IconSymbol
            name={trendUp ? "arrow.up.right" : "arrow.down.right"}
            size={10}
            color={trendUp ? colors.success : colors.error}
          />
          <Text
            style={{
              fontSize: 11,
              fontWeight: "600",
              color: trendUp ? colors.success : colors.error,
            }}
          >
            {trend}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

/** Status badge */
function StatusBadge({
  status,
  colors,
}: {
  status: string;
  colors: any;
}) {
  const config: Record<string, { bg: string; text: string }> = {
    pending: { bg: colors.warning + "20", text: colors.warning },
    confirmed: { bg: colors.success + "20", text: colors.success },
    cancelled: { bg: colors.error + "20", text: colors.error },
    active: { bg: colors.success + "20", text: colors.success },
    suspended: { bg: colors.error + "20", text: colors.error },
    admin: { bg: colors.primary + "20", text: colors.primary },
    user: { bg: colors.muted + "20", text: colors.muted },
  };
  const c = config[status] ?? { bg: colors.muted + "20", text: colors.muted };

  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 50,
        backgroundColor: c.bg,
      }}
    >
      <Text style={{ fontSize: 11, fontWeight: "600", color: c.text, textTransform: "capitalize" }}>
        {status}
      </Text>
    </View>
  );
}

/** Tab button */

/** Reusable admin edit modal */
function AdminModal({
  visible,
  title,
  onClose,
  onSave,
  colors,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSave: () => void;
  colors: any;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Pressable
          onPress={onClose}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            paddingHorizontal: 20,
          }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 20,
              padding: 24,
              maxHeight: "80%",
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "800", color: colors.foreground }}>
                {title}
              </Text>
              <Pressable onPress={onClose} style={{ padding: 4 }}>
                <IconSymbol name="xmark.circle.fill" size={24} color={colors.muted} />
              </Pressable>
            </View>

            {/* Form content */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {children}
            </ScrollView>

            {/* Actions */}
            <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 14,
                    alignItems: "center",
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border,
                  },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.muted }}>
                  {t.adminCancel}
                </Text>
              </Pressable>
              <Pressable
                onPress={onSave}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 14,
                    alignItems: "center",
                    backgroundColor: colors.primary,
                  },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}>
                  {t.adminSave}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/** Reusable form field */
function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType,
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: "default" | "numeric" | "email-address";
  colors: any;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted, marginBottom: 6 }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted + "80"}
        keyboardType={keyboardType}
        multiline={multiline}
        style={{
          backgroundColor: colors.background,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: multiline ? 12 : 10,
          color: colors.foreground,
          fontSize: 14,
          borderWidth: 1,
          borderColor: colors.border,
          minHeight: multiline ? 80 : undefined,
          textAlignVertical: multiline ? "top" : "center",
        }}
      />
    </View>
  );
}


/** Reusable image picker field for admin forms */
function ImagePickerField({
  label,
  imageUri,
  onImageSelected,
  colors,
  shape = "rectangle",
  fallbackSource,
}: {
  label: string;
  imageUri: string | null;
  onImageSelected: (uri: string | null) => void;
  colors: any;
  shape?: "rectangle" | "circle";
  /** Bundled require() image to show when no custom URI is set */
  fallbackSource?: any;
}) {
  const { t } = useTranslation();
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t.adminPermissionNeeded, t.adminGrantCameraAccess);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: shape === "circle" ? [1, 1] : [16, 9],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      onImageSelected(result.assets[0].uri);
    }
  };

  const isCircle = shape === "circle";
  const size = isCircle ? 90 : undefined;
  const hasImage = !!imageUri;
  const hasFallback = !imageUri && !!fallbackSource;
  const showImage = hasImage || hasFallback;

  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted, marginBottom: 6 }}>
        {label}
      </Text>
      <Pressable
        onPress={pickImage}
        style={{
          width: isCircle ? size : "100%",
          height: isCircle ? size : 140,
          borderRadius: isCircle ? (size! / 2) : 12,
          borderWidth: 1,
          borderColor: colors.border,
          borderStyle: showImage ? "solid" : "dashed",
          backgroundColor: colors.background,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: isCircle ? "center" : undefined,
        }}
      >
        {hasImage ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        ) : hasFallback ? (
          <Image
            source={fallbackSource}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        ) : (
          <View style={{ alignItems: "center", gap: 6 }}>
            <IconSymbol name="photo.badge.plus" size={isCircle ? 24 : 28} color={colors.primary} />
            <Text style={{ fontSize: 11, color: colors.muted }}>
              {t.adminTapUpload}
            </Text>
          </View>
        )}
      </Pressable>
      {showImage && (
        <View style={{ flexDirection: "row", justifyContent: isCircle ? "center" : "flex-end", gap: 12, marginTop: 8 }}>
          <Pressable
            onPress={pickImage}
            style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
          >
            <IconSymbol name="arrow.triangle.2.circlepath" size={13} color={colors.primary} />
            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.primary }}>{t.adminChange}</Text>
          </Pressable>
          <Pressable
            onPress={() => onImageSelected(null)}
            style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
          >
            <IconSymbol name="trash.fill" size={13} color={colors.error} />
            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.error }}>{t.adminRemove}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}


// ─── Reports Modal ──────────────────────────────────────────────────────────

function ReportsModal({
  visible,
  onClose,
  colors,
  bookings,
}: {
  visible: boolean;
  onClose: () => void;
  colors: any;
  bookings: Booking[];
}) {
  const { t } = useTranslation();
  const total = bookings.length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;
  const activeBookings = bookings.filter((b) => b.status !== "cancelled");
  const revenue = activeBookings.reduce((s, b) => s + (parseFloat(b.price ?? "0") || 0), 0);
  const avgRevenue = activeBookings.length > 0 ? revenue / activeBookings.length : 0;

  // Revenue by package
  const revenueByPackage: Record<string, { count: number; revenue: number }> = {};
  activeBookings.forEach((b) => {
    const name = b.packageName || t.adminCustomTrip;
    if (!revenueByPackage[name]) revenueByPackage[name] = { count: 0, revenue: 0 };
    revenueByPackage[name].count += 1;
    revenueByPackage[name].revenue += parseFloat(b.price ?? "0") || 0;
  });
  const sortedPackages = Object.entries(revenueByPackage).sort((a, b) => b[1].revenue - a[1].revenue);
  const maxPkgRevenue = sortedPackages.length > 0 ? sortedPackages[0][1].revenue : 1;

  // Monthly trend (last 6 months)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const monthlyData: { label: string; count: number; revenue: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = monthNames[d.getMonth()];
    const matching = bookings.filter((b) => {
      const bd = new Date(b.createdAt);
      return bd.getMonth() === d.getMonth() && bd.getFullYear() === d.getFullYear();
    });
    monthlyData.push({
      label,
      count: matching.length,
      revenue: matching.filter((b) => b.status !== "cancelled").reduce((s, b) => s + (parseFloat(b.price ?? "0") || 0), 0),
    });
  }
  const maxMonthCount = Math.max(...monthlyData.map((m) => m.count), 1);

  const statusData: { label: string; count: number; color: string; pct: string }[] = total > 0
    ? [
        { label: t.adminConfirmed, count: confirmed, color: "#22C55E", pct: ((confirmed / total) * 100).toFixed(0) },
        { label: t.adminPending, count: pending, color: "#F59E0B", pct: ((pending / total) * 100).toFixed(0) },
        { label: t.adminCancelled, count: cancelled, color: "#EF4444", pct: ((cancelled / total) * 100).toFixed(0) },
      ]
    : [
        { label: t.adminConfirmed, count: 0, color: "#22C55E", pct: "0" },
        { label: t.adminPending, count: 0, color: "#F59E0B", pct: "0" },
        { label: t.adminCancelled, count: 0, color: "#EF4444", pct: "0" },
      ];

  const ReportCard = ({ children, title }: { children: React.ReactNode; title: string }) => (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground, marginBottom: 14 }}>
        {title}
      </Text>
      {children}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: Platform.OS === "ios" ? 58 : 20,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            backgroundColor: colors.surface,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: "#22C55E" + "18",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconSymbol name="chart.bar.fill" size={18} color="#22C55E" />
            </View>
            <Text style={{ fontSize: 18, fontWeight: "800", color: colors.foreground }}>
              {t.adminReports}
            </Text>
          </View>
          <Pressable
            onPress={() => { haptic(); onClose(); }}
            style={({ pressed }) => [
              {
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.border,
              },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }}>{t.adminDone}</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* KPI Row */}
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 14 }}>
            {[
              { label: t.adminRevenue, value: `$${revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: "dollarsign.circle.fill" as const, color: "#0EA5E9" },
              { label: t.adminTabBookings, value: String(total), icon: "suitcase.fill" as const, color: "#6366F1" },
              { label: t.adminAvgBooking, value: `$${avgRevenue.toFixed(0)}`, icon: "chart.bar.fill" as const, color: "#22C55E" },
            ].map((kpi) => (
              <View
                key={kpi.label}
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 14,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: kpi.color + "15",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <IconSymbol name={kpi.icon} size={16} color={kpi.color} />
                </View>
                <Text style={{ fontSize: 18, fontWeight: "800", color: colors.foreground }}>
                  {kpi.value}
                </Text>
                <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>
                  {kpi.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Status Breakdown */}
          <ReportCard title={t.adminBookingStatus}>
            {/* Stacked bar */}
            {total > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  height: 10,
                  borderRadius: 5,
                  overflow: "hidden",
                  marginBottom: 14,
                  backgroundColor: colors.border,
                }}
              >
                {statusData.map((s) => (
                  s.count > 0 && (
                    <View
                      key={s.label}
                      style={{
                        flex: s.count,
                        backgroundColor: s.color,
                      }}
                    />
                  )
                ))}
              </View>
            )}
            {statusData.map((s) => (
              <View
                key={s.label}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border + "40",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: s.color,
                    }}
                  />
                  <Text style={{ fontSize: 13, color: colors.foreground, fontWeight: "500" }}>
                    {s.label}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>
                    {s.count}
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 8,
                      backgroundColor: s.color + "15",
                    }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: "600", color: s.color }}>
                      {s.pct}%
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ReportCard>

          {/* Monthly Trend */}
          <ReportCard title={t.adminMonthlyBookings}>
            <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8, height: 120 }}>
              {monthlyData.map((m) => (
                <View key={m.label} style={{ flex: 1, alignItems: "center" }}>
                  <Text style={{ fontSize: 10, fontWeight: "700", color: colors.foreground, marginBottom: 4 }}>
                    {m.count}
                  </Text>
                  <View
                    style={{
                      width: "100%",
                      height: Math.max((m.count / maxMonthCount) * 80, 4),
                      borderRadius: 6,
                      backgroundColor: m.count > 0 ? "#6366F1" : colors.border,
                    }}
                  />
                  <Text style={{ fontSize: 10, color: colors.muted, marginTop: 6, fontWeight: "500" }}>
                    {m.label}
                  </Text>
                </View>
              ))}
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 14,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: colors.border,
              }}
            >
              <Text style={{ fontSize: 11, color: colors.muted }}>
                {t.adminTotalPeriod}: {monthlyData.reduce((s, m) => s + m.count, 0)} {t.adminTabBookings.toLowerCase()}
              </Text>
              <Text style={{ fontSize: 11, color: colors.muted }}>
                ${monthlyData.reduce((s, m) => s + m.revenue, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} {t.adminRevenueLabel}
              </Text>
            </View>
          </ReportCard>

          {/* Revenue by Package */}
          <ReportCard title={t.adminRevenueByPackage}>
            {sortedPackages.length === 0 ? (
              <Text style={{ fontSize: 13, color: colors.muted, textAlign: "center", paddingVertical: 16 }}>
                {t.adminNoRevenueYet}
              </Text>
            ) : (
              sortedPackages.map(([name, data], i) => (
                <View key={name} style={{ marginBottom: i < sortedPackages.length - 1 ? 14 : 0 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <Text
                      style={{ fontSize: 13, fontWeight: "600", color: colors.foreground, flex: 1 }}
                      numberOfLines={1}
                    >
                      {name}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Text style={{ fontSize: 11, color: colors.muted }}>
                        {data.count} {t.adminBookingsCount}
                      </Text>
                      <Text style={{ fontSize: 13, fontWeight: "700", color: colors.foreground }}>
                        ${data.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: colors.border,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        height: "100%",
                        width: `${(data.revenue / maxPkgRevenue) * 100}%`,
                        borderRadius: 4,
                        backgroundColor: ["#0EA5E9", "#6366F1", "#22C55E", "#F59E0B", "#EF4444"][i % 5],
                      }}
                    />
                  </View>
                </View>
              ))
            )}
          </ReportCard>

          {/* Recent Bookings Quick List */}
          <ReportCard title={t.adminLatestBookings}>
            {bookings.length === 0 ? (
              <Text style={{ fontSize: 13, color: colors.muted, textAlign: "center", paddingVertical: 16 }}>
                {t.adminNoBookingsYet}
              </Text>
            ) : (
              bookings.slice(0, 8).map((b, i) => (
                <View
                  key={b.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 10,
                    borderBottomWidth: i < Math.min(bookings.length, 8) - 1 ? 1 : 0,
                    borderBottomColor: colors.border + "40",
                  }}
                >
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }} numberOfLines={1}>
                      {b.packageName || t.adminCustomTrip}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>
                      {b.fullName} • {new Date(b.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={{ fontSize: 13, fontWeight: "700", color: colors.foreground }}>
                      ${parseFloat(b.price ?? "0").toFixed(0)}
                    </Text>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor:
                          b.status === "confirmed" ? "#22C55E" : b.status === "pending" ? "#F59E0B" : "#EF4444",
                      }}
                    />
                  </View>
                </View>
              ))
            )}
          </ReportCard>
        </ScrollView>
      </View>
    </Modal>
  );
}


// ─── Dashboard Tab ──────────────────────────────────────────────────────────

function DashboardTab({ colors, onSwitchTab }: { colors: any; onSwitchTab: (tab: AdminTab) => void }) {
  const { t } = useTranslation();
  const { bookings } = useBookings();
  const { addNotification } = useNotifications();
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [notifForm, setNotifForm] = useState({ title: "", body: "", type: "offer" as "booking" | "offer" | "reminder" });
  const [notifRecipient, setNotifRecipient] = useState<"all" | "select">("all");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSendNotification = () => {
    if (!notifForm.title.trim() || !notifForm.body.trim()) {
      Alert.alert(t.adminValidation, t.adminTitleMessageRequired);
      return;
    }
    if (notifRecipient === "select" && selectedUserIds.length === 0) {
      Alert.alert(t.adminValidation, t.adminSelectAtLeastOne);
      return;
    }
    haptic();
    addNotification({
      title: notifForm.title.trim(),
      body: notifForm.body.trim(),
      type: notifForm.type,
    });
    const recipientLabel =
      notifRecipient === "all"
        ? t.adminAllUsers.toLowerCase()
        : selectedUserIds.length === 1
          ? MOCK_USERS.find((u) => u.id === selectedUserIds[0])?.name ?? `1 ${t.adminTabUsers.toLowerCase()}`
          : `${selectedUserIds.length} ${t.adminTabUsers.toLowerCase()}`;
    setNotifForm({ title: "", body: "", type: "offer" });
    setNotifRecipient("all");
    setSelectedUserIds([]);
    setNotifModalVisible(false);
    Alert.alert(t.adminSent, `${t.adminNotifSentTo} ${recipientLabel}.`);
  };

  const totalRevenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + (parseFloat(b.price ?? "0") || 0), 0);

  // Recent activity (latest 5 bookings)
  const recentBookings = bookings.slice(0, 5);

  return (
    <View>
      {/* Reports Modal */}
      <ReportsModal visible={reportModalVisible} onClose={() => setReportModalVisible(false)} colors={colors} bookings={bookings} />

      {/* Send Notification Modal */}
      <AdminModal
        visible={notifModalVisible}
        title={t.adminSendNotification}
        onClose={() => setNotifModalVisible(false)}
        onSave={handleSendNotification}
        colors={colors}
      >
        {/* Recipient */}
        <View style={{ marginBottom: 14 }}>
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted, marginBottom: 6 }}>
            {t.adminSendTo}
          </Text>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: notifRecipient === "select" ? 10 : 0 }}>
            {(["all", "select"] as const).map((opt) => (
              <Pressable
                key={opt}
                onPress={() => {
                  setNotifRecipient(opt);
                  if (opt === "all") setSelectedUserIds([]);
                }}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 10,
                  alignItems: "center",
                  backgroundColor: notifRecipient === opt ? colors.primary : colors.background,
                  borderWidth: 1,
                  borderColor: notifRecipient === opt ? colors.primary : colors.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: notifRecipient === opt ? "#fff" : colors.muted,
                  }}
                >
                  {opt === "all" ? t.adminAllUsers : t.adminSelectUsers}
                </Text>
              </Pressable>
            ))}
          </View>
          {notifRecipient === "select" && (
            <View
              style={{
                backgroundColor: colors.background,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                maxHeight: 180,
                overflow: "hidden",
              }}
            >
              <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                {MOCK_USERS.map((user) => {
                  const isSelected = selectedUserIds.includes(user.id);
                  return (
                    <Pressable
                      key={user.id}
                      onPress={() => toggleUserSelection(user.id)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                        backgroundColor: isSelected ? colors.primary + "14" : "transparent",
                      }}
                    >
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 6,
                          borderWidth: 2,
                          borderColor: isSelected ? colors.primary : colors.muted,
                          backgroundColor: isSelected ? colors.primary : "transparent",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 10,
                        }}
                      >
                        {isSelected && <IconSymbol name="checkmark" size={12} color="#fff" />}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }}>
                          {user.name}
                        </Text>
                        <Text style={{ fontSize: 11, color: colors.muted }}>{user.email}</Text>
                      </View>
                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 6,
                          backgroundColor:
                            user.status === "active" ? "#22C55E20" : "#EF444420",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: "600",
                            color: user.status === "active" ? "#22C55E" : "#EF4444",
                            textTransform: "capitalize",
                          }}
                        >
                          {user.status}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
              {selectedUserIds.length > 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    backgroundColor: colors.surface,
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: "600", color: colors.primary }}>
                    {selectedUserIds.length} user{selectedUserIds.length > 1 ? "s" : ""} {t.adminUsersSelected}
                  </Text>
                  <Pressable onPress={() => setSelectedUserIds([])}>
                    <Text style={{ fontSize: 11, fontWeight: "600", color: colors.muted }}>{t.adminClear}</Text>
                  </Pressable>
                </View>
              )}
            </View>
          )}
        </View>

        <FormField label={t.adminNotifTitle} value={notifForm.title} onChangeText={(v) => setNotifForm((f) => ({ ...f, title: v }))} placeholder={t.adminNotifTitlePlaceholder} colors={colors} />
        <FormField label={t.adminNotifMessage} value={notifForm.body} onChangeText={(v) => setNotifForm((f) => ({ ...f, body: v }))} placeholder={t.adminNotifMessagePlaceholder} multiline colors={colors} />
        <View style={{ marginBottom: 14 }}>
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted, marginBottom: 6 }}>
            {t.adminNotifType}
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {(["offer", "booking", "reminder"] as const).map((typ) => (
              <Pressable
                key={typ}
                onPress={() => setNotifForm((f) => ({ ...f, type: typ }))}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 10,
                  alignItems: "center",
                  backgroundColor: notifForm.type === typ ? colors.primary : colors.background,
                  borderWidth: 1,
                  borderColor: notifForm.type === typ ? colors.primary : colors.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: notifForm.type === typ ? "#fff" : colors.muted,
                    textTransform: "capitalize",
                  }}
                >
                  {typ}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </AdminModal>

      {/* Metrics Grid */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <MetricCard
          icon="suitcase.fill"
          value={String(bookings.length)}
          label={t.adminTotalBookings}
          trend={t.adminTotalBookingsTrend}
          trendUp
          gradient={["#6366F1", "#8B5CF6"]}
          colors={colors}
          index={0}
        />
        <MetricCard
          icon="dollarsign.circle.fill"
          value={`$${totalRevenue.toFixed(0)}`}
          label={t.adminRevenue}
          trend={t.adminRevenueTrend}
          trendUp
          gradient={["#0EA5E9", "#06B6D4"]}
          colors={colors}
          index={1}
        />
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 32 }}>
        <MetricCard
          icon="person.2.fill"
          value={String(MOCK_USERS.length)}
          label={t.adminTotalUsers}
          trend={t.adminTotalUsersTrend}
          trendUp
          gradient={["#22C55E", "#10B981"]}
          colors={colors}
          index={2}
        />
        <MetricCard
          icon="map.fill"
          value={String(destinations.length)}
          label={t.adminDestinations}
          gradient={["#F59E0B", "#EF4444"]}
          colors={colors}
          index={3}
        />
      </View>

      {/* Quick Actions */}
      <Animated.View entering={FadeInDown.delay(500).duration(600)}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: colors.foreground,
            marginBottom: 12,
          }}
        >
          {t.adminQuickActions}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
          {[
            { label: t.adminAddDestination, icon: "plus.circle.fill", color: "#6366F1", tab: "destinations" as AdminTab },
            { label: t.adminCreatePackage, icon: "plus.rectangle.fill", color: "#0EA5E9", tab: "packages" as AdminTab },
            { label: t.adminSendNotification, icon: "bell.badge.fill", color: "#F59E0B", tab: null },
            { label: t.adminViewReports, icon: "chart.bar.fill", color: "#22C55E", tab: null },
          ].map((action) => (
            <Pressable
              key={action.label}
              onPress={() => {
                haptic();
                if (action.label === t.adminSendNotification) {
                  setNotifModalVisible(true);
                } else if (action.label === t.adminViewReports) {
                  setReportModalVisible(true);
                } else if (action.tab) {
                  onSwitchTab(action.tab);
                }
              }}
              style={({ pressed }) => [
                {
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: 12,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                },
                pressed && { opacity: 0.7 },
              ]}
            >
              <IconSymbol name={action.icon as any} size={16} color={action.color} />
              <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }}>
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      {/* Recent Bookings */}
      <Animated.View entering={FadeInDown.delay(600).duration(600)}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: colors.foreground,
            marginBottom: 12,
          }}
        >
          {t.adminRecentBookings}
        </Text>
        {recentBookings.length === 0 ? (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 32,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <IconSymbol name="tray.fill" size={32} color={colors.muted} />
            <Text style={{ fontSize: 14, color: colors.muted, marginTop: 12 }}>
              {t.adminNoBookingsYet}
            </Text>
          </View>
        ) : (
          recentBookings.map((booking) => (
            <View
              key={booking.id}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 16,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>
                    {booking.packageName || t.adminCustomTrip}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                    {booking.fullName} • {booking.email}
                  </Text>
                </View>
                <StatusBadge status={booking.status} colors={colors} />
              </View>
            </View>
          ))
        )}
      </Animated.View>
    </View>
  );
}

// ─── Bookings Tab ───────────────────────────────────────────────────────────

function BookingsTab({ colors }: { colors: any }) {
  const { t } = useTranslation();
  const { bookings, cancelBooking, confirmBooking, updateBooking } = useBookings();
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBooking, setEditingBooking] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    travelers: "1",
    checkIn: "",
    checkOut: "",
  });

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const openEdit = (booking: (typeof bookings)[0]) => {
    setEditingBooking(booking.id);
    setForm({
      fullName: booking.fullName || "",
      email: booking.email || "",
      phone: booking.phone || "",
      travelers: String(booking.travelers || 1),
      checkIn: booking.checkIn || "",
      checkOut: booking.checkOut || "",
    });
    setModalVisible(true);
    haptic();
  };

  const handleSave = () => {
    if (!editingBooking) return;
    haptic();
    updateBooking(editingBooking, {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      travelers: form.travelers,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
    });
    Alert.alert(t.adminUpdated, t.adminBookingUpdated);
    setModalVisible(false);
  };

  return (
    <View>
      {/* Edit Modal */}
      <AdminModal
        visible={modalVisible}
        title={t.adminBookingDetails}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        colors={colors}
      >
        <FormField label={t.adminFullName} value={form.fullName} onChangeText={(v) => setForm((f) => ({ ...f, fullName: v }))} colors={colors} />
        <FormField label={t.adminEmail} value={form.email} onChangeText={(v) => setForm((f) => ({ ...f, email: v }))} keyboardType="email-address" colors={colors} />
        <FormField label={t.adminPhone} value={form.phone} onChangeText={(v) => setForm((f) => ({ ...f, phone: v }))} colors={colors} />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <FormField label={t.adminTravelers} value={form.travelers} onChangeText={(v) => setForm((f) => ({ ...f, travelers: v }))} keyboardType="numeric" colors={colors} />
          </View>
          <View style={{ flex: 1 }}>
            <FormField label={t.adminCheckIn} value={form.checkIn} onChangeText={(v) => setForm((f) => ({ ...f, checkIn: v }))} placeholder={t.adminDatePlaceholder} colors={colors} />
          </View>
        </View>
        <FormField label={t.adminCheckOut} value={form.checkOut} onChangeText={(v) => setForm((f) => ({ ...f, checkOut: v }))} placeholder={t.adminDatePlaceholder} colors={colors} />
      </AdminModal>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, marginBottom: 20 }}
      >
        {(["all", "pending", "confirmed", "cancelled"] as const).map((f) => (
          <Pressable
            key={f}
            onPress={() => {
              haptic();
              setFilter(f);
            }}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 50,
              backgroundColor: filter === f ? colors.primary : colors.surface,
              borderWidth: 1,
              borderColor: filter === f ? colors.primary : colors.border,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: filter === f ? "#fff" : colors.muted,
                textTransform: "capitalize",
              }}
            >
              {f === "all" ? `${t.adminAll} (${bookings.length})` : f === "pending" ? t.adminPending : f === "confirmed" ? t.adminConfirmed : t.adminCancelled}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {filtered.length === 0 ? (
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 40,
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <IconSymbol name="tray.fill" size={36} color={colors.muted} />
          <Text style={{ fontSize: 15, color: colors.muted, marginTop: 12, fontWeight: "600" }}>
            {t.adminNoBookingsFound}
          </Text>
        </View>
      ) : (
        filtered.map((booking, i) => (
          <Animated.View
            key={booking.id}
            entering={FadeInDown.delay(100 + i * 60).duration(400)}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text
                  numberOfLines={1}
                  style={{ fontSize: 15, fontWeight: "700", color: colors.foreground, marginBottom: 4 }}
                >
                  {booking.packageName || t.adminCustomTrip}
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>
                  {booking.fullName}
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>
                  {booking.email} • {booking.phone}
                </Text>
              </View>
              <StatusBadge status={booking.status} colors={colors} />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 12,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: colors.border,
              }}
            >
              <View style={{ flexDirection: "row", gap: 16 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <IconSymbol name="person.fill" size={12} color={colors.muted} />
                  <Text style={{ fontSize: 12, color: colors.muted }}>
                    {booking.travelers} {t.adminPax}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <IconSymbol name="calendar" size={12} color={colors.muted} />
                  <Text style={{ fontSize: 12, color: colors.muted }}>
                    {booking.checkIn || t.adminNA}
                  </Text>
                </View>
              </View>
              {booking.price && (
                <Text style={{ fontSize: 15, fontWeight: "700", color: colors.primary }}>
                  ${booking.price}
                </Text>
              )}
            </View>

            {/* Action buttons */}
            <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
              {/* Edit button — always visible */}
              <Pressable
                onPress={() => openEdit(booking)}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    backgroundColor: colors.primary + "10",
                    paddingVertical: 10,
                    borderRadius: 10,
                  },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <IconSymbol name="pencil" size={13} color={colors.primary} />
                <Text style={{ color: colors.primary, fontSize: 13, fontWeight: "700" }}>
                  {t.adminEdit}
                </Text>
              </Pressable>

              {booking.status === "pending" && (
                <>
                  <Pressable
                    onPress={() => {
                      haptic();
                      confirmBooking(booking.id);
                    }}
                    style={({ pressed }) => [
                      {
                        flex: 1,
                        backgroundColor: colors.success,
                        paddingVertical: 10,
                        borderRadius: 10,
                        alignItems: "center",
                      },
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>
                      {t.adminConfirm}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      haptic();
                      cancelBooking(booking.id);
                    }}
                    style={({ pressed }) => [
                      {
                        flex: 1,
                        backgroundColor: colors.error + "15",
                        paddingVertical: 10,
                        borderRadius: 10,
                        alignItems: "center",
                      },
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <Text style={{ color: colors.error, fontSize: 13, fontWeight: "700" }}>
                      {t.adminCancel}
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
          </Animated.View>
        ))
      )}
    </View>
  );
}

// ─── Destinations Tab ───────────────────────────────────────────────────────

function DestinationsTab({ colors }: { colors: any }) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [localDests, setLocalDests] = useState<(Destination & { imageUri?: string | null })[]>(() => [...destinations]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", country: "", rating: "5", description: "" });
  const [formImageUri, setFormImageUri] = useState<string | null>(null);
  const [formFallbackImage, setFormFallbackImage] = useState<any>(null);

  const filtered = localDests.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: "", country: "", rating: "5", description: "" });
    setFormImageUri(null);
    setFormFallbackImage(null);
    setModalVisible(true);
    haptic();
  };

  const openEdit = (dest: Destination & { imageUri?: string | null }) => {
    setEditingId(dest.id);
    setForm({
      name: dest.name,
      country: dest.country,
      rating: String(dest.rating),
      description: dest.description,
    });
    setFormImageUri(dest.imageUri ?? null);
    setFormFallbackImage(dest.image ?? null);
    setModalVisible(true);
    haptic();
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.country.trim()) {
      Alert.alert(t.adminValidation, t.adminNameCountryRequired);
      return;
    }
    haptic();
    if (editingId) {
      setLocalDests((prev) =>
        prev.map((d) =>
          d.id === editingId
            ? { ...d, name: form.name.trim(), country: form.country.trim(), rating: Number(form.rating) || 5, description: form.description.trim(), imageUri: formImageUri }
            : d
        )
      );
    } else {
      const newDest: Destination & { imageUri?: string | null } = {
        id: Date.now().toString(),
        name: form.name.trim(),
        country: form.country.trim(),
        rating: Number(form.rating) || 5,
        description: form.description.trim(),
        image: null as any,
        imageUri: formImageUri,
      };
      setLocalDests((prev) => [newDest, ...prev]);
    }
    setModalVisible(false);
  };

  const handleDelete = (dest: Destination) => {
    Alert.alert(t.adminDeleteDestination, `${t.adminDeleteConfirm} "${dest.name}"?`, [
      { text: t.adminCancel, style: "cancel" },
      {
        text: t.adminDelete,
        style: "destructive",
        onPress: () => {
          haptic();
          setLocalDests((prev) => prev.filter((d) => d.id !== dest.id));
        },
      },
    ]);
  };

  return (
    <View>
      {/* Edit Modal */}
      <AdminModal
        visible={modalVisible}
        title={editingId ? t.adminEditDestination : t.adminAddDestinationTitle}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        colors={colors}
      >
        <ImagePickerField label={t.adminCoverImage} imageUri={formImageUri} onImageSelected={setFormImageUri} fallbackSource={formFallbackImage} colors={colors} />
        <FormField label={t.adminName} value={form.name} onChangeText={(v) => setForm((f) => ({ ...f, name: v }))} placeholder={t.adminNamePlaceholder} colors={colors} />
        <FormField label={t.adminCountry} value={form.country} onChangeText={(v) => setForm((f) => ({ ...f, country: v }))} placeholder={t.adminCountryPlaceholder} colors={colors} />
        <FormField label={t.adminRating} value={form.rating} onChangeText={(v) => setForm((f) => ({ ...f, rating: v }))} keyboardType="numeric" colors={colors} />
        <FormField label={t.adminDescription} value={form.description} onChangeText={(v) => setForm((f) => ({ ...f, description: v }))} placeholder={t.adminDescPlaceholder} multiline colors={colors} />
      </AdminModal>

      {/* Search */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surface,
          borderRadius: 14,
          paddingHorizontal: 14,
          paddingVertical: 10,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: colors.border,
          gap: 10,
        }}
      >
        <IconSymbol name="magnifyingglass" size={18} color={colors.muted} />
        <TextInput
          placeholder={t.adminSearchDestinations}
          placeholderTextColor={colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ flex: 1, fontSize: 14, color: colors.foreground }}
        />
      </View>

      {/* Add new */}
      <Pressable
        onPress={openAdd}
        style={({ pressed }) => [
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            backgroundColor: colors.primary + "10",
            paddingVertical: 14,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.primary + "30",
            borderStyle: "dashed",
            marginBottom: 20,
          },
          pressed && { opacity: 0.7 },
        ]}
      >
        <IconSymbol name="plus.circle.fill" size={18} color={colors.primary} />
        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.primary }}>
          {t.adminAddNewDestination}
        </Text>
      </Pressable>

      {filtered.map((dest, i) => (
        <Animated.View
          key={dest.id}
          entering={FadeInDown.delay(i * 80).duration(400)}
          style={{
            flexDirection: "row",
            backgroundColor: colors.surface,
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              backgroundColor: colors.primary + "15",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {dest.imageUri ? (
              <Image source={{ uri: dest.imageUri }} style={{ width: 80, height: 80 }} contentFit="cover" />
            ) : dest.image ? (
              <Image source={dest.image} style={{ width: 80, height: 80 }} contentFit="cover" />
            ) : (
              <IconSymbol name="mappin.and.ellipse" size={28} color={colors.primary} />
            )}
          </View>
          <View style={{ flex: 1, padding: 14, justifyContent: "center" }}>
            <Text
              style={{ fontSize: 15, fontWeight: "700", color: colors.foreground, marginBottom: 4 }}
            >
              {dest.name}
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>
              {dest.country} • {dest.rating}/5
            </Text>
          </View>
          <View style={{ justifyContent: "center", paddingRight: 14, flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Pressable
              onPress={() => openEdit(dest)}
              style={{ padding: 8 }}
            >
              <IconSymbol name="pencil" size={16} color={colors.primary} />
            </Pressable>
            <Pressable
              onPress={() => handleDelete(dest)}
              style={{ padding: 8 }}
            >
              <IconSymbol name="trash.fill" size={16} color={colors.error} />
            </Pressable>
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

// ─── Packages Tab ───────────────────────────────────────────────────────────

function PackagesTab({ colors }: { colors: any }) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [localPkgs, setLocalPkgs] = useState<(TravelPackage & { imageUri?: string | null })[]>(() => [...packages]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    location: "",
    duration: "7D/6N",
    maxPax: "10",
    price: "",
    description: "",
  });
  const [formImageUri, setFormImageUri] = useState<string | null>(null);
  const [formFallbackImage, setFormFallbackImage] = useState<any>(null);

  const filtered = localPkgs.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAdd = () => {
    setEditingId(null);
    setForm({ title: "", location: "", duration: "7D/6N", maxPax: "10", price: "", description: "" });
    setFormImageUri(null);
    setFormFallbackImage(null);
    setModalVisible(true);
    haptic();
  };

  const openEdit = (pkg: TravelPackage & { imageUri?: string | null }) => {
    setEditingId(pkg.id);
    setForm({
      title: pkg.title,
      location: pkg.location,
      duration: pkg.duration,
      maxPax: String(pkg.maxPax),
      price: String(pkg.price),
      description: pkg.description,
    });
    setFormImageUri(pkg.imageUri ?? null);
    setFormFallbackImage(pkg.image ?? null);
    setModalVisible(true);
    haptic();
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.location.trim() || !form.price.trim()) {
      Alert.alert(t.adminValidation, t.adminTitleLocationPriceRequired);
      return;
    }
    haptic();
    if (editingId) {
      setLocalPkgs((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                title: form.title.trim(),
                location: form.location.trim(),
                duration: form.duration.trim(),
                maxPax: Number(form.maxPax) || 10,
                price: Number(form.price) || 0,
                description: form.description.trim(),
                imageUri: formImageUri,
              }
            : p
        )
      );
    } else {
      const newPkg: TravelPackage & { imageUri?: string | null } = {
        id: Date.now().toString(),
        title: form.title.trim(),
        location: form.location.trim(),
        duration: form.duration.trim(),
        maxPax: Number(form.maxPax) || 10,
        price: Number(form.price) || 0,
        description: form.description.trim(),
        rating: 5,
        reviews: 0,
        image: null as any,
        imageUri: formImageUri,
      };
      setLocalPkgs((prev) => [newPkg, ...prev]);
    }
    setModalVisible(false);
  };

  const handleDelete = (pkg: TravelPackage) => {
    Alert.alert(t.adminDeletePackage, `${t.adminDeleteConfirm} "${pkg.title}"?`, [
      { text: t.adminCancel, style: "cancel" },
      {
        text: t.adminDelete,
        style: "destructive",
        onPress: () => {
          haptic();
          setLocalPkgs((prev) => prev.filter((p) => p.id !== pkg.id));
        },
      },
    ]);
  };

  return (
    <View>
      {/* Edit Modal */}
      <AdminModal
        visible={modalVisible}
        title={editingId ? t.adminEditPackage : t.adminAddPackageTitle}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        colors={colors}
      >
        <ImagePickerField label={t.adminPackageImage} imageUri={formImageUri} onImageSelected={setFormImageUri} fallbackSource={formFallbackImage} colors={colors} />
        <FormField label={t.adminPackageTitle} value={form.title} onChangeText={(v) => setForm((f) => ({ ...f, title: v }))} placeholder={t.adminTitlePlaceholder} colors={colors} />
        <FormField label={t.adminLocation} value={form.location} onChangeText={(v) => setForm((f) => ({ ...f, location: v }))} placeholder={t.adminLocationPlaceholder} colors={colors} />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <FormField label={t.adminDuration} value={form.duration} onChangeText={(v) => setForm((f) => ({ ...f, duration: v }))} placeholder={t.adminDurationPlaceholder} colors={colors} />
          </View>
          <View style={{ flex: 1 }}>
            <FormField label={t.adminMaxPax} value={form.maxPax} onChangeText={(v) => setForm((f) => ({ ...f, maxPax: v }))} keyboardType="numeric" colors={colors} />
          </View>
        </View>
        <FormField label={t.adminPrice} value={form.price} onChangeText={(v) => setForm((f) => ({ ...f, price: v }))} keyboardType="numeric" placeholder={t.adminPricePlaceholder} colors={colors} />
        <FormField label={t.adminDescription} value={form.description} onChangeText={(v) => setForm((f) => ({ ...f, description: v }))} placeholder={t.adminPackageDescPlaceholder} multiline colors={colors} />
      </AdminModal>

      {/* Search */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surface,
          borderRadius: 14,
          paddingHorizontal: 14,
          paddingVertical: 10,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: colors.border,
          gap: 10,
        }}
      >
        <IconSymbol name="magnifyingglass" size={18} color={colors.muted} />
        <TextInput
          placeholder={t.adminSearchPackages}
          placeholderTextColor={colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ flex: 1, fontSize: 14, color: colors.foreground }}
        />
      </View>

      {/* Add new */}
      <Pressable
        onPress={openAdd}
        style={({ pressed }) => [
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            backgroundColor: colors.primary + "10",
            paddingVertical: 14,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.primary + "30",
            borderStyle: "dashed",
            marginBottom: 20,
          },
          pressed && { opacity: 0.7 },
        ]}
      >
        <IconSymbol name="plus.circle.fill" size={18} color={colors.primary} />
        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.primary }}>
          {t.adminAddNewPackage}
        </Text>
      </Pressable>

      {filtered.map((pkg, i) => (
        <Animated.View
          key={pkg.id}
          entering={FadeInDown.delay(i * 80).duration(400)}
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          {/* Package image banner */}
          {(pkg.imageUri || pkg.image) && (
            <View style={{ width: "100%", height: 100, backgroundColor: colors.primary + "10" }}>
              <Image
                source={pkg.imageUri ? { uri: pkg.imageUri } : pkg.image}
                style={{ width: "100%", height: 100 }}
                contentFit="cover"
              />
            </View>
          )}
          <View style={{ padding: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text
                numberOfLines={2}
                style={{ fontSize: 14, fontWeight: "700", color: colors.foreground, marginBottom: 4 }}
              >
                {pkg.title}
              </Text>
              <View style={{ flexDirection: "row", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <Text style={{ fontSize: 12, color: colors.muted }}>
                  {pkg.location}
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>•</Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>
                  {pkg.duration}
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>•</Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>
                  {pkg.maxPax} {t.adminPax}
                </Text>
              </View>
            </View>
            <Text style={{ fontSize: 16, fontWeight: "800", color: colors.primary }}>
              ${pkg.price}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 12,
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <IconSymbol name="star.fill" size={12} color="#F59E0B" />
              <Text style={{ fontSize: 12, color: colors.foreground, fontWeight: "600" }}>
                {pkg.rating}
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted }}>
                ({pkg.reviews} {t.adminReviews})
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable
                onPress={() => openEdit(pkg)}
                style={{ padding: 6 }}
              >
                <IconSymbol name="pencil" size={16} color={colors.primary} />
              </Pressable>
              <Pressable
                onPress={() => handleDelete(pkg)}
                style={{ padding: 6 }}
              >
                <IconSymbol name="trash.fill" size={16} color={colors.error} />
              </Pressable>
            </View>
          </View>
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

// ─── Users Tab ──────────────────────────────────────────────────────────────

function UsersTab({ colors }: { colors: any }) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [localUsers, setLocalUsers] = useState<MockUser[]>(() => [...MOCK_USERS]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "user" as "user" | "admin" });
  const [formAvatarUri, setFormAvatarUri] = useState<string | null>(null);

  const filtered = localUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openEdit = (user: MockUser) => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, role: user.role });
    setFormAvatarUri(user.avatar ?? null);
    setModalVisible(true);
    haptic();
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) {
      Alert.alert(t.adminValidation, t.adminNameEmailRequired);
      return;
    }
    haptic();
    setLocalUsers((prev) =>
      prev.map((u) =>
        u.id === editingId
          ? { ...u, name: form.name.trim(), email: form.email.trim(), role: form.role, avatar: formAvatarUri }
          : u
      )
    );
    setModalVisible(false);
  };

  const toggleStatus = (userId: string) => {
    haptic();
    setLocalUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "active" ? "suspended" : "active" }
          : u
      )
    );
  };

  const toggleRole = (userId: string) => {
    haptic();
    setLocalUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, role: u.role === "admin" ? "user" : "admin" }
          : u
      )
    );
  };

  return (
    <View>
      {/* Edit Modal */}
      <AdminModal
        visible={modalVisible}
        title={t.adminEditUser}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        colors={colors}
      >
        <ImagePickerField label={t.adminAvatar} imageUri={formAvatarUri} onImageSelected={setFormAvatarUri} colors={colors} shape="circle" />
        <FormField label={t.adminName} value={form.name} onChangeText={(v) => setForm((f) => ({ ...f, name: v }))} colors={colors} />
        <FormField label={t.adminEmail} value={form.email} onChangeText={(v) => setForm((f) => ({ ...f, email: v }))} keyboardType="email-address" colors={colors} />
        <View style={{ marginBottom: 14 }}>
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted, marginBottom: 6 }}>
            {t.adminRole}
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {(["user", "admin"] as const).map((r) => (
              <Pressable
                key={r}
                onPress={() => setForm((f) => ({ ...f, role: r }))}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 10,
                  alignItems: "center",
                  backgroundColor: form.role === r ? colors.primary : colors.background,
                  borderWidth: 1,
                  borderColor: form.role === r ? colors.primary : colors.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: form.role === r ? "#fff" : colors.muted,
                    textTransform: "capitalize",
                  }}
                >
                  {r}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </AdminModal>

      {/* Search */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surface,
          borderRadius: 14,
          paddingHorizontal: 14,
          paddingVertical: 10,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: colors.border,
          gap: 10,
        }}
      >
        <IconSymbol name="magnifyingglass" size={18} color={colors.muted} />
        <TextInput
          placeholder={t.adminSearchUsers}
          placeholderTextColor={colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ flex: 1, fontSize: 14, color: colors.foreground }}
        />
      </View>

      {/* User summary */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.success + "10",
            borderRadius: 12,
            padding: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "800", color: colors.success }}>
            {localUsers.filter((u) => u.status === "active").length}
          </Text>
          <Text style={{ fontSize: 11, color: colors.muted }}>{t.adminActive}</Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.error + "10",
            borderRadius: 12,
            padding: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "800", color: colors.error }}>
            {localUsers.filter((u) => u.status === "suspended").length}
          </Text>
          <Text style={{ fontSize: 11, color: colors.muted }}>{t.adminSuspended}</Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.primary + "10",
            borderRadius: 12,
            padding: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "800", color: colors.primary }}>
            {localUsers.filter((u) => u.role === "admin").length}
          </Text>
          <Text style={{ fontSize: 11, color: colors.muted }}>{t.adminAdmins}</Text>
        </View>
      </View>

      {filtered.map((user, i) => (
        <Animated.View
          key={user.id}
          entering={FadeInDown.delay(i * 80).duration(400)}
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            {/* Avatar */}
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.primary + "15",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={{ width: 44, height: 44 }} contentFit="cover" />
              ) : (
                <Text style={{ fontSize: 16, fontWeight: "700", color: colors.primary }}>
                  {user.name.charAt(0)}
                </Text>
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 14, fontWeight: "700", color: colors.foreground, marginBottom: 2 }}
              >
                {user.name}
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted }}>{user.email}</Text>
            </View>

            <View style={{ alignItems: "flex-end", gap: 4 }}>
              <StatusBadge status={user.status} colors={colors} />
              <StatusBadge status={user.role} colors={colors} />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 12,
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            <Text style={{ fontSize: 12, color: colors.muted }}>
              {t.adminJoined}: {user.joinedAt}
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>
              {user.bookings} {t.adminBookingsCount}
            </Text>
          </View>

          {/* Action buttons */}
          <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
            <Pressable
              onPress={() => openEdit(user)}
              style={({ pressed }) => [
                {
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  paddingVertical: 9,
                  borderRadius: 10,
                  backgroundColor: colors.primary + "10",
                },
                pressed && { opacity: 0.7 },
              ]}
            >
              <IconSymbol name="pencil" size={13} color={colors.primary} />
              <Text style={{ fontSize: 12, fontWeight: "700", color: colors.primary }}>{t.adminEdit}</Text>
            </Pressable>

            <Pressable
              onPress={() => toggleRole(user.id)}
              style={({ pressed }) => [
                {
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  paddingVertical: 9,
                  borderRadius: 10,
                  backgroundColor: colors.warning + "10",
                },
                pressed && { opacity: 0.7 },
              ]}
            >
              <IconSymbol name="shield.lefthalf.filled" size={13} color={colors.warning} />
              <Text style={{ fontSize: 12, fontWeight: "700", color: colors.warning }}>
                {user.role === "admin" ? t.adminDemote : t.adminPromote}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => toggleStatus(user.id)}
              style={({ pressed }) => [
                {
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  paddingVertical: 9,
                  borderRadius: 10,
                  backgroundColor:
                    user.status === "active" ? colors.error + "10" : colors.success + "10",
                },
                pressed && { opacity: 0.7 },
              ]}
            >
              <IconSymbol
                name={user.status === "active" ? "nosign" : "checkmark.circle.fill"}
                size={13}
                color={user.status === "active" ? colors.error : colors.success}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: user.status === "active" ? colors.error : colors.success,
                }}
              >
                {user.status === "active" ? t.adminSuspend : t.adminActivate}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

// ─── Chat Tab ───────────────────────────────────────────────────────────────

function ChatTab({ colors }: { colors: any }) {
  const { t, language } = useTranslation();
  const {
    conversations,
    sendAdminMessage,
    markReadByAdmin,
    closeConversation,
    reopenConversation,
    totalUnreadByAdmin,
    refreshNow,
    translateMessage,
    translateBatch,
  } = useChat({ role: "admin", pollMs: 2000 });
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const listRef = useRef<FlatList>(null);

  // ── Chat translation state ──
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});
  const [translatingIds, setTranslatingIds] = useState<Set<string>>(new Set());
  const [showTranslated, setShowTranslated] = useState<Set<string>>(new Set());

  const activeConvo = conversations.find((c) => c.id === selectedConvo);
  const isConvoClosed = activeConvo?.status === "closed";

  /** Translate a single message and toggle its display */
  const handleTranslateMessage = useCallback(async (msgId: string, conversationId: string) => {
    if (translatedTexts[msgId]) {
      setShowTranslated((prev) => {
        const next = new Set(prev);
        if (next.has(msgId)) next.delete(msgId); else next.add(msgId);
        return next;
      });
      return;
    }
    setTranslatingIds((prev) => new Set(prev).add(msgId));
    try {
      const result = await translateMessage(conversationId, msgId, language);
      if (result) {
        setTranslatedTexts((prev) => ({ ...prev, [msgId]: result }));
        setShowTranslated((prev) => new Set(prev).add(msgId));
      }
    } catch (err) {
      console.error("Translation failed:", err);
    } finally {
      setTranslatingIds((prev) => { const next = new Set(prev); next.delete(msgId); return next; });
    }
  }, [translatedTexts, translateMessage, language]);

  /** Translate all user messages at once */
  const handleTranslateAll = useCallback(() => {
    if (!activeConvo || language === "en") return;
    const userMsgs = activeConvo.messages.filter((m) => m.sender === "user" && !translatedTexts[m.id] && !translatingIds.has(m.id));
    if (userMsgs.length === 0) return;
    const ids = userMsgs.map((m) => m.id);
    setTranslatingIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
    translateBatch(activeConvo.id, ids, language).then((results) => {
      setTranslatingIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
      if (Object.keys(results).length > 0) {
        setTranslatedTexts((prev) => ({ ...prev, ...results }));
        setShowTranslated((prev) => {
          const next = new Set(prev);
          Object.keys(results).forEach((id) => next.add(id));
          return next;
        });
      }
    }).catch(() => {
      setTranslatingIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    });
  }, [activeConvo, language, translatedTexts, translatingIds, translateBatch]);

  // ── Auto-translate incoming user messages ──
  useEffect(() => {
    if (!autoTranslate || !activeConvo || language === "en") return;
    const untranslated = activeConvo.messages.filter(
      (m) => m.sender === "user" && !translatedTexts[m.id] && !translatingIds.has(m.id),
    );
    if (untranslated.length === 0) return;
    const ids = untranslated.map((m) => m.id);
    setTranslatingIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
    translateBatch(activeConvo.id, ids, language).then((results) => {
      setTranslatingIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
      if (Object.keys(results).length > 0) {
        setTranslatedTexts((prev) => ({ ...prev, ...results }));
        setShowTranslated((prev) => {
          const next = new Set(prev);
          Object.keys(results).forEach((id) => next.add(id));
          return next;
        });
      }
    }).catch(() => {
      setTranslatingIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoTranslate, activeConvo?.messages.length, language, selectedConvo]);

  // Auto-scroll + haptic when new user messages arrive while viewing a conversation
  const prevMsgCount = useRef(activeConvo?.messages.length ?? 0);
  useEffect(() => {
    const currentCount = activeConvo?.messages.length ?? 0;
    if (currentCount > prevMsgCount.current && activeConvo) {
      const newMsgs = activeConvo.messages.slice(prevMsgCount.current);
      const userReplies = newMsgs.filter((m) => m.sender === "user").length;
      if (userReplies > 0) {
        haptic();
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 120);
      }
    }
    prevMsgCount.current = currentCount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConvo?.messages.length]);

  const handleSelectConvo = (id: string) => {
    haptic();
    setSelectedConvo(id);
    // Reset translation state for the new conversation
    setTranslatedTexts({});
    setTranslatingIds(new Set());
    setShowTranslated(new Set());
    markReadByAdmin(id);
    // Instant sync when opening a conversation
    refreshNow();
  };

  const handleSendReply = () => {
    const trimmed = reply.trim();
    if (!trimmed || !selectedConvo) return;
    haptic();
    sendAdminMessage(selectedConvo, trimmed, language);
    setReply("");
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    // Trigger sync after short delay so user sees the message faster
    setTimeout(() => refreshNow(), 800);
  };

  const handleBack = () => {
    haptic();
    setSelectedConvo(null);
    // Reset translation state
    setTranslatedTexts({});
    setTranslatingIds(new Set());
    setShowTranslated(new Set());
  };

  // ── Conversation detail view ──
  if (activeConvo) {
    return (
      <View>
        {/* Back + header */}
        <Pressable
          onPress={handleBack}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <IconSymbol name="chevron.left" size={18} color={colors.primary} />
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: colors.primary + "20",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "700", color: colors.primary }}>
              {activeConvo.userName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground }}>
              {activeConvo.userName}
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>
              {activeConvo.userEmail}
            </Text>
          </View>
          {isConvoClosed ? (
            <Pressable
              onPress={() => {
                haptic();
                reopenConversation(activeConvo.id);
              }}
              style={({ pressed }) => [
                {
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                  backgroundColor: colors.success + "15",
                },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={{ fontSize: 12, fontWeight: "700", color: colors.success }}>
                {t.adminReopen}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => {
                haptic();
                closeConversation(activeConvo.id, "admin");
              }}
              style={({ pressed }) => [
                {
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                  backgroundColor: colors.error + "15",
                },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={{ fontSize: 12, fontWeight: "700", color: colors.error }}>
                {t.adminClose}
              </Text>
            </Pressable>
          )}
        </Pressable>

        {/* Translation toolbar — shown when admin language is not English */}
        {language !== "en" && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
              paddingHorizontal: 4,
            }}
          >
            <Pressable
              onPress={handleTranslateAll}
              style={({ pressed }) => [
                {
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 12,
                  backgroundColor: colors.primary + "12",
                },
                pressed && { opacity: 0.7 },
              ]}
            >
              <IconSymbol name="textformat" size={13} color={colors.primary} />
              <Text style={{ fontSize: 11, fontWeight: "600", color: colors.primary }}>
                {t.chatTranslateAll}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setAutoTranslate((v) => !v)}
              style={({ pressed }) => [
                {
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 12,
                  backgroundColor: autoTranslate ? colors.primary + "25" : colors.surface,
                  borderWidth: autoTranslate ? 1 : 0,
                  borderColor: colors.primary + "50",
                },
                pressed && { opacity: 0.7 },
              ]}
            >
              <IconSymbol name="sparkles" size={13} color={autoTranslate ? colors.primary : colors.muted} />
              <Text style={{ fontSize: 11, fontWeight: "600", color: autoTranslate ? colors.primary : colors.muted }}>
                {t.chatAutoTranslate}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Messages */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.border,
            minHeight: 300,
            maxHeight: 420,
            overflow: "hidden",
          }}
        >
          {activeConvo.messages.length === 0 ? (
            <View style={{ flex: 1, padding: 40, alignItems: "center", justifyContent: "center" }}>
              <IconSymbol name="bubble.left.and.bubble.right" size={36} color={colors.muted} />
              <Text style={{ fontSize: 14, color: colors.muted, marginTop: 12 }}>
                {t.adminNoMessages}
              </Text>
            </View>
          ) : (
            <FlatList
              ref={listRef}
              data={activeConvo.messages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 14, gap: 8 }}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
              renderItem={({ item }) => {
                const isAdmin = item.sender === "support";
                const msgId = item.id;
                const isTranslatedShown = showTranslated.has(msgId);
                const isTranslatingMsg = translatingIds.has(msgId);
                const displayText = isTranslatedShown && translatedTexts[msgId] ? translatedTexts[msgId] : item.text;
                // Translate button on user (non-admin) messages
                const canTranslate = !isAdmin;
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: isAdmin ? "flex-end" : "flex-start",
                    }}
                  >
                    <View style={{ maxWidth: "75%" }}>
                      <View
                        style={{
                          backgroundColor: isAdmin ? colors.primary : colors.background,
                          borderRadius: 16,
                          borderBottomRightRadius: isAdmin ? 4 : 16,
                          borderBottomLeftRadius: isAdmin ? 16 : 4,
                          paddingHorizontal: 14,
                          paddingVertical: 10,
                        }}
                      >
                        {!isAdmin && (
                          <Text
                            style={{
                              fontSize: 10,
                              fontWeight: "700",
                              color: colors.primary,
                              marginBottom: 2,
                            }}
                          >
                            {activeConvo.userName}
                          </Text>
                        )}
                        <Text
                          style={{
                            fontSize: 14,
                            color: isAdmin ? "#fff" : colors.foreground,
                            lineHeight: 20,
                          }}
                        >
                          {displayText}
                        </Text>
                        {isTranslatedShown && (
                          <Text style={{ color: isAdmin ? "rgba(255,255,255,0.5)" : colors.muted, fontSize: 10, fontStyle: "italic", marginTop: 2 }}>
                            {t.chatTranslatedFrom} {item.originalLang ?? "?"}
                          </Text>
                        )}
                        <Text
                          style={{
                            fontSize: 10,
                            color: isAdmin ? "rgba(255,255,255,0.6)" : colors.muted,
                            marginTop: 4,
                            textAlign: "right",
                          }}
                        >
                          {item.time}
                        </Text>
                      </View>
                      {canTranslate && language !== "en" && (
                        <Pressable
                          onPress={() => handleTranslateMessage(msgId, activeConvo.id)}
                          disabled={isTranslatingMsg}
                          style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3, marginLeft: 4 }}
                        >
                          <IconSymbol name="textformat" size={11} color={colors.primary} />
                          <Text style={{ fontSize: 10, color: colors.primary, fontWeight: "500" }}>
                            {isTranslatingMsg ? t.chatTranslating : isTranslatedShown ? t.chatShowOriginal : t.chatTranslate}
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  </View>
                );
              }}
            />
          )}
        </View>

        {/* Reply input */}
        {isConvoClosed ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 14,
              paddingVertical: 14,
              backgroundColor: colors.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <IconSymbol name="checkmark.circle.fill" size={16} color={colors.muted} />
            <Text style={{ fontSize: 13, color: colors.muted, fontWeight: "600" }}>
              {t.adminConvoClosed}
            </Text>
          </View>
        ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 14,
          }}
        >
          <TextInput
            value={reply}
            onChangeText={setReply}
            placeholder={t.adminTypeReply}
            placeholderTextColor={colors.muted}
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 12,
              color: colors.foreground,
              fontSize: 14,
              borderWidth: 1,
              borderColor: colors.border,
            }}
            returnKeyType="send"
            onSubmitEditing={handleSendReply}
            multiline
            maxLength={500}
          />
          <Pressable
            onPress={handleSendReply}
            style={({ pressed }) => [
              {
                width: 46,
                height: 46,
                borderRadius: 23,
                backgroundColor: reply.trim() ? colors.primary : colors.border,
                alignItems: "center",
                justifyContent: "center",
              },
              pressed && { transform: [{ scale: 0.92 }] },
            ]}
          >
            <IconSymbol name="paperplane.fill" size={18} color="#fff" />
          </Pressable>
        </View>
        )}
      </View>
    );
  }

  // ── Conversation list view ──
  return (
    <View>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground }}>
            {t.adminConversations}
          </Text>
          {/* Live sync dot */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: "#22C55E",
              }}
            />
            <Text style={{ fontSize: 10, color: colors.muted }}>{t.adminLive}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {/* Manual refresh button */}
          <Pressable
            onPress={() => { haptic(); refreshNow(); }}
            style={({ pressed }) => [
              {
                padding: 6,
                borderRadius: 10,
                backgroundColor: colors.surface,
              },
              pressed && { opacity: 0.7 },
            ]}
          >
            <IconSymbol name="arrow.clockwise" size={14} color={colors.muted} />
          </Pressable>
          {totalUnreadByAdmin > 0 && (
            <View
              style={{
                backgroundColor: colors.error,
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#fff" }}>
                {totalUnreadByAdmin} {t.adminUnread}
              </Text>
            </View>
          )}
        </View>
      </View>

      {conversations.length === 0 ? (
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 40,
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <IconSymbol name="bubble.left.and.bubble.right" size={40} color={colors.muted} />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: colors.foreground,
              marginTop: 16,
            }}
          >
            {t.adminNoConvoYet}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: colors.muted,
              textAlign: "center",
              marginTop: 6,
              lineHeight: 18,
            }}
          >
            {t.adminNoConvoDesc}
          </Text>
        </Animated.View>
      ) : (
        conversations.map((convo, i) => {
          const lastMsg =
            convo.messages.length > 0
              ? convo.messages[convo.messages.length - 1]
              : null;
          return (
            <Animated.View
              key={convo.id}
              entering={FadeInDown.delay(i * 80).duration(400)}
            >
              <Pressable
                onPress={() => handleSelectConvo(convo.id)}
                style={({ pressed }) => [
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 14,
                    backgroundColor: colors.surface,
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor:
                      convo.unreadByAdmin > 0
                        ? colors.primary + "40"
                        : colors.border,
                  },
                  pressed && { opacity: 0.7 },
                ]}
              >
                {/* Avatar */}
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: colors.primary + "20",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: colors.primary,
                    }}
                  >
                    {convo.userName.charAt(0).toUpperCase()}
                  </Text>
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: colors.foreground,
                      }}
                    >
                      {convo.userName}
                    </Text>
                    {lastMsg && (
                      <Text style={{ fontSize: 11, color: colors.muted }}>
                        {lastMsg.time}
                      </Text>
                    )}
                  </View>
                  <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                    {convo.userEmail}
                  </Text>
                  {lastMsg && (
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 13,
                        color:
                          convo.unreadByAdmin > 0
                            ? colors.foreground
                            : colors.muted,
                        fontWeight: convo.unreadByAdmin > 0 ? "600" : "400",
                        marginTop: 4,
                      }}
                    >
                      {lastMsg.sender === "support" ? t.adminYou : ""}
                      {lastMsg.text}
                    </Text>
                  )}
                </View>

                {/* Unread badge or Closed badge */}
                {convo.status === "closed" ? (
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 8,
                      backgroundColor: colors.muted + "20",
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: "700", color: colors.muted }}>
                      {t.adminClosed}
                    </Text>
                  </View>
                ) : convo.unreadByAdmin > 0 ? (
                  <View
                    style={{
                      minWidth: 22,
                      height: 22,
                      borderRadius: 11,
                      backgroundColor: colors.primary,
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "700",
                        color: "#fff",
                      }}
                    >
                      {convo.unreadByAdmin}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            </Animated.View>
          );
        })
      )}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function AdminScreen() {
  const { t } = useTranslation();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  const TABS: { id: AdminTab; label: string; icon: string }[] = [
    { id: "dashboard", label: t.adminTabDashboard, icon: "square.grid.2x2.fill" },
    { id: "bookings", label: t.adminTabBookings, icon: "suitcase.fill" },
    { id: "chat", label: t.adminTabChat, icon: "bubble.left.and.bubble.right.fill" },
    { id: "destinations", label: t.adminTabDestinations, icon: "map.fill" },
    { id: "packages", label: t.adminTabPackages, icon: "shippingbox.fill" },
    { id: "users", label: t.adminTabUsers, icon: "person.2.fill" },
  ];

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <TopNavBar
        title={t.adminTitle}
        showBack
        rightContent={
          <Pressable
            onPress={() => {
              haptic();
              router.push("/settings");
            }}
            style={{ padding: 8 }}
          >
            <IconSymbol name="gearshape.fill" size={20} color={colors.foreground} />
          </Pressable>
        }
      />

      {/* Admin header gradient */}
      <LinearGradient
        colors={["#0F172A", "#1E293B"]}
        style={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 16,
        }}
      >
        <Animated.View entering={FadeIn.duration(600)}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: "rgba(255,255,255,0.1)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconSymbol name="shield.lefthalf.filled" size={20} color="#60A5FA" />
            </View>
            <View>
              <Text style={{ fontSize: 18, fontWeight: "800", color: "#fff" }}>
                {t.adminDashboardTitle}
              </Text>
              <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                {t.adminDashboardSubtitle}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Tab bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 4, paddingTop: 8 }}
        >
          {TABS.map((tab) => (
            <Pressable
              key={tab.id}
              onPress={() => {
                haptic();
                setActiveTab(tab.id);
              }}
              style={({ pressed }) => [
                {
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 10,
                  backgroundColor:
                    activeTab === tab.id ? "rgba(255,255,255,0.15)" : "transparent",
                },
                pressed && { opacity: 0.7 },
              ]}
            >
              <IconSymbol
                name={tab.icon as any}
                size={16}
                color={activeTab === tab.id ? "#60A5FA" : "rgba(255,255,255,0.5)"}
              />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: activeTab === tab.id ? "700" : "500",
                  color: activeTab === tab.id ? "#fff" : "rgba(255,255,255,0.5)",
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Tab content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 40,
        }}
      >
        <View style={activeTab !== "dashboard" ? { display: "none" } : undefined}>
          <DashboardTab colors={colors} onSwitchTab={setActiveTab} />
        </View>
        <View style={activeTab !== "bookings" ? { display: "none" } : undefined}>
          <BookingsTab colors={colors} />
        </View>
        <View style={activeTab !== "destinations" ? { display: "none" } : undefined}>
          <DestinationsTab colors={colors} />
        </View>
        <View style={activeTab !== "packages" ? { display: "none" } : undefined}>
          <PackagesTab colors={colors} />
        </View>
        <View style={activeTab !== "users" ? { display: "none" } : undefined}>
          <UsersTab colors={colors} />
        </View>
        <View style={activeTab !== "chat" ? { display: "none" } : undefined}>
          <ChatTab colors={colors} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
