import { Text, View, ScrollView, Pressable, TextInput, Alert, Platform } from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function BookingScreen() {
  const colors = useColors();
  const params = useLocalSearchParams<{ packageName?: string; price?: string }>();
  
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

  const handleBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const handleSubmit = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    if (!formData.fullName || !formData.email || !formData.phone) {
      Alert.alert("Required Fields", "Please fill in all required fields.");
      return;
    }

    Alert.alert(
      "Booking Request Sent!",
      `Thank you ${formData.fullName}! We have received your booking request for ${formData.destination || "your trip"}. Our team will contact you at ${formData.email} within 24 hours.`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScreenContainer className="px-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center pt-4 pb-6">
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [
              { padding: 8, marginLeft: -8 },
              pressed && { opacity: 0.7 }
            ]}
          >
            <IconSymbol name="chevron.right" size={24} color={colors.foreground} style={{ transform: [{ rotate: '180deg' }] }} />
          </Pressable>
          <Text 
            className="text-2xl font-bold ml-2" 
            style={{ color: colors.foreground }}
          >
            Book Your Trip
          </Text>
        </View>

        {/* Package Info (if coming from a package) */}
        {params.packageName && (
          <View 
            className="rounded-2xl p-4 mb-6"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white/80 text-sm">Selected Package</Text>
            <Text className="text-white text-lg font-bold">{params.packageName}</Text>
            {params.price && (
              <Text className="text-white text-xl font-bold mt-1">
                ${params.price} <Text className="text-sm font-normal">/ per person</Text>
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
            Personal Information
          </Text>

          {/* Full Name */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
              Full Name *
            </Text>
            <TextInput
              placeholder="Enter your full name"
              placeholderTextColor={colors.muted}
              value={formData.fullName}
              onChangeText={(v) => updateField("fullName", v)}
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: colors.surface, color: colors.foreground }}
            />
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
              Email Address *
            </Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor={colors.muted}
              value={formData.email}
              onChangeText={(v) => updateField("email", v)}
              keyboardType="email-address"
              autoCapitalize="none"
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: colors.surface, color: colors.foreground }}
            />
          </View>

          {/* Phone */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
              Phone Number *
            </Text>
            <TextInput
              placeholder="Enter your phone number"
              placeholderTextColor={colors.muted}
              value={formData.phone}
              onChangeText={(v) => updateField("phone", v)}
              keyboardType="phone-pad"
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: colors.surface, color: colors.foreground }}
            />
          </View>
        </View>

        {/* Trip Details */}
        <View className="mb-6">
          <Text 
            className="text-lg font-bold mb-4" 
            style={{ color: colors.foreground }}
          >
            Trip Details
          </Text>

          {/* Destination */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
              Destination
            </Text>
            <TextInput
              placeholder="Where do you want to go?"
              placeholderTextColor={colors.muted}
              value={formData.destination}
              onChangeText={(v) => updateField("destination", v)}
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: colors.surface, color: colors.foreground }}
            />
          </View>

          {/* Number of Travelers */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
              Number of Travelers
            </Text>
            <TextInput
              placeholder="1"
              placeholderTextColor={colors.muted}
              value={formData.travelers}
              onChangeText={(v) => updateField("travelers", v)}
              keyboardType="number-pad"
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: colors.surface, color: colors.foreground }}
            />
          </View>

          {/* Check-in Date */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
              Preferred Check-in Date
            </Text>
            <TextInput
              placeholder="YYYY-MM-DD"
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
              Preferred Check-out Date
            </Text>
            <TextInput
              placeholder="YYYY-MM-DD"
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
              Special Requests
            </Text>
            <TextInput
              placeholder="Any special requirements or preferences?"
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
          <Text className="text-white font-bold text-lg">Submit Booking Request</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}
