import { Text, View, Pressable, TextInput, FlatList, ScrollView } from "react-native";
import { Image } from "expo-image";
import { useState, useMemo, useCallback } from "react";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/lib/i18n";
import { useCurrency } from "@/lib/currency";
import { destinations } from "@/data/destinations";
import { packages } from "@/data/packages";
import { TopNavBar } from "@/components/top-nav-bar";

// ─── Types ──────────────────────────────────────────────────────────────────

type ResultType = "all" | "destination" | "package";
type SortMode = "relevance" | "price-low" | "price-high" | "rating";

type SearchResult = {
  id: string;
  type: "destination" | "package";
  title: string;
  subtitle: string;
  image: any;
  rating: number;
  price?: number;
  /** Higher = better match */
  relevance: number;
};

// ─── Price presets ──────────────────────────────────────────────────────────

const PRICE_RANGES = [
  { min: 0, max: Infinity },
  { min: 0, max: 500 },
  { min: 500, max: 700 },
  { min: 700, max: Infinity },
] as const;

// ─── Screen ─────────────────────────────────────────────────────────────────

export default function SearchScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const { format } = useCurrency();

  const priceLabels = [
    t.priceAny,
    `< ${format(500)}`,
    `${format(500)} – ${format(700)}`,
    `${format(700)}+`,
  ];

  // Search & filter state
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ResultType>("all");
  const [sortMode, setSortMode] = useState<SortMode>("relevance");
  const [priceIdx, setPriceIdx] = useState(0);
  const [showSort, setShowSort] = useState(false);

  const hasActiveFilters = typeFilter !== "all" || sortMode !== "relevance" || priceIdx !== 0;

  // ── Build results ──────────────────────────────────────────────────────

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    const score = (text: string): number => {
      const lower = text.toLowerCase();
      if (lower === lowerQuery) return 3;
      if (lower.startsWith(lowerQuery)) return 2;
      if (lower.includes(lowerQuery)) return 1;
      return 0;
    };

    // Search destinations
    if (typeFilter === "all" || typeFilter === "destination") {
      destinations.forEach((dest) => {
        const nameScore = score(dest.name);
        const countryScore = score(dest.country);
        const descScore = score(dest.description);
        const best = Math.max(nameScore, countryScore, descScore);
        if (best > 0) {
          results.push({
            id: dest.id,
            type: "destination",
            title: dest.name,
            subtitle: dest.country,
            image: dest.image,
            rating: dest.rating,
            relevance: best + (nameScore > 0 ? 1 : 0),
          });
        }
      });
    }

    // Search packages
    if (typeFilter === "all" || typeFilter === "package") {
      const { min, max } = PRICE_RANGES[priceIdx];
      packages.forEach((pkg) => {
        if (pkg.price < min || pkg.price > max) return;
        const titleScore = score(pkg.title);
        const locScore = score(pkg.location);
        const descScore = score(pkg.description);
        const best = Math.max(titleScore, locScore, descScore);
        if (best > 0) {
          results.push({
            id: pkg.id,
            type: "package",
            title: pkg.title,
            subtitle: `${pkg.location} · ${pkg.duration}`,
            image: pkg.image,
            rating: pkg.rating,
            price: pkg.price,
            relevance: best + (titleScore > 0 ? 1 : 0),
          });
        }
      });
    }

    // Sort
    switch (sortMode) {
      case "price-low":
        results.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-high":
        results.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      default:
        results.sort((a, b) => b.relevance - a.relevance);
    }

    return results;
  }, [query, typeFilter, sortMode, priceIdx]);

  // ── Handlers ───────────────────────────────────────────────────────────

  const haptic = useCallback(() => {
    if (Platform.OS !== "web") Haptics.selectionAsync();
  }, []);

  const handleResultPress = useCallback(
    (result: SearchResult) => {
      if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (result.type === "destination") router.push(`/destination/${result.id}`);
      else router.push(`/package/${result.id}`);
    },
    []
  );

  const clearFilters = useCallback(() => {
    haptic();
    setTypeFilter("all");
    setSortMode("relevance");
    setPriceIdx(0);
  }, [haptic]);

  // ── Sort options ───────────────────────────────────────────────────────

  const sortOptions: { key: SortMode; label: string }[] = [
    { key: "relevance", label: t.sortRelevance },
    { key: "price-low", label: t.sortPriceLow },
    { key: "price-high", label: t.sortPriceHigh },
    { key: "rating", label: t.sortRating },
  ];

  const currentSortLabel = sortOptions.find((o) => o.key === sortMode)?.label ?? t.sortRelevance;

  // ── Chip component ─────────────────────────────────────────────────────

  const Chip = ({
    active,
    label,
    onPress,
    icon,
  }: {
    active: boolean;
    label: string;
    onPress: () => void;
    icon?: string;
  }) => (
    <Pressable
      onPress={() => { haptic(); onPress(); }}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
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
      {icon && (
        <IconSymbol name={icon as any} size={14} color={active ? "white" : colors.muted} />
      )}
      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: active ? "white" : colors.foreground,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );

  // ── Result card ────────────────────────────────────────────────────────

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
        pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
      ]}
    >
      <Image
        source={item.image}
        style={{ width: 88, height: 88, borderRadius: 14 }}
        contentFit="cover"
      />
      <View style={{ flex: 1, marginLeft: 12, justifyContent: "center" }}>
        {/* Type badge + rating */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4, gap: 6 }}>
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 6,
              backgroundColor:
                item.type === "destination" ? colors.primary + "18" : colors.success + "18",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: 0.4,
                color: item.type === "destination" ? colors.primary : colors.success,
              }}
            >
              {item.type === "destination" ? t.filterDestinations : t.filterPackages}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <IconSymbol name="star.fill" size={11} color={colors.primary} />
            <Text style={{ fontSize: 11, fontWeight: "600", color: colors.muted }}>
              {item.rating.toFixed(1)}
            </Text>
          </View>
        </View>

        <Text
          numberOfLines={1}
          style={{ fontSize: 15, fontWeight: "700", color: colors.foreground }}
        >
          {item.title}
        </Text>

        <Text numberOfLines={1} style={{ fontSize: 13, color: colors.muted, marginTop: 2 }}>
          {item.subtitle}
        </Text>

        {item.price != null && (
          <Text style={{ fontSize: 14, fontWeight: "800", color: colors.primary, marginTop: 4 }}>
            {format(item.price)}
            <Text style={{ fontWeight: "500", fontSize: 12, color: colors.muted }}>
              {" "}{t.perPersonShort}
            </Text>
          </Text>
        )}
      </View>
      <View style={{ justifyContent: "center", paddingLeft: 4 }}>
        <IconSymbol name="chevron.right" size={18} color={colors.muted} />
      </View>
    </Pressable>
  );

  // ── Filter bar (FlatList header) ───────────────────────────────────────

  const FilterBar = () => (
    <View style={{ marginBottom: 8 }}>
      {/* Type filter + sort chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingBottom: 10, paddingHorizontal: 2 }}
      >
        <Chip active={typeFilter === "all"} label={t.filterAll} onPress={() => setTypeFilter("all")} />
        <Chip
          active={typeFilter === "destination"}
          label={t.filterDestinations}
          onPress={() => setTypeFilter("destination")}
          icon="mappin.and.ellipse"
        />
        <Chip
          active={typeFilter === "package"}
          label={t.filterPackages}
          onPress={() => setTypeFilter("package")}
          icon="suitcase.fill"
        />

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
              backgroundColor: sortMode !== "relevance" ? colors.primary + "15" : colors.surface,
              borderWidth: 1,
              borderColor: sortMode !== "relevance" ? colors.primary : colors.border,
            },
            pressed && { opacity: 0.8 },
          ]}
        >
          <IconSymbol
            name="arrow.up.arrow.down"
            size={14}
            color={sortMode !== "relevance" ? colors.primary : colors.muted}
          />
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: sortMode !== "relevance" ? colors.primary : colors.foreground,
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
              onPress={() => { haptic(); setSortMode(opt.key); setShowSort(false); }}
              style={({ pressed }) => [
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 16,
                  paddingVertical: 13,
                  backgroundColor: opt.key === sortMode ? colors.primary + "10" : "transparent",
                },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: opt.key === sortMode ? "700" : "500",
                  color: opt.key === sortMode ? colors.primary : colors.foreground,
                }}
              >
                {opt.label}
              </Text>
              {opt.key === sortMode && (
                <IconSymbol name="checkmark" size={16} color={colors.primary} />
              )}
            </Pressable>
          ))}
        </View>
      )}

      {/* Price range chips (visible when packages included) */}
      {typeFilter !== "destination" && (
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
      )}

      {/* Active filters indicator + clear */}
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
            {searchResults.length} {t.resultsFound}
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
      <TopNavBar title={t.search} showBack />

      {/* Search Input */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 50,
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginBottom: 12,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <IconSymbol name="magnifyingglass" size={20} color={colors.muted} />
        <TextInput
          placeholder={t.searchPlaceholder}
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={setQuery}
          autoFocus
          style={{ flex: 1, marginLeft: 10, fontSize: 15, color: colors.foreground }}
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

      {/* Content */}
      {query.trim() === "" ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
          <View
            style={{
              width: 80, height: 80, borderRadius: 40,
              backgroundColor: colors.primary + "12",
              alignItems: "center", justifyContent: "center", marginBottom: 20,
            }}
          >
            <IconSymbol name="magnifyingglass" size={36} color={colors.primary} />
          </View>
          <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground, marginBottom: 8, textAlign: "center" }}>
            {t.searchTourly}
          </Text>
          <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center", lineHeight: 20 }}>
            {t.searchHint}
          </Text>
        </View>
      ) : searchResults.length === 0 ? (
        <View style={{ flex: 1 }}>
          <FilterBar />
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
            <View
              style={{
                width: 80, height: 80, borderRadius: 40,
                backgroundColor: colors.muted + "12",
                alignItems: "center", justifyContent: "center", marginBottom: 20,
              }}
            >
              <IconSymbol name="doc.text.magnifyingglass" size={36} color={colors.muted} />
            </View>
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, marginBottom: 8, textAlign: "center" }}>
              {t.noResults}
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center", lineHeight: 20 }}>
              {t.tryDifferent}
            </Text>
            {hasActiveFilters && (
              <Pressable
                onPress={clearFilters}
                style={({ pressed }) => [
                  {
                    marginTop: 16, paddingHorizontal: 20, paddingVertical: 10,
                    borderRadius: 50, backgroundColor: colors.primary,
                  },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={{ color: "white", fontWeight: "700", fontSize: 14 }}>
                  {t.clearFilters}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={searchResults}
          renderItem={renderResult}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={<FilterBar />}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </ScreenContainer>
  );
}
