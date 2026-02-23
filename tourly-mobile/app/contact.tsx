import { Text, View, ScrollView, Pressable, TextInput, Linking, Platform } from "react-native";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/lib/i18n";
import { TopNavBar } from "@/components/top-nav-bar";

export default function ContactScreen() {
  const colors = useColors();
  const { t } = useTranslation();
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

  return (
    <ScreenContainer className="px-4" edges={["left", "right"]}>
      <TopNavBar title={t.contactUs} showBack />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8 }}>

        {/* CTA Section */}
        <View 
          className="rounded-2xl p-6 mb-6"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white/80 text-sm uppercase mb-2">{t.callToAction}</Text>
          <Text className="text-white text-xl font-bold mb-3">
            {t.readyForTravel}
          </Text>
          <Text className="text-white/80 text-sm">
            {t.ctaContactDescription}
          </Text>
        </View>

        {/* Contact Information */}
        <View className="mb-6">
          <Text 
            className="text-lg font-bold mb-4" 
            style={{ color: colors.foreground }}
          >
            {t.getInTouch}
          </Text>
          <Text 
            className="text-sm mb-4" 
            style={{ color: colors.muted }}
          >
            {t.feelFreeContact}
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
              <Text className="text-sm" style={{ color: colors.muted }}>{t.phone}</Text>
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
              <Text className="text-sm" style={{ color: colors.muted }}>{t.email}</Text>
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
              <Text className="text-sm" style={{ color: colors.muted }}>{t.addressLabel}</Text>
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
            {t.newsletter}
          </Text>
          <Text 
            className="text-sm mb-4" 
            style={{ color: colors.muted }}
          >
            {t.newsletterSubtitle}
          </Text>

          <View className="flex-row gap-3">
            <TextInput
              placeholder={t.enterYourEmail}
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
              <Text className="text-white font-semibold">{t.subscribe}</Text>
            </Pressable>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center pb-8">
          <Text className="text-sm" style={{ color: colors.muted }}>
            {t.footerCopyright}
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
