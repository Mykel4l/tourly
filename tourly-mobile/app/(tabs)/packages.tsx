import { Text, View, FlatList, Pressable } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { packages, TravelPackage } from "@/data/packages";

export default function PackagesScreen() {
  const colors = useColors();

  const handleCardPress = (item: TravelPackage) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/package/${item.id}`);
  };

  const handleBook = (item: TravelPackage) => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    router.push({
      pathname: "/booking",
      params: { packageName: item.title, price: item.price.toString() }
    });
  };

  const renderPackage = ({ item }: { item: TravelPackage }) => (
    <Pressable
      onPress={() => handleCardPress(item)}
      style={({ pressed }) => [
        pressed && { opacity: 0.95 }
      ]}
    >
      <View 
        className="rounded-2xl mb-4 overflow-hidden shadow-sm"
        style={{ backgroundColor: colors.surface }}
      >
        <Image
          source={item.image}
          style={{ width: "100%", height: 200 }}
          contentFit="cover"
        />
        <View className="p-4">
          <Text 
            className="text-lg font-bold mb-2" 
            style={{ color: colors.foreground }}
          >
            {item.title}
          </Text>
          <Text 
            className="text-sm mb-3" 
            style={{ color: colors.muted }}
            numberOfLines={2}
          >
            {item.description}
          </Text>
          
          {/* Meta Info */}
          <View className="flex-row flex-wrap gap-4 mb-4">
            <View className="flex-row items-center gap-1">
              <IconSymbol name="clock.fill" size={16} color={colors.muted} />
              <Text className="text-sm" style={{ color: colors.muted }}>
                {item.duration}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <IconSymbol name="person.2.fill" size={16} color={colors.muted} />
              <Text className="text-sm" style={{ color: colors.muted }}>
                pax: {item.maxPax}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <IconSymbol name="location.fill" size={16} color={colors.muted} />
              <Text className="text-sm" style={{ color: colors.muted }}>
                {item.location}
              </Text>
            </View>
          </View>

          {/* Price and Rating Section */}
          <View 
            className="flex-row items-center justify-between pt-4 border-t"
            style={{ borderTopColor: colors.border }}
          >
            <View>
              <View className="flex-row items-center gap-2 mb-1">
                <Text className="text-xs" style={{ color: colors.muted }}>
                  ({item.reviews} reviews)
                </Text>
                <View className="flex-row">
                  {[...Array(item.rating)].map((_, i) => (
                    <IconSymbol key={i} name="star.fill" size={12} color={colors.primary} />
                  ))}
                </View>
              </View>
              <Text className="text-2xl font-bold" style={{ color: colors.foreground }}>
                ${item.price}
                <Text className="text-sm font-normal" style={{ color: colors.muted }}>
                  {" "}/ per person
                </Text>
              </Text>
            </View>
            
            <Pressable
              onPress={() => handleBook(item)}
              style={({ pressed }) => [
                { 
                  backgroundColor: colors.primary, 
                  paddingHorizontal: 20, 
                  paddingVertical: 12, 
                  borderRadius: 50 
                },
                pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }
              ]}
            >
              <Text className="text-white font-semibold">Book Now</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="px-4">
      <View className="pt-4 pb-2">
        <Text 
          className="text-sm font-semibold uppercase" 
          style={{ color: colors.primary }}
        >
          Popular Packages
        </Text>
        <Text 
          className="text-2xl font-bold mt-1" 
          style={{ color: colors.foreground }}
        >
          Checkout Our Packages
        </Text>
        <Text 
          className="text-sm mt-2" 
          style={{ color: colors.muted }}
        >
          Find the perfect travel package for your next adventure with competitive prices.
        </Text>
      </View>

      <FlatList
        data={packages}
        renderItem={renderPackage}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
      />
    </ScreenContainer>
  );
}
