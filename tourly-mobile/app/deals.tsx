import { Text, View, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useState, useEffect } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { packages } from "@/data/packages";
import { useTranslation } from "@/lib/i18n";
import { useCurrency } from "@/lib/currency";
import { TopNavBar } from "@/components/top-nav-bar";

interface Deal {
  id: string;
  title: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  expiresAt: Date;
  packageId: string;
  image: any;
  tag: number;
}

const DEALS: Deal[] = packages.map((pkg, i) => ({
  id: `deal-${pkg.id}`,
  title: pkg.title,
  originalPrice: Math.round(pkg.price * (1 + [0.3, 0.25, 0.2][i % 3])),
  salePrice: pkg.price,
  discount: [30, 25, 20][i % 3],
  expiresAt: new Date(Date.now() + [2, 5, 1][i % 3] * 24 * 60 * 60 * 1000),
  packageId: pkg.id,
  image: pkg.image,
  tag: [0, 1, 2][i % 3],
}));

function useCountdown(target: Date) {
  const [remaining, setRemaining] = useState(target.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(target.getTime() - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [target]);
  const total = Math.max(0, remaining);
  const h = Math.floor(total / 3600000);
  const m = Math.floor((total % 3600000) / 60000);
  const s = Math.floor((total % 60000) / 1000);
  return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}

function DealCard({ deal }: { deal: Deal }) {
  const colors = useColors();
  const { t } = useTranslation();
  const { format } = useCurrency();
  const countdown = useCountdown(deal.expiresAt);
  const tagLabels = [t.tagFlashSale, t.tagWeekendDeal, t.tagLimitedOffer];

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/package/${deal.packageId}`);
      }}
      style={({ pressed }) => [
        {
          backgroundColor: colors.surface,
          borderRadius: 20,
          overflow: "hidden",
          marginBottom: 16,
        },
        pressed && { opacity: 0.95 },
      ]}
    >
      <View style={{ position: "relative" }}>
        <Image
          source={deal.image}
          style={{ width: "100%", height: 180 }}
          contentFit="cover"
        />
        {/* Discount badge */}
        <View
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            backgroundColor: colors.error,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 50,
          }}
        >
          <Text style={{ color: "white", fontWeight: "800", fontSize: 13 }}>
            -{deal.discount}%
          </Text>
        </View>
        {/* Tag */}
        <View
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            backgroundColor: colors.primary,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 50,
          }}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: 11 }}>{tagLabels[deal.tag]}</Text>
        </View>
      </View>

      <View style={{ padding: 16 }}>
        <Text
          style={{ color: colors.foreground, fontSize: 15, fontWeight: "700", marginBottom: 8 }}
          numberOfLines={2}
        >
          {deal.title}
        </Text>

        {/* Price row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              color: colors.muted,
              fontSize: 14,
              textDecorationLine: "line-through",
              marginRight: 10,
            }}
          >
            ${format(deal.originalPrice)}
          </Text>
          <Text style={{ color: colors.primary, fontSize: 22, fontWeight: "800" }}>
            {format(deal.salePrice)}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 12, marginLeft: 4 }}>{t.perPersonShort}</Text>
        </View>

        {/* Timer */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.warning + "14",
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 8,
            marginBottom: 12,
          }}
        >
          <IconSymbol name="clock.fill" size={14} color={colors.warning} />
          <Text
            style={{
              color: colors.warning,
              fontSize: 13,
              fontWeight: "700",
              marginLeft: 6,
            }}
          >
            {t.endsIn} {countdown}
          </Text>
        </View>

        <Pressable
          onPress={() => {
            if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.push({
              pathname: "/booking",
              params: { packageName: deal.title, price: deal.salePrice.toString() },
            });
          }}
          style={({ pressed }) => [
            {
              backgroundColor: colors.primary,
              paddingVertical: 12,
              borderRadius: 50,
              alignItems: "center",
            },
            pressed && { opacity: 0.9 },
          ]}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>
            {t.bookAt} {format(deal.salePrice)}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

export default function DealsScreen() {
  const colors = useColors();
  const { t } = useTranslation();

  return (
    <ScreenContainer className="px-4" edges={["left", "right"]}>
      <TopNavBar title={t.dealsTitle} showBack />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View
          style={{
            backgroundColor: colors.error,
            borderRadius: 20,
            padding: 20,
            marginTop: 16,
            marginBottom: 24,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: "white", fontSize: 20, fontWeight: "800", marginBottom: 4 }}>
            {t.flashDeals}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>
            {t.flashDealsSubtitle}
            </Text>
          </View>
          <IconSymbol name="tag.fill" size={40} color="rgba(255,255,255,0.3)" />
        </View>

        {DEALS.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}
