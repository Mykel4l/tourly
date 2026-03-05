import { Text, View, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { packages } from "@/data/packages";
import { useWishlist } from "@/lib/store";
import { useTranslation } from "@/lib/i18n";
import { useCurrency } from "@/lib/currency";
import { TopNavBar } from "@/components/top-nav-bar";
import { StarRating } from "@/components/star-rating";
import { useReviews } from "@/lib/reviews";
import { ShareSheet } from "@/components/share-sheet";

export default function PackageDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { toggle, isSaved } = useWishlist();
  const { t } = useTranslation();
  const { format } = useCurrency();
  const { getReviewsFor, getAverageRating } = useReviews();

  const pkg = packages.find(p => p.id === id);
  const saved = pkg ? isSaved(pkg.id, "package") : false;
  const pkgReviews = pkg ? getReviewsFor(pkg.id, "package") : [];
  const { average: avgRating, count: reviewCount } = pkg
    ? getAverageRating(pkg.id, "package")
    : { average: 0, count: 0 };

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
    if (!pkg) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    toggle({
      id: pkg.id,
      type: "package",
      name: pkg.title,
      image: pkg.image,
      subtitle: `${format(pkg.price)} ${t.perPerson}`,
    });
  };

  const handleBookNow = () => {
    if (!pkg) return;
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    router.push({
      pathname: "/booking",
      params: { packageName: pkg.title, price: pkg.price.toString() }
    });
  };

  if (!pkg) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <Text style={{ color: colors.foreground }}>{t.packageNotFound}</Text>
        <Pressable onPress={handleBack} className="mt-4">
          <Text style={{ color: colors.primary }}>{t.goBack}</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  const inclusions = [
    t.inclusionAirfare,
    t.inclusionTransfers,
    t.inclusionAccommodation,
    t.inclusionBreakfast,
    t.inclusionGuidedTours,
    t.inclusionInsurance,
    t.inclusionSupport,
  ];

  const itinerary = [
    { day: 1, title: t.itineraryDay1Title, description: t.itineraryDay1Desc },
    { day: 2, title: t.itineraryDay2Title, description: t.itineraryDay2Desc },
    { day: 3, title: t.itineraryDay3Title, description: t.itineraryDay3Desc },
    { day: 4, title: t.itineraryDay4Title, description: t.itineraryDay4Desc },
    { day: 5, title: t.itineraryDay5Title, description: t.itineraryDay5Desc },
    { day: 6, title: t.itineraryDay6Title, description: t.itineraryDay6Desc },
    { day: 7, title: t.itineraryDay7Title, description: t.itineraryDay7Desc },
  ];

  return (
    <ScreenContainer edges={["left", "right"]}>
      <TopNavBar
        showBack
        title={pkg.title}
        rightContent={
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <ShareSheet content={{
              title: pkg.title,
              message: `${t.sharePackage}: "${pkg.title}" | Tourly — ${format(pkg.price)}${t.perPersonShort}`,
              url: `https://tourly.app/package/${pkg.id}`,
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
            source={pkg.image}
            style={{ width: "100%", height: 300 }}
            contentFit="cover"
          />
        </View>

        {/* Content */}
        <View className="px-4 pt-6">
          {/* Title & Price */}
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1 pr-4">
              <Text 
                className="text-2xl font-bold" 
                style={{ color: colors.foreground }}
              >
                {pkg.title}
              </Text>
            </View>
            <View className="items-end">
              <Text 
                className="text-2xl font-bold" 
                style={{ color: colors.primary }}
              >
                {format(pkg.price)}
              </Text>
              <Text className="text-xs" style={{ color: colors.muted }}>{t.perPersonShort}</Text>
            </View>
          </View>

          {/* Meta Info */}
          <View 
            className="flex-row rounded-xl p-4 mb-6"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="flex-1 items-center">
              <IconSymbol name="clock.fill" size={20} color={colors.primary} />
              <Text className="text-xs mt-1" style={{ color: colors.muted }}>{t.durationLabel}</Text>
              <Text className="text-sm font-semibold" style={{ color: colors.foreground }}>{pkg.duration}</Text>
            </View>
            <View className="flex-1 items-center">
              <IconSymbol name="person.2.fill" size={20} color={colors.primary} />
              <Text className="text-xs mt-1" style={{ color: colors.muted }}>{t.maxPax}</Text>
              <Text className="text-sm font-semibold" style={{ color: colors.foreground }}>{pkg.maxPax}</Text>
            </View>
            <View className="flex-1 items-center">
              <IconSymbol name="location.fill" size={20} color={colors.primary} />
              <Text className="text-xs mt-1" style={{ color: colors.muted }}>{t.locationLabel}</Text>
              <Text className="text-sm font-semibold" style={{ color: colors.foreground }}>{pkg.location}</Text>
            </View>
            <View className="flex-1 items-center">
              <IconSymbol name="star.fill" size={20} color={colors.primary} />
              <Text className="text-xs mt-1" style={{ color: colors.muted }}>{t.ratingLabel}</Text>
              <Text className="text-sm font-semibold" style={{ color: colors.foreground }}>{pkg.rating}/5</Text>
            </View>
          </View>

          {/* Reviews */}
          <View className="flex-row items-center mb-2">
            <StarRating rating={avgRating || pkg.rating} size={16} />
            <Text className="ml-2 text-sm" style={{ color: colors.muted }}>
            {(avgRating || pkg.rating).toFixed(1)} ({reviewCount || pkg.reviews} {t.reviewsLabel})
            </Text>
          </View>

          {/* User Reviews */}
          {pkgReviews.length > 0 && (
            <View className="mb-6">
              {pkgReviews.slice(0, 3).map((review) => (
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
              ))}
            </View>
          )}

          {/* Description */}
          <View className="mb-6">
            <Text 
              className="text-lg font-bold mb-3" 
              style={{ color: colors.foreground }}
            >
              {t.aboutThisPackage}
            </Text>
            <Text 
              className="text-base leading-relaxed" 
              style={{ color: colors.muted }}
            >
              {pkg.description} {t.packageDetailExtended}
            </Text>
          </View>

          {/* What's Included */}
          <View className="mb-6">
            <Text 
              className="text-lg font-bold mb-3" 
              style={{ color: colors.foreground }}
            >
              {t.whatsIncluded}
            </Text>
            {inclusions.map((item, index) => (
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

          {/* Itinerary */}
          <View className="mb-6">
            <Text 
              className="text-lg font-bold mb-3" 
              style={{ color: colors.foreground }}
            >
              {t.sampleItinerary}
            </Text>
            {itinerary.map((day, index) => (
              <View 
                key={index} 
                className="flex-row mb-3"
              >
                <View 
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-white font-bold">{day.day}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                    {day.title}
                  </Text>
                  <Text className="text-sm" style={{ color: colors.muted }}>
                    {day.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* CTA Row */}
          <View style={{ flexDirection: "row", gap: 12, marginBottom: Math.max(insets.bottom + 16, 32) }}>
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
              <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
                {t.bookNow} — {format(pkg.price)}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
