import { Text, View, ScrollView, Pressable, Dimensions } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { destinations } from "@/data/destinations";

const { width } = Dimensions.get("window");

export default function DestinationDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const destination = destinations.find(d => d.id === id);

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
        <Text style={{ color: colors.foreground }}>Destination not found</Text>
        <Pressable onPress={handleBack} className="mt-4">
          <Text style={{ color: colors.primary }}>Go Back</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  const highlights = [
    { icon: "star.fill" as const, label: "Top Rated", value: `${destination.rating}/5` },
    { icon: "location.fill" as const, label: "Country", value: destination.country },
    { icon: "clock.fill" as const, label: "Best Time", value: "All Year" },
    { icon: "person.2.fill" as const, label: "Group Size", value: "2-15" },
  ];

  return (
    <ScreenContainer edges={["left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={{ position: "relative" }}>
          <Image
            source={destination.image}
            style={{ width: width, height: 350 }}
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
        <View className="px-4 pt-6">
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
            className="flex-row flex-wrap rounded-2xl p-4 mb-6"
            style={{ backgroundColor: colors.surface }}
          >
            {highlights.map((item, index) => (
              <View key={index} className="w-1/2 flex-row items-center py-2">
                <View 
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: colors.primary + "20" }}
                >
                  <IconSymbol name={item.icon} size={18} color={colors.primary} />
                </View>
                <View>
                  <Text className="text-xs" style={{ color: colors.muted }}>{item.label}</Text>
                  <Text className="text-sm font-semibold" style={{ color: colors.foreground }}>{item.value}</Text>
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
              About This Destination
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
              Experience the beauty and culture of {destination.name} in {destination.country}. 
              This stunning destination offers breathtaking views, rich history, and unforgettable 
              experiences for travelers of all types. Whether you're seeking adventure, relaxation, 
              or cultural immersion, {destination.name} has something special waiting for you.
            </Text>
          </View>

          {/* What to Expect */}
          <View className="mb-6">
            <Text 
              className="text-lg font-bold mb-3" 
              style={{ color: colors.foreground }}
            >
              What to Expect
            </Text>
            {[
              "Guided tours with local experts",
              "Authentic local cuisine experiences",
              "Comfortable accommodations",
              "Transportation included",
              "24/7 travel support",
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
            <Text className="text-white font-bold text-lg">Book This Destination</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
