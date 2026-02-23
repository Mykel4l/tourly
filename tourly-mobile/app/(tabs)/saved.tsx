import { Text, View, FlatList, Pressable } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/lib/i18n";
import { useWishlist, WishlistItem } from "@/lib/store";
import { TopNavBar } from "@/components/top-nav-bar";

export default function SavedScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const { items, toggle } = useWishlist();

  const handlePress = (item: WishlistItem) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (item.type === "destination") {
      router.push(`/destination/${item.id}`);
    } else {
      router.push(`/package/${item.id}`);
    }
  };

  const handleRemove = (item: WishlistItem) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    toggle(item);
  };

  const renderItem = ({ item }: { item: WishlistItem }) => (
    <Pressable
      onPress={() => handlePress(item)}
      style={({ pressed }) => [
        { marginBottom: 16 },
        pressed && { opacity: 0.92 },
      ]}
    >
      <View
        style={{
          borderRadius: 20,
          backgroundColor: colors.surface,
          flexDirection: "row",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.10,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View style={{ borderRadius: 20, overflow: "hidden", flexDirection: "row", flex: 1 }}>
        <Image
          source={item.image}
          style={{ width: 110, height: 110 }}
          contentFit="cover"
        />
        <View
          style={{
            flex: 1,
            padding: 14,
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text
              style={{
                color: colors.primary,
                fontSize: 11,
                fontWeight: "600",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              {item.type === "destination" ? t.filterDestinations : t.filterPackages}
            </Text>
            <Text
              style={{
                color: colors.foreground,
                fontSize: 16,
                fontWeight: "700",
                marginBottom: 4,
              }}
              numberOfLines={2}
            >
              {item.name}
            </Text>
            <Text style={{ color: colors.muted, fontSize: 12 }}>
              {item.subtitle}
            </Text>
          </View>
          <Pressable
            onPress={() => handlePress(item)}
            style={({ pressed }) => [
              {
                alignSelf: "flex-start",
                backgroundColor: colors.primary,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                marginTop: 8,
              },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>
              {t.viewDetails}
            </Text>
          </Pressable>
        </View>
        <Pressable
          onPress={() => handleRemove(item)}
          style={({ pressed }) => [
            { padding: 14, justifyContent: "flex-start", alignItems: "flex-end" },
            pressed && { opacity: 0.7 },
          ]}
        >
          <IconSymbol name="heart.fill" size={22} color={colors.error} />
        </Pressable>
        </View>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="px-4" edges={["left", "right"]}>
      <TopNavBar title={t.savedPlaces} />

      {items.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 80,
          }}
        >
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: colors.surface,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <IconSymbol name="heart" size={38} color={colors.muted} />
          </View>
          <Text
            style={{
              color: colors.foreground,
              fontSize: 18,
              fontWeight: "700",
              marginBottom: 8,
            }}
          >
            {t.nothingSaved}
          </Text>
          <Text
            style={{
              color: colors.muted,
              fontSize: 14,
              textAlign: "center",
              paddingHorizontal: 32,
            }}
          >
            {t.nothingSavedHint}
          </Text>
          <Pressable
            onPress={() => router.push("/(tabs)/destinations")}
            style={({ pressed }) => [
              {
                marginTop: 24,
                backgroundColor: colors.primary,
                paddingHorizontal: 28,
                paddingVertical: 12,
                borderRadius: 50,
              },
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>{t.exploreDestinations}</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
        />
      )}
    </ScreenContainer>
  );
}
