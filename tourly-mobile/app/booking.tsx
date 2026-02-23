import { Text, View, ScrollView, Pressable, TextInput, Alert, Platform } from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useBookings } from "@/lib/store";
import { useTranslation } from "@/lib/i18n";
import { useCurrency } from "@/lib/currency";
import { TopNavBar } from "@/components/top-nav-bar";

export default function BookingScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const { format } = useCurrency();
  const params = useLocalSearchParams<{ packageName?: string; price?: string }>();
  const { addBooking } = useBookings();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    destination: params.packageName || "",
    travelers: "1",
    checkIn: "",
    checkOut: "",
    specialRequests: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = t.validationNameRequired;
    if (!formData.email.trim()) {
      newErrors.email = t.validationEmailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.validationEmailInvalid;
    }
    if (!formData.phone.trim()) newErrors.phone = t.validationPhoneRequired;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    addBooking({
      packageName: formData.destination || t.customTrip,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      travelers: formData.travelers,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      price: params.price,
    });

    Alert.alert(
      t.bookingSuccess,
      `${t.thankYou} ${formData.fullName}!`,
      [{ text: t.ok, onPress: () => router.back() }]
    );
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
    }
  };

  return (
    <ScreenContainer className="px-4" edges={["left", "right"]}>
      <TopNavBar title={t.bookingTitle} showBack />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8 }}>

        {/* Package Info (if coming from a package) */}
        {params.packageName && (
          <View 
            className="rounded-2xl p-4 mb-6"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white/80 text-sm">{t.selectedPackage}</Text>
            <Text className="text-white text-lg font-bold">{params.packageName}</Text>
            {params.price && (
              <Text className="text-white text-xl font-bold mt-1">
                {format(Number(params.price))} <Text className="text-sm font-normal">{t.perPersonShort}</Text>
              </Text>
            )}
          </View>
        )}

        {/* Form */}
        <View className="mb-6">
          <Text 
            className="text-lg font-bold mb-4" 
            style={{ color: colors.foreground }}
          >
            {t.personalInfo}
          </Text>

          {/* Full Name */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
              {t.fullName} *
            </Text>
            <TextInput
              placeholder={t.fullName}
              placeholderTextColor={colors.muted}
              value={formData.fullName}
              onChangeText={(v) => updateField("fullName", v)}
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: colors.surface, color: colors.foreground }}
            />
            {errors.fullName ? <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.fullName}</Text> : null}
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
              {t.email} *
            </Text>
            <TextInput
              placeholder={t.email}
              placeholderTextColor={colors.muted}
              value={formData.email}
              onChangeText={(v) => updateField("email", v)}
              keyboardType="email-address"
              autoCapitalize="none"
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: colors.surface, color: colors.foreground }}
            />
            {errors.email ? <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.email}</Text> : null}
          </View>

          {/* Phone */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
              {t.phone} *
            </Text>
            <TextInput
              placeholder={t.phone}
              placeholderTextColor={colors.muted}
              value={formData.phone}
              onChangeText={(v) => updateField("phone", v)}
              keyboardType="phone-pad"
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: colors.surface, color: colors.foreground }}
            />
            {errors.phone ? <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.phone}</Text> : null}
          </View>
        </View>

        {/* Trip Details */}
        <View className="mb-6">
          <Text 
            className="text-lg font-bold mb-4" 
            style={{ color: colors.foreground }}
          >
            {t.tripDetails}
          </Text>

          {/* Destination */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
              {t.destinationLabel}
            </Text>
            <TextInput
              placeholder={t.whereToGo}
              placeholderTextColor={colors.muted}
              value={formData.destination}
              onChangeText={(v) => updateField("destination", v)}
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: colors.surface, color: colors.foreground }}
            />
          </View>

          {/* Number of Travelers */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 8, color: colors.foreground }}>
              {t.numberOfTravelers}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.surface,
                borderRadius: 12,
                paddingHorizontal: 4,
                paddingVertical: 4,
              }}
            >
              <Pressable
                onPress={() => {
                  const n = Math.max(1, parseInt(formData.travelers) - 1);
                  if (Platform.OS !== "web") Haptics.selectionAsync();
                  updateField("travelers", n.toString());
                }}
                style={({ pressed }) => [
                  {
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    backgroundColor: colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={{ color: colors.foreground, fontSize: 22, fontWeight: "600", lineHeight: 26 }}>-</Text>
              </Pressable>
              <Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "700",
                  color: colors.foreground,
                }}
              >
                {formData.travelers}
              </Text>
              <Pressable
                onPress={() => {
                  const n = Math.min(20, parseInt(formData.travelers) + 1);
                  if (Platform.OS !== "web") Haptics.selectionAsync();
                  updateField("travelers", n.toString());
                }}
                style={({ pressed }) => [
                  {
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    backgroundColor: colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={{ color: "white", fontSize: 22, fontWeight: "600", lineHeight: 26 }}>+</Text>
              </Pressable>
            </View>
          </View>

          {/* Check-in Date */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
              {t.preferredCheckIn}
            </Text>
            <TextInput
              placeholder={t.datePlaceholder}
              placeholderTextColor={colors.muted}
              value={formData.checkIn}
              onChangeText={(v) => updateField("checkIn", v)}
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: colors.surface, color: colors.foreground }}
            />
          </View>

          {/* Check-out Date */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
              {t.preferredCheckOut}
            </Text>
            <TextInput
              placeholder={t.datePlaceholder}
              placeholderTextColor={colors.muted}
              value={formData.checkOut}
              onChangeText={(v) => updateField("checkOut", v)}
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: colors.surface, color: colors.foreground }}
            />
          </View>

          {/* Special Requests */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
              {t.specialRequests}
            </Text>
            <TextInput
              placeholder={t.specialRequestsPlaceholder}
              placeholderTextColor={colors.muted}
              value={formData.specialRequests}
              onChangeText={(v) => updateField("specialRequests", v)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: colors.surface, color: colors.foreground, minHeight: 100 }}
            />
          </View>
        </View>

        {/* Submit Button */}
        <Pressable
          onPress={handleSubmit}
          style={({ pressed }) => [
            { 
              backgroundColor: colors.primary, 
              paddingVertical: 16, 
              borderRadius: 50, 
              alignItems: "center",
              marginBottom: 32,
            },
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
          ]}
        >
          <Text className="text-white font-bold text-lg">{t.submitBookingRequest}</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}
