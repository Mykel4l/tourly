import {
  Text,
  View,
  ScrollView,
  Pressable,
  Linking,
  Platform,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useMemo } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { TopNavBar } from "@/components/top-nav-bar";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/lib/i18n";

// ─── Store URLs (update when published) ─────────────────────────────────────

const APP_STORE_URL = "https://apps.apple.com/app/tourly/id000000000";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.tourly.app";

function haptic() {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

// ─── Breakpoints ────────────────────────────────────────────────────────────

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

function getBreakpoint(width: number): Breakpoint {
  if (width < 480) return "xs";   // small phone
  if (width < 640) return "sm";   // large phone
  if (width < 1024) return "md";  // tablet
  if (width < 1440) return "lg";  // desktop
  return "xl";                     // wide desktop
}

function useResponsive() {
  const { width, height } = useWindowDimensions();
  return useMemo(() => {
    const bp = getBreakpoint(width);
    const isPhone = bp === "xs" || bp === "sm";
    const isTablet = bp === "md";
    const isDesktop = bp === "lg" || bp === "xl";

    // Content max-width for centering on large screens
    const maxContent = bp === "xl" ? 1200 : bp === "lg" ? 960 : undefined;

    // Horizontal page padding
    const px = isDesktop ? 48 : isTablet ? 32 : bp === "sm" ? 20 : 16;

    // Section spacing
    const sectionGap = isDesktop ? 56 : isTablet ? 44 : 32;

    // Feature grid columns
    const featureCols = isDesktop ? 3 : isTablet ? 2 : 1;

    // Review grid columns
    const reviewCols = isDesktop ? 3 : isTablet ? 2 : 1;

    // Stat grid columns
    const statCols = isPhone ? 2 : 4;

    // Font scale
    const fs = (base: number) => {
      if (bp === "xs") return base;
      if (bp === "sm") return base;
      if (bp === "md") return base * 1.05;
      if (bp === "lg") return base * 1.12;
      return base * 1.18;
    };

    return {
      width,
      height,
      bp,
      isPhone,
      isTablet,
      isDesktop,
      maxContent,
      px,
      sectionGap,
      featureCols,
      reviewCols,
      statCols,
      fs,
    };
  }, [width, height]);
}

// ─── Reusable Store Button ──────────────────────────────────────────────────

function StoreButton({
  store,
  onPress,
  variant,
  fs,
}: {
  store: "ios" | "android";
  onPress: () => void;
  variant: "dark" | "glass";
  fs: (n: number) => number;
}) {
  const { t } = useTranslation();
  const isIos = store === "ios";
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          paddingVertical: 16,
          paddingHorizontal: 24,
          borderRadius: 16,
          ...(variant === "dark"
            ? { backgroundColor: "#000" }
            : {
                backgroundColor: "rgba(255,255,255,0.15)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.2)",
              }),
        },
        pressed && { opacity: 0.85 },
      ]}
    >
      <IconSymbol
        name={isIos ? ("apple.logo" as any) : ("play.fill" as any)}
        size={fs(20)}
        color="#fff"
      />
      <View>
        <Text
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: fs(10),
            fontWeight: "500",
          }}
        >
          {isIos ? t.downloadOnThe : t.downloadGetItOn}
        </Text>
        <Text style={{ color: "#fff", fontSize: fs(16), fontWeight: "700" }}>
          {isIos ? t.downloadAppStore : t.downloadGooglePlay}
        </Text>
      </View>
    </Pressable>
  );
}

// ─── Grid helper ────────────────────────────────────────────────────────────

function GridRow({
  children,
  columns,
  gap,
}: {
  children: React.ReactNode[];
  columns: number;
  gap: number;
}) {
  const rows: React.ReactNode[][] = [];
  for (let i = 0; i < children.length; i += columns) {
    rows.push(children.slice(i, i + columns));
  }
  return (
    <View style={{ gap }}>
      {rows.map((row, ri) => (
        <View key={ri} style={{ flexDirection: "row", gap }}>
          {row.map((child, ci) => (
            <View key={ci} style={{ flex: 1 }}>
              {child}
            </View>
          ))}
          {/* If last row is incomplete, add empty spacers to maintain grid */}
          {row.length < columns &&
            Array.from({ length: columns - row.length }).map((_, si) => (
              <View key={`spacer-${si}`} style={{ flex: 1 }} />
            ))}
        </View>
      ))}
    </View>
  );
}

// ─── Screen ─────────────────────────────────────────────────────────────────

