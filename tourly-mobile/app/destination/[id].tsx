import { Text, View, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { destinations } from "@/data/destinations";
import { useWishlist } from "@/lib/store";
import { useTranslation } from "@/lib/i18n";
import { TopNavBar } from "@/components/top-nav-bar";
import { StarRating } from "@/components/star-rating";
import { useReviews } from "@/lib/reviews";
import { ShareSheet } from "@/components/share-sheet";

export default function DestinationDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { toggle, isSaved } = useWishlist();
  const { t } = useTranslation();
  const { getReviewsFor, getAverageRating } = useReviews();
  
  const destination = destinations.find(d => d.id === id);
  const saved = destination ? isSaved(destination.id, "destination") : false;
  const destReviews = destination ? getReviewsFor(destination.id, "destination") : [];
  const { average: avgRating } = destination
    ? getAverageRating(destination.id, "destination")
    : { average: 0 };

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

  const handleWishlist = () => {
    if (!destination) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    toggle({
      id: destination.id,
      type: "destination",
      name: destination.name,
      image: destination.image,
      subtitle: destination.country,
    });
  };

  const handleBookNow = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push({
      pathname: "/booking",
      params: { packageName: destination?.name }
    });
  };

  if (!destination) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <Text style={{ color: colors.foreground }}>{t.destinationNotFound}</Text>
        <Pressable onPress={handleBack} className="mt-4">
          <Text style={{ color: colors.primary }}>{t.goBack}</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  const highlights = [
    { icon: "star.fill" as const, label: t.topRated, value: `${destination.rating}/5` },
    { icon: "location.fill" as const, label: t.countryLabel, value: destination.country },
    { icon: "clock.fill" as const, label: t.bestTime, value: t.allYear },
    { icon: "person.2.fill" as const, label: t.groupSizeLabel, value: "2-15" },
  ];

  return (
    <ScreenContainer edges={["left", "right"]}>
      <TopNavBar
        showBack
        title={destination.name}
        rightContent={
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <ShareSheet content={{
              title: destination.name,
              message: `${t.shareDestination}: ${destination.name} - ${destination.country} | Tourly`,
              url: `https://tourly.app/destination/${destination.id}`,
            }}>
              {(onShare) => (
                <Pressable
                  onPress={onShare}
                  hitSlop={8}
                  style={({ pressed }) => [{ padding: 6 }, pressed && { opacity: 0.8 }]}
                >
                  <IconSymbol name="square.and.arrow.up" size={20} color={colors.foreground} />
                </Pressable>
              )}
            </ShareSheet>
            <Pressable
              onPress={handleWishlist}
              hitSlop={8}
              style={({ pressed }) => [{ padding: 6 }, pressed && { opacity: 0.8 }]}
            >
              <IconSymbol
                name={saved ? "heart.fill" : "heart"}
                size={20}
                color={saved ? colors.error : colors.foreground}
              />
            </Pressable>
          </View>
        }
      />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={{ position: "relative" }}>
          <Image
            source={destination.image}
            style={{ width: "100%", height: 350 }}
            contentFit="cover"
          />
          <View 
            style={{ 
              position: "absolute", 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.2)" 
            }} 
          />

          {/* Rating Badge */}
          <View 
            style={{ 
              position: "absolute", 
              bottom: 20, 
              right: 20,
              backgroundColor: colors.primary,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            {[...Array(destination.rating)].map((_, i) => (
              <IconSymbol key={i} name="star.fill" size={14} color="white" />
            ))}
          </View>
        </View>

        {/* Content */}
        <View className="px-4 pt-6" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
          {/* Title */}
          <Text 
            className="text-sm font-semibold uppercase" 
            style={{ color: colors.primary }}
          >
            {destination.country}
          </Text>
          <Text 
            className="text-3xl font-bold mt-1 mb-4" 
            style={{ color: colors.foreground }}
          >
            {destination.name}
          </Text>

          {/* Highlights */}
          <View
            style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 24 }}
          >
            {highlights.map((item, index) => (
              <View key={index} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}>
                <View
                  style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginRight: 12, backgroundColor: colors.primary + "20" }}
                >
                  <IconSymbol name={item.icon} size={18} color={colors.primary} />
                </View>
                <View>
                  <Text style={{ fontSize: 12, color: colors.muted }}>{item.label}</Text>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>{item.value}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text 
              className="text-lg font-bold mb-3" 
              style={{ color: colors.foreground }}
            >
              {t.aboutDestination}
            </Text>
            <Text 
              className="text-base leading-relaxed mb-4" 
              style={{ color: colors.muted }}
            >
              {destination.description}
            </Text>
            <Text 
              className="text-base leading-relaxed" 
              style={{ color: colors.muted }}
            >
              {t.destinationDetailDesc}
            </Text>
          </View>

          {/* What to Expect */}
          <View className="mb-6">
            <Text 
              className="text-lg font-bold mb-3" 
              style={{ color: colors.foreground }}
            >
              {t.whatToExpect}
            </Text>
            {[
              t.expectGuidedTours,
              t.expectLocalCuisine,
              t.expectAccommodations,
              t.expectTransportation,
              t.expectSupport,
            ].map((item, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <View 
                  className="w-6 h-6 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: colors.success + "20" }}
                >
                  <IconSymbol name="star.fill" size={12} color={colors.success} />
                </View>
                <Text className="text-base" style={{ color: colors.muted }}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Reviews Section */}
          <View className="mb-6">
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <Text className="text-lg font-bold" style={{ color: colors.foreground }}>
                {t.reviewsTitle}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <StarRating rating={avgRating || destination.rating} size={14} />
                <Text style={{ color: colors.muted, fontSize: 13 }}>
                  {(avgRating || destination.rating).toFixed(1)}
                </Text>
              </View>
            </View>
            {destReviews.length > 0 ? (
              destReviews.slice(0, 3).map((review) => (
                <View
                  key={review.id}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 8,
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <Text style={{ color: colors.foreground, fontWeight: "600", fontSize: 14 }}>{review.authorName}</Text>
                    <StarRating rating={review.rating} size={12} />
                  </View>
                  <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 20 }}>{review.text}</Text>
                </View>
              ))
            ) : (
              <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 20, alignItems: "center" }}>
                <Text style={{ color: colors.muted, fontSize: 14 }}>{t.noReviewsYet}</Text>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>{t.beFirstReview}</Text>
              </View>
            )}
          </View>

          {/* CTA Row */}
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 32 }}>
            <Pressable
              onPress={handleWishlist}
              style={({ pressed }) => [
                {
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  paddingVertical: 16,
                  borderRadius: 50,
                  backgroundColor: saved ? colors.error : "white",
                  borderWidth: 2,
                  borderColor: colors.error,
                  shadowColor: colors.error,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: saved ? 0.35 : 0.12,
                  shadowRadius: 6,
                  elevation: saved ? 4 : 2,
                },
                pressed && { transform: [{ scale: 0.97 }] },
              ]}
            >
              <IconSymbol
                name={saved ? "heart.fill" : "heart"}
                size={20}
                color={saved ? "white" : colors.error}
              />
              <Text style={{ fontWeight: "700", fontSize: 15, color: saved ? "white" : colors.error }}>
                {saved ? t.saved : t.save}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleBookNow}
              style={({ pressed }) => [
                {
                  flex: 2,
                  backgroundColor: colors.primary,
                  paddingVertical: 16,
                  borderRadius: 50,
                  alignItems: "center",
                },
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              ]}
            >
              <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>{t.bookThisDestination}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
