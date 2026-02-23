import { Text, View, ScrollView, Pressable, TextInput, FlatList } from "react-native";
import { Image } from "expo-image";
import { useState, useMemo } from "react";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { destinations } from "@/data/destinations";
import { packages } from "@/data/packages";

type SearchResult = {
  id: string;
  type: "destination" | "package";
  title: string;
  subtitle: string;
  image: any;
  rating: number;
  price?: number;
};

export default function SearchScreen() {
  const colors = useColors();
  const [query, setQuery] = useState("");

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

  const handleResultPress = (result: SearchResult) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (result.type === "destination") {
      router.push(`/destination/${result.id}`);
    } else {
      router.push(`/package/${result.id}`);
    }
  };

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search destinations
    destinations.forEach(dest => {
      if (
        dest.name.toLowerCase().includes(lowerQuery) ||
        dest.country.toLowerCase().includes(lowerQuery) ||
        dest.description.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          id: dest.id,
          type: "destination",
          title: dest.name,
          subtitle: dest.country,
          image: dest.image,
          rating: dest.rating,
        });
      }
    });

    // Search packages
    packages.forEach(pkg => {
      if (
        pkg.title.toLowerCase().includes(lowerQuery) ||
        pkg.location.toLowerCase().includes(lowerQuery) ||
        pkg.description.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          id: pkg.id,
          type: "package",
          title: pkg.title,
          subtitle: `${pkg.location} • ${pkg.duration}`,
          image: pkg.image,
          rating: pkg.rating,
          price: pkg.price,
        });
      }
    });

    return results;
  }, [query]);

  const renderResult = ({ item }: { item: SearchResult }) => (
    <Pressable
      onPress={() => handleResultPress(item)}
      style={({ pressed }) => [
        { 
          flexDirection: "row", 
          padding: 12, 
          borderRadius: 16,
          marginBottom: 12,
          backgroundColor: colors.surface,
        },
        pressed && { opacity: 0.8 }
      ]}
    >
      <Image
        source={item.image}
        style={{ width: 80, height: 80, borderRadius: 12 }}
        contentFit="cover"
      />
      <View className="flex-1 ml-3 justify-center">
        <View className="flex-row items-center mb-1">
          <View 
            className="px-2 py-0.5 rounded mr-2"
            style={{ backgroundColor: item.type === "destination" ? colors.primary + "20" : colors.success + "20" }}
          >
            <Text 
              className="text-xs font-medium"
              style={{ color: item.type === "destination" ? colors.primary : colors.success }}
            >
              {item.type === "destination" ? "Destination" : "Package"}
            </Text>
          </View>
          <View className="flex-row">
            {[...Array(Math.min(item.rating, 5))].map((_, i) => (
              <IconSymbol key={i} name="star.fill" size={10} color={colors.primary} />
            ))}
          </View>
        </View>
        <Text 
          className="text-base font-semibold" 
          style={{ color: colors.foreground }}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text 
          className="text-sm" 
          style={{ color: colors.muted }}
          numberOfLines={1}
        >
          {item.subtitle}
        </Text>
        {item.price && (
          <Text 
            className="text-sm font-bold mt-1" 
            style={{ color: colors.primary }}
          >
            ${item.price} / person
          </Text>
        )}
      </View>
      <View className="justify-center">
        <IconSymbol name="chevron.right" size={20} color={colors.muted} />
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="px-4">
      {/* Header */}
      <View className="flex-row items-center pt-4 pb-4">
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [
            { padding: 8, marginLeft: -8 },
            pressed && { opacity: 0.7 }
          ]}
        >
          <IconSymbol name="chevron.right" size={24} color={colors.foreground} style={{ transform: [{ rotate: '180deg' }] }} />
        </Pressable>
        <Text 
          className="text-2xl font-bold ml-2" 
          style={{ color: colors.foreground }}
        >
          Search
        </Text>
      </View>

      {/* Search Input */}
      <View 
        className="flex-row items-center rounded-full px-4 py-3 mb-4"
        style={{ backgroundColor: colors.surface }}
      >
        <IconSymbol name="magnifyingglass" size={20} color={colors.muted} />
        <TextInput
          placeholder="Search destinations, packages..."
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={setQuery}
          autoFocus
          className="flex-1 ml-3"
          style={{ color: colors.foreground }}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")}>
            <IconSymbol name="xmark" size={18} color={colors.muted} />
          </Pressable>
        )}
      </View>

      {/* Results */}
      {query.trim() === "" ? (
        <View className="flex-1 items-center justify-center">
          <IconSymbol name="magnifyingglass" size={48} color={colors.muted} />
          <Text 
            className="text-lg font-semibold mt-4" 
            style={{ color: colors.foreground }}
          >
            Search Tourly
          </Text>
          <Text 
            className="text-sm text-center mt-2 px-8" 
            style={{ color: colors.muted }}
          >
            Find your perfect destination or travel package by searching above
          </Text>
        </View>
      ) : searchResults.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text 
            className="text-lg font-semibold" 
            style={{ color: colors.foreground }}
          >
            No results found
          </Text>
          <Text 
            className="text-sm text-center mt-2 px-8" 
            style={{ color: colors.muted }}
          >
            Try searching for a different destination or package
          </Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderResult}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={
            <Text 
              className="text-sm mb-3" 
              style={{ color: colors.muted }}
            >
              {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} found
            </Text>
          }
        />
      )}
    </ScreenContainer>
  );
}