export default function DownloadAppScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const r = useResponsive();
  const { t } = useTranslation();

  const FEATURES = [
    {
      icon: "bolt.fill",
      title: t.downloadFeatureFast,
      description: t.downloadFeatureFastDesc,
      gradient: ["#6366F1", "#8B5CF6"] as [string, string],
    },
    {
      icon: "bell.badge.fill",
      title: t.downloadFeatureNotif,
      description: t.downloadFeatureNotifDesc,
      gradient: ["#F59E0B", "#F97316"] as [string, string],
    },
    {
      icon: "location.fill",
      title: t.downloadFeatureOffline,
      description: t.downloadFeatureOfflineDesc,
      gradient: ["#0EA5E9", "#06B6D4"] as [string, string],
    },
    {
      icon: "hand.tap.fill",
      title: t.downloadFeatureOneTap,
      description: t.downloadFeatureOneTapDesc,
      gradient: ["#22C55E", "#10B981"] as [string, string],
    },
    {
      icon: "sparkles",
      title: t.downloadFeatureAI,
      description: t.downloadFeatureAIDesc,
      gradient: ["#EC4899", "#F43F5E"] as [string, string],
    },
    {
      icon: "lock.shield.fill",
      title: t.downloadFeatureSecure,
      description: t.downloadFeatureSecureDesc,
      gradient: ["#8B5CF6", "#A855F7"] as [string, string],
    },
  ];

  const STATS = [
    { value: t.downloadStatRating, label: t.downloadStatRatingLabel, icon: "star.fill" },
    { value: t.downloadStatDownloads, label: t.downloadStatDownloadsLabel, icon: "arrow.down.circle.fill" },
    { value: t.downloadStatDest, label: t.downloadStatDestLabel, icon: "map.fill" },
    { value: t.downloadStatSupport, label: t.downloadStatSupportLabel, icon: "headphones" },
  ];

  const REVIEWS = [
    {
      name: t.downloadReview1Name,
      rating: 5,
      text: t.downloadReview1Text,
      platform: "ios",
    },
    {
      name: t.downloadReview2Name,
      rating: 5,
      text: t.downloadReview2Text,
      platform: "android",
    },
    {
      name: t.downloadReview3Name,
      rating: 5,
      text: t.downloadReview3Text,
      platform: "ios",
    },
  ];

  const COMPARISON_ROWS = [
    { feature: t.downloadComparePush, app: true, browser: false },
    { feature: t.downloadCompareOffline, app: true, browser: false },
    { feature: t.downloadCompareBiometric, app: true, browser: false },
    { feature: t.downloadCompareOneTap, app: true, browser: false },
    { feature: t.downloadCompareAI, app: true, browser: true },
    { feature: t.downloadCompareBrowse, app: true, browser: true },
  ];

  const openStore = (store: "ios" | "android") => {
    haptic();
    Linking.openURL(store === "ios" ? APP_STORE_URL : PLAY_STORE_URL);
  };

  // Centered container style for large screens
  const containerStyle = r.maxContent
    ? { maxWidth: r.maxContent, alignSelf: "center" as const, width: "100%" as const }
    : {};

  return (
    <ScreenContainer className="px-0" edges={["left", "right"]}>
      <View style={{ paddingHorizontal: r.px, ...containerStyle }}>
        <TopNavBar title={t.downloadTitle} showBack />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 40,
          ...containerStyle,
        }}
      >
        {/* ── Hero Section ─────────────────────────────────────────── */}
        <Animated.View entering={FadeIn.duration(600)}>
          <LinearGradient
            colors={[colors.primary, "#6366F1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              marginHorizontal: r.px,
              borderRadius: r.isDesktop ? 36 : 28,
              padding: r.isDesktop ? 56 : r.isTablet ? 40 : 32,
              alignItems: "center",
              marginBottom: r.sectionGap,
              overflow: "hidden",
            }}
          >
            {/* Decorative circles */}
            <View
              style={{
                position: "absolute",
                top: -30,
                right: -30,
                width: r.isDesktop ? 200 : 120,
                height: r.isDesktop ? 200 : 120,
                borderRadius: r.isDesktop ? 100 : 60,
                backgroundColor: "rgba(255,255,255,0.08)",
              }}
            />
            <View
              style={{
                position: "absolute",
                bottom: -20,
                left: -20,
                width: r.isDesktop ? 140 : 80,
                height: r.isDesktop ? 140 : 80,
                borderRadius: r.isDesktop ? 70 : 40,
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
            />
            {r.isDesktop && (
              <View
                style={{
                  position: "absolute",
                  top: "40%",
                  left: "60%",
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: "rgba(255,255,255,0.04)",
                }}
              />
            )}

            {/* App icon */}
            <View
              style={{
                width: r.isDesktop ? 100 : 80,
                height: r.isDesktop ? 100 : 80,
                borderRadius: r.isDesktop ? 28 : 22,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: r.isDesktop ? 28 : 20,
                borderWidth: 2,
                borderColor: "rgba(255,255,255,0.15)",
              }}
            >
              <Text style={{ fontSize: r.isDesktop ? 48 : 38 }}>🌍</Text>
            </View>

            <Text
              style={{
                color: "#fff",
                fontSize: r.fs(r.isDesktop ? 40 : 28),
                fontWeight: "900",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Tourly
            </Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: r.fs(16),
                textAlign: "center",
                lineHeight: r.fs(24),
                marginBottom: r.isDesktop ? 36 : 28,
                maxWidth: r.isDesktop ? 480 : 320,
              }}
            >
              {t.downloadHeroSubtitle}
            </Text>

            {/* Download buttons — always row on tablet+, column on phone */}
            <View
              style={{
                flexDirection: r.isPhone ? "column" : "row",
                gap: 12,
                width: "100%",
                maxWidth: r.isDesktop ? 520 : undefined,
              }}
            >
              <StoreButton
                store="ios"
                onPress={() => openStore("ios")}
                variant="dark"
                fs={r.fs}
              />
              <StoreButton
                store="android"
                onPress={() => openStore("android")}
                variant="glass"
                fs={r.fs}
              />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ── Stats Bar ────────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={{ paddingHorizontal: r.px, marginBottom: r.sectionGap }}
        >
          <GridRow columns={r.statCols} gap={r.isDesktop ? 16 : r.isTablet ? 12 : 8}>
            {STATS.map((stat) => (
              <View
                key={stat.label}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: r.isDesktop ? 20 : 16,
                  padding: r.isDesktop ? 24 : r.isTablet ? 18 : 14,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                  height: "100%",
                  minHeight: r.isDesktop ? 130 : r.isTablet ? 110 : 100,
                }}
              >
                <IconSymbol
                  name={stat.icon as any}
                  size={r.isDesktop ? 22 : 16}
                  color={colors.primary}
                />
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: r.fs(r.isDesktop ? 24 : 18),
                    fontWeight: "800",
                    color: colors.foreground,
                    marginTop: 6,
                  }}
                >
                  {stat.value}
                </Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: r.fs(r.isDesktop ? 12 : 10),
                    color: colors.muted,
                    fontWeight: "600",
                    marginTop: 2,
                  }}
                >
                  {stat.label}
                </Text>
              </View>
            ))}
          </GridRow>
        </Animated.View>

        {/* ── Why the App? ─────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: r.px, marginBottom: r.sectionGap }}>
          <Animated.View
            entering={FadeInDown.delay(300).duration(500)}
            style={{ alignItems: r.isDesktop ? "center" : undefined, marginBottom: r.isDesktop ? 32 : 20 }}
          >
            <Text
              style={{
                fontSize: r.fs(12),
                fontWeight: "700",
                color: colors.primary,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 6,
                textAlign: r.isDesktop ? "center" : undefined,
              }}
            >
              {t.downloadExclusiveEyebrow}
            </Text>
            <Text
              style={{
                fontSize: r.fs(r.isDesktop ? 32 : 24),
                fontWeight: "900",
                color: colors.foreground,
                marginBottom: 6,
                textAlign: r.isDesktop ? "center" : undefined,
              }}
            >
              {t.downloadWhyTitle}
            </Text>
            <Text
              style={{
                fontSize: r.fs(14),
                color: colors.muted,
                lineHeight: r.fs(20),
                textAlign: r.isDesktop ? "center" : undefined,
                maxWidth: r.isDesktop ? 500 : undefined,
              }}
            >
              {t.downloadWhySubtitle}
            </Text>
          </Animated.View>

          <GridRow columns={r.featureCols} gap={r.isDesktop ? 16 : 12}>
            {FEATURES.map((feature, i) => (
              <Animated.View
                key={feature.title}
                entering={FadeInDown.delay(400 + i * 80).duration(500).springify()}
                style={{
                  flexDirection: r.featureCols > 1 ? "column" : "row",
                  alignItems: r.featureCols > 1 ? "flex-start" : "center",
                  gap: r.featureCols > 1 ? 12 : 14,
                  backgroundColor: colors.surface,
                  borderRadius: r.isDesktop ? 22 : 18,
                  padding: r.isDesktop ? 24 : 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                  height: "100%",
                }}
              >
                <LinearGradient
                  colors={feature.gradient}
                  style={{
                    width: r.isDesktop ? 52 : 44,
                    height: r.isDesktop ? 52 : 44,
                    borderRadius: r.isDesktop ? 16 : 14,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconSymbol
                    name={feature.icon as any}
                    size={r.isDesktop ? 24 : 20}
                    color="#fff"
                  />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: r.fs(15),
                      fontWeight: "700",
                      color: colors.foreground,
                      marginBottom: 3,
                    }}
                  >
                    {feature.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: r.fs(13),
                      color: colors.muted,
                      lineHeight: r.fs(19),
                    }}
                  >
                    {feature.description}
                  </Text>
                </View>
              </Animated.View>
            ))}
          </GridRow>
        </View>

        {/* ── User Reviews ─────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: r.px, marginBottom: r.sectionGap }}>
          <Animated.View
            entering={FadeInDown.delay(600).duration(500)}
            style={{ alignItems: r.isDesktop ? "center" : undefined, marginBottom: r.isDesktop ? 28 : 20 }}
          >
            <Text
              style={{
                fontSize: r.fs(12),
                fontWeight: "700",
                color: colors.primary,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 6,
                textAlign: r.isDesktop ? "center" : undefined,
              }}
            >
              {t.downloadReviewsEyebrow}
            </Text>
            <Text
              style={{
                fontSize: r.fs(r.isDesktop ? 32 : 24),
                fontWeight: "900",
                color: colors.foreground,
                textAlign: r.isDesktop ? "center" : undefined,
              }}
            >
              {t.downloadReviewsTitle}
            </Text>
          </Animated.View>

          <GridRow columns={r.reviewCols} gap={r.isDesktop ? 16 : 12}>
            {REVIEWS.map((review, i) => (
              <Animated.View
                key={review.name}
                entering={FadeInDown.delay(700 + i * 100).duration(500).springify()}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: r.isDesktop ? 22 : 18,
                  padding: r.isDesktop ? 24 : 18,
                  borderWidth: 1,
                  borderColor: colors.border,
                  height: "100%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View
                      style={{
                        width: r.isDesktop ? 44 : 36,
                        height: r.isDesktop ? 44 : 36,
                        borderRadius: r.isDesktop ? 22 : 18,
                        backgroundColor: colors.primary + "15",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: r.fs(14),
                          fontWeight: "700",
                          color: colors.primary,
                        }}
                      >
                        {review.name.charAt(0)}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: r.fs(14),
                          fontWeight: "700",
                          color: colors.foreground,
                        }}
                      >
                        {review.name}
                      </Text>
                      <View style={{ flexDirection: "row", gap: 2, marginTop: 2 }}>
                        {Array.from({ length: review.rating }).map((_, si) => (
                          <IconSymbol
                            key={si}
                            name="star.fill"
                            size={r.isDesktop ? 13 : 11}
                            color="#F59E0B"
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      backgroundColor: review.platform === "ios" ? "#000" : "#22C55E",
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ fontSize: r.fs(10), fontWeight: "700", color: "#fff" }}>
                      {review.platform === "ios" ? t.downloadPlatformIOS : t.downloadPlatformAndroid}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: r.fs(13),
                    color: colors.muted,
                    lineHeight: r.fs(19),
                  }}
                >
                  "{review.text}"
                </Text>
              </Animated.View>
            ))}
          </GridRow>
        </View>

        {/* ── Comparison Table ──────────────────────────────────────── */}
        <View
          style={{
            paddingHorizontal: r.px,
            marginBottom: r.sectionGap,
            alignItems: r.isDesktop ? "center" : undefined,
          }}
        >
          <Animated.View entering={FadeInDown.delay(800).duration(500)}>
            <Text
              style={{
                fontSize: r.fs(r.isDesktop ? 28 : 20),
                fontWeight: "800",
                color: colors.foreground,
                marginBottom: r.isDesktop ? 24 : 16,
                textAlign: "center",
              }}
            >
              {t.downloadCompareTitle}
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(900).duration(500)}
            style={{
              backgroundColor: colors.surface,
              borderRadius: r.isDesktop ? 24 : 20,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: colors.border,
              width: "100%",
              maxWidth: r.isDesktop ? 640 : undefined,
            }}
          >
            {COMPARISON_ROWS.map((row, i, arr) => {
              const colW = r.isDesktop ? 80 : r.isTablet ? 70 : 60;
              return (
                <View
                  key={row.feature}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: r.isDesktop ? 18 : 14,
                    paddingHorizontal: r.isDesktop ? 24 : 16,
                    borderBottomWidth: i < arr.length - 1 ? 1 : 0,
                    borderBottomColor: colors.border,
                    backgroundColor: i === 0 ? colors.primary + "08" : "transparent",
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      fontSize: r.fs(r.isDesktop ? 15 : 13),
                      fontWeight: "600",
                      color: colors.foreground,
                    }}
                  >
                    {row.feature}
                  </Text>
                  <View style={{ width: colW, alignItems: "center" }}>
                    <IconSymbol
                      name={row.app ? "checkmark.circle.fill" : ("xmark.circle.fill" as any)}
                      size={r.isDesktop ? 22 : 18}
                      color={row.app ? "#22C55E" : colors.muted}
                    />
                  </View>
                  <View style={{ width: colW, alignItems: "center" }}>
                    <IconSymbol
                      name={
                        row.browser
                          ? "checkmark.circle.fill"
                          : ("xmark.circle.fill" as any)
                      }
                      size={r.isDesktop ? 22 : 18}
                      color={row.browser ? "#22C55E" : colors.muted}
                    />
                  </View>
                </View>
              );
            })}
            {/* Column headers */}
            <View
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                flexDirection: "row",
                paddingTop: r.isDesktop ? 18 : 14,
              }}
            >
              <Text
                style={{
                  width: r.isDesktop ? 80 : r.isTablet ? 70 : 60,
                  textAlign: "center",
                  fontSize: r.fs(r.isDesktop ? 12 : 10),
                  fontWeight: "800",
                  color: colors.primary,
                  textTransform: "uppercase",
                }}
              >
                {t.downloadCompareApp}
              </Text>
              <Text
                style={{
                  width: r.isDesktop ? 80 : r.isTablet ? 70 : 60,
                  textAlign: "center",
                  fontSize: r.fs(r.isDesktop ? 12 : 10),
                  fontWeight: "800",
                  color: colors.muted,
                  textTransform: "uppercase",
                }}
              >
                {t.downloadCompareWeb}
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* ── Bottom CTA ───────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInDown.delay(1000).duration(500)}
          style={{
            paddingHorizontal: r.px,
            marginBottom: 20,
            alignItems: r.isDesktop ? "center" : undefined,
          }}
        >
          <LinearGradient
            colors={["#6366F1", colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: r.isDesktop ? 32 : 24,
              padding: r.isDesktop ? 48 : r.isTablet ? 36 : 28,
              alignItems: "center",
              width: "100%",
              maxWidth: r.isDesktop ? 720 : undefined,
            }}
          >
            <IconSymbol
              name="arrow.down.app.fill"
              size={r.isDesktop ? 48 : 36}
              color="rgba(255,255,255,0.9)"
            />
            <Text
              style={{
                color: "#fff",
                fontSize: r.fs(r.isDesktop ? 30 : 22),
                fontWeight: "900",
                marginTop: r.isDesktop ? 20 : 14,
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              {t.downloadBottomCTATitle}
            </Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: r.fs(r.isDesktop ? 16 : 14),
                textAlign: "center",
                marginBottom: r.isDesktop ? 32 : 24,
                lineHeight: r.fs(22),
              }}
            >
              {t.downloadBottomCTADesc}
            </Text>

            <View
              style={{
                flexDirection: r.isPhone ? "column" : "row",
                gap: 12,
                width: "100%",
                maxWidth: r.isDesktop ? 440 : undefined,
              }}
            >
              <Pressable
                onPress={() => openStore("ios")}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    backgroundColor: "#000",
                    paddingVertical: r.isDesktop ? 16 : 14,
                    borderRadius: 14,
                  },
                  pressed && { opacity: 0.85 },
                ]}
              >
                <IconSymbol name="apple.logo" size={r.fs(20)} color="#fff" />
                <Text
                  style={{ color: "#fff", fontSize: r.fs(15), fontWeight: "700" }}
                >
                  {t.downloadAppStore}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => openStore("android")}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    backgroundColor: "rgba(255,255,255,0.18)",
                    paddingVertical: r.isDesktop ? 16 : 14,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.2)",
                  },
                  pressed && { opacity: 0.85 },
                ]}
              >
                <IconSymbol name="play.fill" size={r.fs(18)} color="#fff" />
                <Text
                  style={{ color: "#fff", fontSize: r.fs(15), fontWeight: "700" }}
                >
                  {t.downloadGooglePlay}
                </Text>
              </Pressable>
            </View>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}
