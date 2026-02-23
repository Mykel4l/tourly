import { Text, View, FlatList, Pressable, Dimensions } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { destinations, Destination } from "@/data/destinations";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

export default function DestinationsScreen() {
  const colors = useColors();

  const handlePress = (item: Destination) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/destination/${item.id}`);
  };

  const renderDestination = ({ item }: { item: Destination }) => (
    <Pressable
      onPress={() => handlePress(item)}
      style={({ pressed }) => [
        { 
          width: cardWidth, 
          height: 260, 
          borderRadius: 20, 
          overflow: "hidden",
          marginBottom: 16,
        },
        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
      ]}
    >
      <Image
        source={item.image}
        style={{ width: "100%", height: "100%" }}
        contentFit="cover"
      />
      <View 
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
      />
      <View className="absolute bottom-3 left-3 right-3 bg-white rounded-xl p-3">
        <View 
          className="absolute -top-3 right-3 flex-row items-center px-2 py-1 rounded-full"
          style={{ backgroundColor: colors.primary }}
        >
          {[...Array(item.rating)].map((_, i) => (
            <IconSymbol key={i} name="star.fill" size={10} color="white" />
          ))}
        </View>
        <Text 
          className="text-xs uppercase font-medium" 
          style={{ color: colors.primary }}
        >
          {item.country}
        </Text>
        <Text 
          className="text-base font-bold mt-0.5" 
          style={{ color: colors.foreground }}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text 
          className="text-xs mt-1" 
          style={{ color: colors.muted }}
          numberOfLines={2}
        >
          {item.description}
        </Text>
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
          Uncover Place
        </Text>
        <Text 
          className="text-2xl font-bold mt-1" 
          style={{ color: colors.foreground }}
        >
          Popular Destinations
        </Text>
        <Text 
          className="text-sm mt-2" 
          style={{ color: colors.muted }}
        >
          Explore our most visited destinations around the world and find your next adventure.
        </Text>
      </View>

      <FlatList
        data={destinations}
        renderItem={renderDestination}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
      />
    </ScreenContainer>
  );
}
