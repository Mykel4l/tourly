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
import { destinations, Destination } from "@/data/destinations";
import { TopNavBar } from "@/components/top-nav-bar";

type SortMode = "default" | "name-az" | "rating";

export default function DestinationsScreen() {
  const colors = useColors();
  const { t } = useTranslation();

  const [query, setQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [showSort, setShowSort] = useState(false);

  const countries = [t.filterAll, ...Array.from(new Set(destinations.map((d) => d.country)))];

  const hasActiveFilters = selectedCountry !== null || sortMode !== "default" || query.trim() !== "";

  const haptic = useCallback(() => {
    if (Platform.OS !== "web") Haptics.selectionAsync();
  }, []);

  // ── Sort options ───────────────────────────────────────────────────────

  const sortOptions: { key: SortMode; label: string }[] = [
    { key: "default", label: t.sortDefault },
    { key: "name-az", label: t.sortNameAZ },
    { key: "rating", label: t.sortRating },
  ];

  const currentSortLabel = sortOptions.find((o) => o.key === sortMode)?.label ?? t.sortDefault;

  // ── Filtered + sorted data ────────────────────────────────────────────

  const filtered = useMemo(() => {
    let list = [...destinations];

    // Text search
    if (query.trim()) {
      const lq = query.toLowerCase().trim();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(lq) ||
          d.country.toLowerCase().includes(lq) ||
          d.description.toLowerCase().includes(lq)
      );
    }

    // Country filter
    if (selectedCountry) {
      list = list.filter((d) => d.country === selectedCountry);
    }

    // Sort
    switch (sortMode) {
      case "name-az":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
    }

    return list;
  }, [query, selectedCountry, sortMode]);

  const clearFilters = useCallback(() => {
    haptic();
    setQuery("");
    setSelectedCountry(null);
    setSortMode("default");
  }, [haptic]);

  // ── Chip helper ────────────────────────────────────────────────────────

  const Chip = ({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) => (
    <Pressable
      onPress={() => { haptic(); onPress(); }}
      style={({ pressed }) => [
        {
          paddingHorizontal: 16,
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

  // ── Card ───────────────────────────────────────────────────────────────

  const renderDestination = ({ item }: { item: Destination }) => (
    <Pressable
      onPress={() => {
        if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/destination/${item.id}`);
      }}
      style={({ pressed }) => [
        { marginBottom: 16 },
        pressed && { opacity: 0.95, transform: [{ scale: 0.99 }] },
      ]}
    >
      <View
        style={{
          borderRadius: 20,
          backgroundColor: colors.surface,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View style={{ borderRadius: 20, overflow: "hidden" }}>
          <Image source={item.image} style={{ width: "100%", height: 200 }} contentFit="cover" />
          <View style={{ padding: 16 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 12,
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                {item.country}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 2,
                  backgroundColor: colors.primary,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 20,
                }}
              >
                <IconSymbol name="star.fill" size={11} color="white" />
                <Text style={{ color: "white", fontSize: 11, fontWeight: "700" }}>
                  {item.rating.toFixed(1)}
                </Text>
              </View>
            </View>
            <Text
              style={{
                color: colors.foreground,
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 6,
              }}
            >
              {item.name}
            </Text>
            <Text style={{ color: colors.muted, fontSize: 13 }} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  // ── Filter bar (FlatList header) ───────────────────────────────────────

  const FilterHeader = () => (
    <View style={{ marginBottom: 8 }}>
      {/* Country + sort chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingBottom: 10, paddingHorizontal: 2 }}
      >
        {countries.map((country, idx) => {
          const isAll = idx === 0;
          const active = isAll ? selectedCountry === null : selectedCountry === country;
          return (
            <Chip
              key={country}
              active={active}
              label={country}
              onPress={() => setSelectedCountry(isAll ? null : country)}
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
              backgroundColor: sortMode !== "default" ? colors.primary + "15" : colors.surface,
              borderWidth: 1,
              borderColor: sortMode !== "default" ? colors.primary : colors.border,
            },
            pressed && { opacity: 0.8 },
          ]}
        >
          <IconSymbol
            name="arrow.up.arrow.down"
            size={14}
            color={sortMode !== "default" ? colors.primary : colors.muted}
          />
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: sortMode !== "default" ? colors.primary : colors.foreground,
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
              {opt.key === sortMode && <IconSymbol name="checkmark" size={16} color={colors.primary} />}
            </Pressable>
          ))}
        </View>
      )}

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
      <TopNavBar title={t.popularDestinations} />

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
              <IconSymbol name="mappin.slash" size={32} color={colors.muted} />
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
          renderItem={renderDestination}
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
