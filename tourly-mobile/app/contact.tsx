import { Text, View, ScrollView, Pressable, TextInput, Linking, Platform } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function ContactScreen() {
  const colors = useColors();
  const [email, setEmail] = useState("");

  const handleCall = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Linking.openURL("tel:+01123456790");
  };

  const handleEmail = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Linking.openURL("mailto:info@tourly.com");
  };

  const handleSubscribe = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setEmail("");
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
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
            <IconSymbol name="chevron.left.forwardslash.chevron.right" size={24} color={colors.foreground} />
          </Pressable>
          <Text 
            className="text-2xl font-bold ml-2" 
            style={{ color: colors.foreground }}
          >
            Contact Us
          </Text>
        </View>

        {/* CTA Section */}
        <View 
          className="rounded-2xl p-6 mb-6"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white/80 text-sm uppercase mb-2">Call To Action</Text>
          <Text className="text-white text-xl font-bold mb-3">
            Ready For Unforgettable Travel?
          </Text>
          <Text className="text-white/80 text-sm">
            Contact us today and let us help you plan your dream vacation. Our team is ready to assist you 24/7.
          </Text>
        </View>

        {/* Contact Information */}
        <View className="mb-6">
          <Text 
            className="text-lg font-bold mb-4" 
            style={{ color: colors.foreground }}
          >
            Get In Touch
          </Text>
          <Text 
            className="text-sm mb-4" 
            style={{ color: colors.muted }}
          >
            Feel free to contact and reach us!
          </Text>

          {/* Phone */}
          <Pressable
            onPress={handleCall}
            style={({ pressed }) => [
              { 
                flexDirection: "row", 
                alignItems: "center", 
                padding: 16, 
                borderRadius: 12,
                marginBottom: 12,
                backgroundColor: colors.surface,
              },
              pressed && { opacity: 0.8 }
            ]}
          >
            <View 
              className="w-12 h-12 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: colors.primary }}
            >
              <IconSymbol name="phone.fill" size={20} color="white" />
            </View>
            <View>
              <Text className="text-sm" style={{ color: colors.muted }}>Phone</Text>
              <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                +01 (123) 4567 90
              </Text>
            </View>
          </Pressable>

          {/* Email */}
          <Pressable
            onPress={handleEmail}
            style={({ pressed }) => [
              { 
                flexDirection: "row", 
                alignItems: "center", 
                padding: 16, 
                borderRadius: 12,
                marginBottom: 12,
                backgroundColor: colors.surface,
              },
              pressed && { opacity: 0.8 }
            ]}
          >
            <View 
              className="w-12 h-12 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: colors.primary }}
            >
              <IconSymbol name="envelope.fill" size={20} color="white" />
            </View>
            <View>
              <Text className="text-sm" style={{ color: colors.muted }}>Email</Text>
              <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                info@tourly.com
              </Text>
            </View>
          </Pressable>

          {/* Address */}
          <View 
            className="flex-row items-center p-4 rounded-xl"
            style={{ backgroundColor: colors.surface }}
          >
            <View 
              className="w-12 h-12 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: colors.primary }}
            >
              <IconSymbol name="location.fill" size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-sm" style={{ color: colors.muted }}>Address</Text>
              <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                3146 Koontz, California
              </Text>
            </View>
          </View>
        </View>

        {/* Newsletter Section */}
        <View 
          className="rounded-2xl p-6 mb-8"
          style={{ backgroundColor: colors.surface }}
        >
          <Text 
            className="text-lg font-bold mb-2" 
            style={{ color: colors.foreground }}
          >
            Newsletter
          </Text>
          <Text 
            className="text-sm mb-4" 
            style={{ color: colors.muted }}
          >
            Subscribe to our newsletter for more updates and news!
          </Text>

          <View className="flex-row gap-3">
            <TextInput
              placeholder="Enter Your Email"
              placeholderTextColor={colors.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="flex-1 bg-white rounded-full px-4 py-3"
              style={{ color: colors.foreground }}
            />
            <Pressable
              onPress={handleSubscribe}
              style={({ pressed }) => [
                { 
                  backgroundColor: colors.primary, 
                  paddingHorizontal: 20, 
                  paddingVertical: 12, 
                  borderRadius: 50,
                  justifyContent: "center",
                },
                pressed && { opacity: 0.9 }
              ]}
            >
              <Text className="text-white font-semibold">Subscribe</Text>
            </Pressable>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center pb-8">
          <Text className="text-sm" style={{ color: colors.muted }}>
            © 2024 Tourly. All rights reserved
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
