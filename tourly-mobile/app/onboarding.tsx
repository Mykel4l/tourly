import { useRef, useState } from "react";
import {
  Text,
  View,
  Pressable,
  Dimensions,
  FlatList,
  type ViewToken,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/lib/i18n";

const { width } = Dimensions.get("window");

const ONBOARDING_KEY = "@tourly:onboarding_done";

const SLIDE_ICONS = [
  { name: "globe.americas.fill" as const, bg: "#6366F1" },
  { name: "checkmark.shield.fill" as const, bg: "#059669" },
  { name: "gift.fill" as const, bg: "#F59E0B" },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const slides = [
    { title: t.onboardingTitle1, description: t.onboardingDesc1 },
    { title: t.onboardingTitle2, description: t.onboardingDesc2 },
    { title: t.onboardingTitle3, description: t.onboardingDesc3 },
  ];

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    router.replace("/");
  };

  const handleNext = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const renderSlide = ({ item, index }: { item: (typeof slides)[0]; index: number }) => {
    const icon = SLIDE_ICONS[index];
    return (
      <View style={{ width, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 }}>
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: icon.bg + "20",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <IconSymbol name={icon.name} size={56} color={icon.bg} />
        </View>
        <Text
          style={{
            color: colors.foreground,
            fontSize: 28,
            fontWeight: "800",
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          {item.title}
        </Text>
        <Text
          style={{
            color: colors.muted,
            fontSize: 16,
            textAlign: "center",
            lineHeight: 24,
          }}
        >
          {item.description}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      {/* Skip button */}
      <View style={{ alignItems: "flex-end", paddingHorizontal: 20, paddingTop: 16 }}>
        {currentIndex < slides.length - 1 ? (
          <Pressable onPress={handleSkip} hitSlop={12}>
            <Text style={{ color: colors.muted, fontSize: 15, fontWeight: "500" }}>{t.skip}</Text>
          </Pressable>
        ) : (
          <View style={{ height: 20 }} />
        )}
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        keyExtractor={(_, index) => index.toString()}
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: "center" }}
      />

      {/* Dots & Button */}
      <View style={{ paddingHorizontal: 40, paddingBottom: Math.max(insets.bottom + 16, 32) }}>
        {/* Dot indicators */}
        <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 32, gap: 8 }}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={{
                width: currentIndex === i ? 28 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: currentIndex === i ? colors.primary : colors.border,
              }}
            />
          ))}
        </View>

        {/* Action button */}
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            {
              backgroundColor: colors.primary,
              paddingVertical: 18,
              borderRadius: 50,
              alignItems: "center",
            },
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={{ color: "white", fontSize: 17, fontWeight: "700" }}>
            {currentIndex === slides.length - 1 ? t.getStarted : t.next}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export { ONBOARDING_KEY };
