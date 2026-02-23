import { Text, View, ScrollView, Pressable, Alert, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/lib/i18n";
import { useCurrency } from "@/lib/currency";
import { TopNavBar } from "@/components/top-nav-bar";
import { usePremium, PREMIUM_PLANS, type PremiumTier } from "@/lib/premium";

const FEATURE_ICONS: Record<string, string> = {
  exclusiveDeals: "tag.fill",
  prioritySupport: "headphones",
  freeCancellation: "xmark.circle.fill",
  aiTripPlanner: "sparkles",
  adFree: "eye.slash.fill",
  conciergeService: "person.crop.circle.badge.checkmark",
  loungeAccess: "airplane",
  doublePoints: "star.fill",
};

export default function PremiumScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { format } = useCurrency();
  const { tier, planId, subscribe } = usePremium();

  const featureLabel = (key: string): string => {
    const map: Record<string, string> = {
      exclusiveDeals: t.premiumFeatureDeals,
      prioritySupport: t.premiumFeatureSupport,
      freeCancellation: t.premiumFeatureCancellation,
      aiTripPlanner: t.premiumFeatureAI,
      adFree: t.premiumFeatureAdFree,
      conciergeService: t.premiumFeatureConcierge,
      loungeAccess: t.premiumFeatureLounge,
      doublePoints: t.premiumFeatureDoublePoints,
    };
    return map[key] || key;
  };

  const handleSubscribe = (selectedTier: PremiumTier, selectedPlanId: string) => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    subscribe(selectedTier, selectedPlanId);
    Alert.alert("🎉", `${t.premiumSubscribe}!`);
  };

  const proPlans = PREMIUM_PLANS.filter(p => p.tier === "pro");
  const elitePlans = PREMIUM_PLANS.filter(p => p.tier === "elite");

  return (
    <ScreenContainer className="px-4" edges={["left", "right"]}>
      <TopNavBar title={t.premiumTitle} showBack />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8 }}>

        {/* Hero */}
        <View
          style={{
            backgroundColor: colors.primary,
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
            <IconSymbol name="crown.fill" size={36} color="white" />
          </View>
          <Text style={{ color: "white", fontSize: 26, fontWeight: "800", marginBottom: 8 }}>
            {t.premiumTitle}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, textAlign: "center" }}>
            {t.premiumSubtitle}
          </Text>
          {tier !== "free" && (
            <View style={{ marginTop: 16, backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 }}>
              <Text style={{ color: "white", fontWeight: "700", fontSize: 13 }}>
                {t.premiumCurrentPlan}: {tier === "pro" ? t.premiumProTitle : t.premiumEliteTitle}
              </Text>
            </View>
          )}
        </View>

        {/* Pro Plans */}
        <Text style={{ color: colors.foreground, fontSize: 20, fontWeight: "700", marginBottom: 12 }}>
          {t.premiumProTitle}
        </Text>
        {proPlans.map((plan) => {
          const isActive = planId === plan.id;
          return (
            <Pressable
              key={plan.id}
              onPress={() => !isActive && handleSubscribe("pro", plan.id)}
              style={({ pressed }) => [
                {
                  backgroundColor: isActive ? colors.primary + "12" : colors.surface,
                  borderRadius: 20,
                  padding: 20,
                  marginBottom: 12,
                  borderWidth: isActive ? 2 : 1,
                  borderColor: isActive ? colors.primary : colors.border,
                },
                pressed && !isActive && { opacity: 0.9 },
              ]}
            >
              {plan.savings && (
                <View style={{ position: "absolute", top: -10, right: 16, backgroundColor: colors.success, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
                  <Text style={{ color: "white", fontSize: 11, fontWeight: "700" }}>
                    {t.premiumSavePercent} {plan.savings}
                  </Text>
                </View>
              )}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <Text style={{ color: colors.foreground, fontSize: 17, fontWeight: "700" }}>
                  {plan.period === "month" ? `${t.premiumProTitle} ${t.premiumPerMonth.replace("/", "")}` : `${t.premiumProTitle} ${t.premiumPerYear.replace("/", "")}`}
                </Text>
                <Text style={{ color: colors.primary, fontSize: 22, fontWeight: "800" }}>
                  {format(plan.price)}{plan.period === "month" ? t.premiumPerMonth : t.premiumPerYear}
                </Text>
              </View>
              {plan.features.map((feat) => (
                <View key={feat} style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                  <IconSymbol name={(FEATURE_ICONS[feat] || "checkmark.circle.fill") as any} size={16} color={colors.primary} />
                  <Text style={{ color: colors.muted, fontSize: 14, marginLeft: 8 }}>{featureLabel(feat)}</Text>
                </View>
              ))}
              {isActive && (
                <Text style={{ color: colors.primary, fontWeight: "700", marginTop: 8, textAlign: "center" }}>
                  ✓ {t.premiumCurrentPlan}
                </Text>
              )}
            </Pressable>
          );
        })}

        {/* Elite Plans */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8, marginBottom: 12 }}>
          <Text style={{ color: colors.foreground, fontSize: 20, fontWeight: "700" }}>
            {t.premiumEliteTitle}
          </Text>
          <View style={{ backgroundColor: "#F59E0B", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 }}>
            <Text style={{ color: "white", fontSize: 11, fontWeight: "700" }}>{t.premiumBestValue}</Text>
          </View>
        </View>
        {elitePlans.map((plan) => {
          const isActive = planId === plan.id;
          return (
            <Pressable
              key={plan.id}
              onPress={() => !isActive && handleSubscribe("elite", plan.id)}
              style={({ pressed }) => [
                {
                  backgroundColor: isActive ? "#F59E0B" + "12" : colors.surface,
                  borderRadius: 20,
                  padding: 20,
                  marginBottom: 12,
                  borderWidth: isActive ? 2 : 1,
                  borderColor: isActive ? "#F59E0B" : colors.border,
                },
                pressed && !isActive && { opacity: 0.9 },
              ]}
            >
              {plan.savings && (
                <View style={{ position: "absolute", top: -10, right: 16, backgroundColor: "#F59E0B", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
                  <Text style={{ color: "white", fontSize: 11, fontWeight: "700" }}>
                    {t.premiumSavePercent} {plan.savings}
                  </Text>
                </View>
              )}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <Text style={{ color: colors.foreground, fontSize: 17, fontWeight: "700" }}>
                  {t.premiumEliteTitle} {t.premiumPerYear.replace("/", "")}
                </Text>
                <Text style={{ color: "#F59E0B", fontSize: 22, fontWeight: "800" }}>
                  {format(plan.price)}{t.premiumPerYear}
                </Text>
              </View>
              {plan.features.map((feat) => (
                <View key={feat} style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                  <IconSymbol name={(FEATURE_ICONS[feat] || "checkmark.circle.fill") as any} size={16} color="#F59E0B" />
                  <Text style={{ color: colors.muted, fontSize: 14, marginLeft: 8 }}>{featureLabel(feat)}</Text>
                </View>
              ))}
              {isActive && (
                <Text style={{ color: "#F59E0B", fontWeight: "700", marginTop: 8, textAlign: "center" }}>
                  ✓ {t.premiumCurrentPlan}
                </Text>
              )}
            </Pressable>
          );
        })}

        {/* Restore link */}
        <Pressable
          onPress={() => Alert.alert(t.premiumRestore, "No previous purchases found.")}
          style={{ alignItems: "center", paddingVertical: 16, marginBottom: Math.max(insets.bottom, 24) }}
        >
          <Text style={{ color: colors.muted, fontSize: 14 }}>{t.premiumRestore}</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}
