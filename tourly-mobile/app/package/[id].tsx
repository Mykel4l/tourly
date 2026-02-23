import { Text, View, ScrollView, Pressable, Dimensions } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { packages } from "@/data/packages";

const { width } = Dimensions.get("window");

export default function PackageDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const pkg = packages.find(p => p.id === id);

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

  const handleBookNow = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    router.push({
      pathname: "/booking",
      params: { packageName: pkg?.title, price: pkg?.price.toString() }
    });
  };

  if (!pkg) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <Text style={{ color: colors.foreground }}>Package not found</Text>
        <Pressable onPress={handleBack} className="mt-4">
          <Text style={{ color: colors.primary }}>Go Back</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  const inclusions = [
    "Round-trip airfare",
    "Airport transfers",
    "Accommodation (4-star hotel)",
    "Daily breakfast",
    "Guided tours",
    "Travel insurance",
    "24/7 support",
  ];

  const itinerary = [
    { day: 1, title: "Arrival & Welcome", description: "Airport pickup, hotel check-in, welcome dinner" },
    { day: 2, title: "City Exploration", description: "Guided city tour, local markets, cultural sites" },
    { day: 3, title: "Adventure Day", description: "Outdoor activities, nature excursions" },
    { day: 4, title: "Cultural Experience", description: "Traditional workshops, local cuisine" },
    { day: 5, title: "Free Day", description: "Optional activities or relaxation" },
    { day: 6, title: "Scenic Tour", description: "Day trip to nearby attractions" },
    { day: 7, title: "Departure", description: "Breakfast, checkout, airport transfer" },
  ];

  return (
    <ScreenContainer edges={["left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={{ position: "relative" }}>
          <Image
            source={pkg.image}
            style={{ width: width, height: 300 }}
            contentFit="cover"
          />
          
          {/* Back Button */}
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [
              { 
                position: "absolute", 
                top: 50, 
                left: 16, 
                backgroundColor: "rgba(255,255,255,0.9)",
                padding: 10,
                borderRadius: 50,
              },
              pressed && { opacity: 0.8 }
            ]}
          >
            <IconSymbol name="chevron.right" size={20} color={colors.foreground} style={{ transform: [{ rotate: '180deg' }] }} />
          </Pressable>
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
                ${pkg.price}
              </Text>
              <Text className="text-xs" style={{ color: colors.muted }}>per person</Text>
            </View>
          </View>

          {/* Meta Info */}
          <View 
            className="flex-row rounded-xl p-4 mb-6"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="flex-1 items-center">
              <IconSymbol name="clock.fill" size={20} color={colors.primary} />
              <Text className="text-xs mt-1" style={{ color: colors.muted }}>Duration</Text>
              <Text className="text-sm font-semibold" style={{ color: colors.foreground }}>{pkg.duration}</Text>
            </View>
            <View className="flex-1 items-center">
              <IconSymbol name="person.2.fill" size={20} color={colors.primary} />
              <Text className="text-xs mt-1" style={{ color: colors.muted }}>Max Pax</Text>
              <Text className="text-sm font-semibold" style={{ color: colors.foreground }}>{pkg.maxPax}</Text>
            </View>
            <View className="flex-1 items-center">
              <IconSymbol name="location.fill" size={20} color={colors.primary} />
              <Text className="text-xs mt-1" style={{ color: colors.muted }}>Location</Text>
              <Text className="text-sm font-semibold" style={{ color: colors.foreground }}>{pkg.location}</Text>
            </View>
            <View className="flex-1 items-center">
              <IconSymbol name="star.fill" size={20} color={colors.primary} />
              <Text className="text-xs mt-1" style={{ color: colors.muted }}>Rating</Text>
              <Text className="text-sm font-semibold" style={{ color: colors.foreground }}>{pkg.rating}/5</Text>
            </View>
          </View>

          {/* Reviews */}
          <View className="flex-row items-center mb-6">
            <View className="flex-row">
              {[...Array(pkg.rating)].map((_, i) => (
                <IconSymbol key={i} name="star.fill" size={16} color={colors.primary} />
              ))}
            </View>
            <Text className="ml-2 text-sm" style={{ color: colors.muted }}>
              ({pkg.reviews} reviews)
            </Text>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text 
              className="text-lg font-bold mb-3" 
              style={{ color: colors.foreground }}
            >
              About This Package
            </Text>
            <Text 
              className="text-base leading-relaxed" 
              style={{ color: colors.muted }}
            >
              {pkg.description} Experience an unforgettable journey with our carefully curated 
              travel package. Every detail has been planned to ensure you have the trip of a 
              lifetime, from comfortable accommodations to exciting activities and authentic 
              local experiences.
            </Text>
          </View>

          {/* What's Included */}
          <View className="mb-6">
            <Text 
              className="text-lg font-bold mb-3" 
              style={{ color: colors.foreground }}
            >
              What's Included
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
              Sample Itinerary
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

          {/* Book Now Button */}
          <Pressable
            onPress={handleBookNow}
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
            <Text className="text-white font-bold text-lg">Book Now - ${pkg.price}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
