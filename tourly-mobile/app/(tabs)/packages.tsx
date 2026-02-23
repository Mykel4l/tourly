import { Text, View, FlatList, Pressable, ScrollView, TextInput } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useState, useMemo, useCallback } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/lib/i18n";
import { useCurrency } from "@/lib/currency";
import { packages, TravelPackage } from "@/data/packages";
import { useWishlist } from "@/lib/store";
import { TopNavBar } from "@/components/top-nav-bar";

type SortKey = "default" | "price-asc" | "price-desc" | "rating";

const PRICE_RANGES = [
  { min: 0, max: Infinity },
  { min: 0, max: 500 },
  { min: 500, max: 700 },
  { min: 700, max: Infinity },
] as const;

export default function PackagesScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const { format } = useCurrency();
  const { toggle, isSaved } = useWishlist();

  const priceLabels = [
    t.priceAny,
    `< ${format(500)}`,
    `${format(500)} – ${format(700)}`,
    `${format(700)}+`,
  ];

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("default");
  const [showSort, setShowSort] = useState(false);
  const [priceIdx, setPriceIdx] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const locations = [t.filterAll, ...Array.from(new Set(packages.map((p) => p.location)))];

  const hasActiveFilters =
    sort !== "default" || priceIdx !== 0 || selectedLocation !== null || query.trim() !== "";

  const haptic = useCallback(() => {
    if (Platform.OS !== "web") Haptics.selectionAsync();
  }, []);

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "default", label: t.sortDefault },
    { key: "price-asc", label: t.sortPriceLow },
    { key: "price-desc", label: t.sortPriceHigh },
    { key: "rating", label: t.sortRating },
  ];

  const currentSortLabel = sortOptions.find((o) => o.key === sort)?.label ?? t.sortDefault;

  // ── Filtered + sorted data ────────────────────────────────────────────

  const filtered = useMemo(() => {
    let list = [...packages];

    // Text search
    if (query.trim()) {
      const lq = query.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(lq) ||
          p.location.toLowerCase().includes(lq) ||
          p.description.toLowerCase().includes(lq)
      );
    }

    // Location filter
    if (selectedLocation) {
      list = list.filter((p) => p.location === selectedLocation);
    }

    // Price filter
    const { min, max } = PRICE_RANGES[priceIdx];
    list = list.filter((p) => p.price >= min && p.price <= max);

    // Sort
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        break;
    }

    return list;
  }, [query, selectedLocation, priceIdx, sort]);

  const clearFilters = useCallback(() => {
    haptic();
    setQuery("");
    setSort("default");
    setPriceIdx(0);
    setSelectedLocation(null);
  }, [haptic]);

  // ── Chip helper ────────────────────────────────────────────────────────

  const Chip = ({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) => (
    <Pressable
      onPress={() => { haptic(); onPress(); }}
      style={({ pressed }) => [
        {
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 50,
          backgroundColor: active ? colors.primary : colors.surface,
          borderWidth: 1,
          borderColor: active ? colors.primary : colors.border,
        },
        pressed && { opacity: 0.8 },
      ]}
    >
      <Text style={{ color: active ? "white" : colors.foreground, fontSize: 13, fontWeight: "600" }}>
        {label}
      </Text>
    </Pressable>
  );

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

  const handleSave = (item: TravelPackage) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    toggle({
      id: item.id,
      type: "package",
      name: item.title,
      image: item.image,
      subtitle: `${format(item.price)} ${t.perPerson}`,
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
        style={{
          borderRadius: 16,
          marginBottom: 16,
          backgroundColor: colors.surface,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.10,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View style={{ borderRadius: 16, overflow: "hidden" }}>
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
                {t.maxPax}: {item.maxPax}
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
                  ({item.reviews} {t.reviewsLabel})
                </Text>
                <View className="flex-row">
                  {[...Array(item.rating)].map((_, i) => (
                    <IconSymbol key={i} name="star.fill" size={12} color={colors.primary} />
                  ))}
                </View>
              </View>
              <Text className="text-2xl font-bold" style={{ color: colors.foreground }}>
                {format(item.price)}
                <Text className="text-sm font-normal" style={{ color: colors.muted }}>
                  {" "}{t.perPerson}
                </Text>
              </Text>
            </View>
            
            <Pressable
              onPress={(e) => { e.stopPropagation?.(); handleSave(item); }}
              style={({ pressed }) => [
                {
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isSaved(item.id, "package") ? colors.error : "white",
                  borderWidth: 2,
                  borderColor: colors.error,
                  shadowColor: colors.error,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isSaved(item.id, "package") ? 0.35 : 0.12,
                  shadowRadius: 4,
                  elevation: isSaved(item.id, "package") ? 4 : 2,
                },
                pressed && { transform: [{ scale: 0.88 }] },
              ]}
            >
              <IconSymbol
                name={isSaved(item.id, "package") ? "heart.fill" : "heart"}
                size={18}
                color={isSaved(item.id, "package") ? "white" : colors.error}
              />
            </Pressable>
            <Pressable
              onPress={() => handleBook(item)}
              style={({ pressed }) => [
                { 
                  flex: 1,
                  backgroundColor: colors.primary, 
                  paddingHorizontal: 20, 
                  paddingVertical: 12, 
                  borderRadius: 50,
                  alignItems: "center",
                },
                pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }
              ]}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>{t.bookNow}</Text>
            </Pressable>
          </View>
        </View>
        </View>
      </View>
    </Pressable>
  );

  // ── Filter bar (FlatList header) ───────────────────────────────────────

  const FilterHeader = () => (
    <View style={{ marginBottom: 8 }}>
      {/* Location chips + sort */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingBottom: 10, paddingHorizontal: 2 }}
      >
        {locations.map((loc, idx) => {
          const isAll = idx === 0;
          const active = isAll ? selectedLocation === null : selectedLocation === loc;
          return (
            <Chip
              key={loc}
              active={active}
              label={loc}
              onPress={() => setSelectedLocation(isAll ? null : loc)}
            />
          );
        })}

        {/* Divider */}
        <View
          style={{
            width: 1,
            height: 28,
            backgroundColor: colors.border,
            alignSelf: "center",
            marginHorizontal: 4,
          }}
        />

        {/* Sort button */}
        <Pressable
          onPress={() => { haptic(); setShowSort(!showSort); }}
          style={({ pressed }) => [
            {
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 50,
              backgroundColor: sort !== "default" ? colors.primary + "15" : colors.surface,
              borderWidth: 1,
              borderColor: sort !== "default" ? colors.primary : colors.border,
            },
            pressed && { opacity: 0.8 },
          ]}
        >
          <IconSymbol
            name="arrow.up.arrow.down"
            size={14}
            color={sort !== "default" ? colors.primary : colors.muted}
          />
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: sort !== "default" ? colors.primary : colors.foreground,
            }}
          >
            {currentSortLabel}
          </Text>
        </Pressable>
      </ScrollView>

      {/* Sort dropdown */}
      {showSort && (
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 10,
            overflow: "hidden",
          }}
        >
          {sortOptions.map((opt) => (
            <Pressable
              key={opt.key}
              onPress={() => { haptic(); setSort(opt.key); setShowSort(false); }}
              style={({ pressed }) => [
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 16,
                  paddingVertical: 13,
                  backgroundColor: opt.key === sort ? colors.primary + "10" : "transparent",
                },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: opt.key === sort ? "700" : "500",
                  color: opt.key === sort ? colors.primary : colors.foreground,
                }}
              >
                {opt.label}
              </Text>
              {opt.key === sort && <IconSymbol name="checkmark" size={16} color={colors.primary} />}
            </Pressable>
          ))}
        </View>
      )}

      {/* Price range chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingBottom: 10, paddingHorizontal: 2 }}
      >
        <View style={{ justifyContent: "center", marginRight: 2 }}>
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
            {t.priceRange}:
          </Text>
        </View>
        {PRICE_RANGES.map((_, idx) => (
          <Chip key={idx} active={priceIdx === idx} label={priceLabels[idx]} onPress={() => setPriceIdx(idx)} />
        ))}
      </ScrollView>

      {/* Active filters + clear */}
      {hasActiveFilters && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 8,
          }}
        >
          <Text style={{ fontSize: 12, color: colors.muted }}>
            {filtered.length} {t.resultsFound}
          </Text>
          <Pressable
            onPress={clearFilters}
            style={({ pressed }) => [
              {
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 50,
                backgroundColor: colors.error + "12",
              },
              pressed && { opacity: 0.7 },
            ]}
          >
            <IconSymbol name="xmark" size={12} color={colors.error} />
            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.error }}>
              {t.clearFilters}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <ScreenContainer className="px-4" edges={["left", "right"]}>
      <TopNavBar title={t.checkoutPackages} />

      {/* Search input */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 50,
          paddingHorizontal: 16,
          paddingVertical: 10,
          marginBottom: 10,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <IconSymbol name="magnifyingglass" size={18} color={colors.muted} />
        <TextInput
          placeholder={t.searchPlaceholder}
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={setQuery}
          style={{ flex: 1, marginLeft: 10, fontSize: 14, color: colors.foreground }}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable
            onPress={() => setQuery("")}
            style={{ padding: 4, borderRadius: 50, backgroundColor: colors.muted + "20" }}
          >
            <IconSymbol name="xmark" size={14} color={colors.muted} />
          </Pressable>
        )}
      </View>

      {/* Results or empty state */}
      {filtered.length === 0 ? (
        <View style={{ flex: 1 }}>
          <FilterHeader />
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: colors.muted + "12",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <IconSymbol name="suitcase" size={32} color={colors.muted} />
            </View>
            <Text
              style={{ fontSize: 17, fontWeight: "700", color: colors.foreground, marginBottom: 6, textAlign: "center" }}
            >
              {t.noResults}
            </Text>
            <Text style={{ fontSize: 13, color: colors.muted, textAlign: "center", lineHeight: 19 }}>
              {t.tryDifferent}
            </Text>
            {hasActiveFilters && (
              <Pressable
                onPress={clearFilters}
                style={({ pressed }) => [
                  {
                    marginTop: 14,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 50,
                    backgroundColor: colors.primary,
                  },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={{ color: "white", fontWeight: "700", fontSize: 14 }}>{t.clearFilters}</Text>
              </Pressable>
            )}
          </View>
        </View>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={filtered}
          renderItem={renderPackage}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={<FilterHeader />}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </ScreenContainer>
  );
}
