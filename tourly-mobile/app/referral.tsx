import { Text, View, ScrollView, Pressable, Alert, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { useState } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/lib/i18n";
import { TopNavBar } from "@/components/top-nav-bar";
import { useLoyalty } from "@/lib/loyalty";

export default function ReferralScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const { referralCode, referrals } = useLoyalty();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const shareText = `${t.referralShareText}${referralCode}`;
    Alert.alert(t.share, shareText);
  };

  const steps = [
    { icon: "square.and.arrow.up" as const, text: t.referralStep1 },
    { icon: "person.badge.plus" as const, text: t.referralStep2 },
    { icon: "gift.fill" as const, text: t.referralStep3 },
  ];

  return (
    <ScreenContainer className="px-4" edges={["left", "right"]}>
      <TopNavBar title={t.referralTitle} showBack />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8 }}>

        {/* Hero */}
        <View
          style={{
            backgroundColor: "#6366F1",
            borderRadius: 24,
            padding: 28,
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: "rgba(255,255,255,0.2)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <IconSymbol name="gift.fill" size={36} color="white" />
          </View>
          <Text style={{ color: "white", fontSize: 24, fontWeight: "800", marginBottom: 8, textAlign: "center" }}>
            {t.referralTitle}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, textAlign: "center" }}>
            {t.referralSubtitle}
          </Text>
        </View>

        {/* Referral Code */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Text style={{ color: colors.muted, fontSize: 13, marginBottom: 8 }}>
            {t.referralCode}
          </Text>
          <View
            style={{
              backgroundColor: colors.background,
              borderRadius: 12,
              paddingHorizontal: 24,
              paddingVertical: 14,
              borderWidth: 2,
              borderColor: colors.primary + "30",
              borderStyle: "dashed",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: colors.foreground,
                fontSize: 24,
                fontWeight: "800",
                letterSpacing: 3,
              }}
            >
              {referralCode}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Pressable
              onPress={handleCopy}
              style={({ pressed }) => [
                {
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  backgroundColor: copied ? colors.success : colors.primary,
                  paddingVertical: 12,
                  borderRadius: 50,
                },
                pressed && { opacity: 0.9 },
              ]}
            >
              <IconSymbol name={copied ? "checkmark" : "doc.on.doc"} size={16} color="white" />
              <Text style={{ color: "white", fontWeight: "600", fontSize: 14 }}>
                {copied ? t.referralCopied : t.referralCopyCode}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [
                {
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  borderWidth: 2,
                  borderColor: colors.primary,
                  paddingVertical: 12,
                  borderRadius: 50,
                },
                pressed && { opacity: 0.9 },
              ]}
            >
              <IconSymbol name="square.and.arrow.up" size={16} color={colors.primary} />
              <Text style={{ color: colors.primary, fontWeight: "600", fontSize: 14 }}>
                {t.share}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Stats */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
            flexDirection: "row",
            marginBottom: 24,
          }}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ color: colors.foreground, fontSize: 28, fontWeight: "800" }}>
              {referrals}
            </Text>
            <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>
              {t.referralFriendsJoined}
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: colors.border, marginHorizontal: 16 }} />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ color: colors.primary, fontSize: 28, fontWeight: "800" }}>
              {referrals * 500}
            </Text>
            <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>
              {t.loyaltyPoints} {t.loyaltyEarnPoints.toLowerCase()} 
            </Text>
          </View>
        </View>

        {/* How It Works */}
        <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "700", marginBottom: 16 }}>
          {t.referralHowItWorks}
        </Text>
        {steps.map((step, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 16,
              marginBottom: 10,
              gap: 14,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "#6366F1" + "18",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#6366F1", fontWeight: "800", fontSize: 18 }}>{i + 1}</Text>
            </View>
            <Text style={{ flex: 1, color: colors.foreground, fontSize: 15, fontWeight: "500" }}>
              {step.text}
            </Text>
          </View>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenContainer>
  );
}
