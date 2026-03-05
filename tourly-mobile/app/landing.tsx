import {
  Text,
  View,
  ScrollView,
  Pressable,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInLeft,
  SlideInRight,
} from "react-native-reanimated";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { destinations } from "@/data/destinations";
import { packages } from "@/data/packages";
import { LandingSkeleton } from "@/components/preloader";
import { useTranslation } from "@/lib/i18n";

// ─── Animated pressable helper ──────────────────────────────────────────────

// ─── Floating orb (decorative animated gradient blob) ──────────────────────
function FloatingOrb({
  size,
  color,
  top,
  left,
  delay = 0,
}: {
  size: number;
  color: string;
  top: number;
  left: number;
  delay?: number;
}) {
  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(float.value, [0, 1], [0, -20]) },
      { scale: interpolate(float.value, [0, 1], [1, 1.08]) },
    ],
    opacity: interpolate(float.value, [0, 1], [0.25, 0.4]),
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          top,
          left,
        },
        style,
      ]}
    />
  );
}

// ─── Stat card ─────────────────────────────────────────────────────────────
function StatCard({
  icon,
  value,
  label,
  colors,
  index,
}: {
  icon: string;
  value: string;
  label: string;
  colors: any;
  index: number;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(600 + index * 150).duration(700).springify()}
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          backgroundColor: colors.primary + "15",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <IconSymbol name={icon as any} size={22} color={colors.primary} />
      </View>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "800",
          color: colors.foreground,
          marginBottom: 4,
        }}
      >
        {value}
      </Text>
      <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center" }}>
        {label}
      </Text>
    </Animated.View>
  );
}

// ─── Feature card ──────────────────────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  description,
  gradient,
  colors,
  index,
}: {
  icon: string;
  title: string;
  description: string;
  gradient: [string, string];
  colors: any;
  index: number;
}) {
  return (
    <Animated.View
      entering={(index % 2 === 0 ? SlideInLeft : SlideInRight)
        .delay(200 + index * 120)
        .duration(600)
        .springify()}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: 24,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
      }}
    >
      {/* Gradient accent stripe */}
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
      />
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <LinearGradient
          colors={gradient}
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconSymbol name={icon as any} size={24} color="#fff" />
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: colors.foreground,
              marginBottom: 4,
            }}
          >
            {title}
          </Text>
          <Text style={{ fontSize: 13, color: colors.muted, lineHeight: 18 }}>
            {description}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Testimonial card ──────────────────────────────────────────────────────
function TestimonialCard({
  name,
  location,
  quote,
  rating,
  colors,
  index,
}: {
  name: string;
  location: string;
  quote: string;
  rating: number;
  colors: any;
  index: number;
}) {
  return (
    <Animated.View
      entering={FadeInUp.delay(300 + index * 150).duration(600).springify()}
      style={{
        width: 280,
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 20,
        marginRight: 16,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View style={{ flexDirection: "row", marginBottom: 8 }}>
        {Array.from({ length: rating }).map((_, i) => (
          <IconSymbol key={i} name="star.fill" size={14} color="#F59E0B" />
        ))}
      </View>
      <Text
        style={{
          fontSize: 14,
          color: colors.foreground,
          fontStyle: "italic",
          lineHeight: 20,
          marginBottom: 12,
        }}
      >
        {`\u201C${quote}\u201D`}
      </Text>
      <View>
        <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>
          {name}
        </Text>
        <Text style={{ fontSize: 12, color: colors.muted }}>{location}</Text>
      </View>
    </Animated.View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function LandingScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [ready, setReady] = useState(false);

  // Entrance preloader — show skeleton briefly then reveal
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Hero shimmer animation
  const shimmer = useSharedValue(0);
  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.7, 1, 0.7]),
  }));

  const haptic = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const FEATURES = [
    {
      icon: "sparkles",
      title: t.landingFeatureAI,
      description: t.landingFeatureAIDesc,
      gradient: ["#6366F1", "#8B5CF6"] as [string, string],
    },
    {
      icon: "map.fill",
      title: t.landingFeatureDest,
      description: t.landingFeatureDestDesc,
      gradient: ["#0EA5E9", "#06B6D4"] as [string, string],
    },
    {
      icon: "shield.lefthalf.filled",
      title: t.landingFeatureSecure,
      description: t.landingFeatureSecureDesc,
      gradient: ["#22C55E", "#10B981"] as [string, string],
    },
    {
      icon: "person.2.fill",
      title: t.landingFeatureConcierge,
      description: t.landingFeatureConciergeDesc,
      gradient: ["#F59E0B", "#EF4444"] as [string, string],
    },
  ];

  const TESTIMONIALS = [
    {
      name: t.landingTestimonial1Name,
      location: t.landingTestimonial1Location,
      quote: t.landingTestimonial1Quote,
      rating: 5,
    },
    {
      name: t.landingTestimonial2Name,
      location: t.landingTestimonial2Location,
      quote: t.landingTestimonial2Quote,
      rating: 5,
    },
    {
      name: t.landingTestimonial3Name,
      location: t.landingTestimonial3Location,
      quote: t.landingTestimonial3Quote,
      rating: 5,
    },
  ];

  if (!ready) {
    return <LandingSkeleton />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        {/* ══════════════════════════════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════════════════════════════ */}
        <View style={{ height: 560, overflow: "hidden" }}>
          <LinearGradient
            colors={["#0F172A", "#1E293B", colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, position: "relative" }}
          >
            {/* Decorative floating orbs */}
            <FloatingOrb size={200} color="#6366F1" top={-40} left={-60} delay={0} />
            <FloatingOrb size={150} color="#0EA5E9" top={100} left={width - 100} delay={800} />
            <FloatingOrb size={120} color="#8B5CF6" top={300} left={40} delay={1600} />
            <FloatingOrb
              size={100}
              color={colors.primary}
              top={200}
              left={width / 2 - 50}
              delay={400}
            />

            {/* Top bar */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 24,
                paddingTop: insets.top + 12,
              }}
            >
              <Animated.View entering={FadeIn.delay(200).duration(600)}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: "rgba(255,255,255,0.15)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconSymbol name="airplane" size={18} color="#fff" />
                  </View>
                  <Text style={{ fontSize: 22, fontWeight: "800", color: "#fff" }}>
                    {t.landingBrand}
                  </Text>
                </View>
              </Animated.View>

              <Animated.View entering={FadeIn.delay(400).duration(600)}>
                <Pressable
                  onPress={() => {
                    haptic();
                    router.push("/sign-in");
                  }}
                  style={({ pressed }) => [
                    {
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderRadius: 50,
                      borderWidth: 1.5,
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
                    Sign In
                  </Text>
                </Pressable>
              </Animated.View>
            </View>

            {/* Hero content */}
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 32,
              }}
            >
              <Animated.View
                entering={FadeInDown.delay(300).duration(800).springify()}
                style={{ alignItems: "center" }}
              >
                {/* Badge */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 50,
                    marginBottom: 20,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.15)",
                  }}
                >
                  <IconSymbol name="sparkles" size={14} color="#F59E0B" />
                  <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: "600" }}>
                    {t.landingHeroBadge}
                  </Text>
                </View>

                <Animated.Text
                  style={[
                    {
                      fontSize: 42,
                      fontWeight: "900",
                      color: "#fff",
                      textAlign: "center",
                      lineHeight: 48,
                      marginBottom: 16,
                    },
                    shimmerStyle,
                  ]}
                >
                  {t.landingHeroTitle}
                </Animated.Text>

                <Text
                  style={{
                    fontSize: 16,
                    color: "rgba(255,255,255,0.7)",
                    textAlign: "center",
                    lineHeight: 24,
                    marginBottom: 28,
                    maxWidth: 320,
                  }}
                >
                  {t.landingHeroSubtitle}
                </Text>

                {/* CTA Buttons */}
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <Pressable
                    onPress={() => {
                      haptic();
                      router.push("/sign-up");
                    }}
                    style={({ pressed }) => [
                      pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
                    ]}
                  >
                    <LinearGradient
                      colors={["#6366F1", "#8B5CF6"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        paddingHorizontal: 28,
                        paddingVertical: 14,
                        borderRadius: 50,
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
                        {t.landingCTA}
                      </Text>
                    </LinearGradient>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      haptic();
                      router.push("/about");
                    }}
                    style={({ pressed }) => [
                      {
                        paddingHorizontal: 28,
                        paddingVertical: 14,
                        borderRadius: 50,
                        backgroundColor: "rgba(255,255,255,0.12)",
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.2)",
                      },
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>
                      {t.learnMore}
                    </Text>
                  </Pressable>
                </View>
              </Animated.View>
            </View>

            {/* Bottom gradient fade */}
            <LinearGradient
              colors={["transparent", colors.background]}
              style={{ height: 60 }}
            />
          </LinearGradient>
        </View>

        {/* ══════════════════════════════════════════════════════════════════
            STATS SECTION
        ═══════════════════════════════════════════════════════════════════ */}
        <View style={{ paddingHorizontal: 20, marginTop: -10 }}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <StatCard
              icon="airplane"
              value={t.landingStatTrips}
              label={t.landingStatTripsLabel}
              colors={colors}
              index={0}
            />
            <StatCard
              icon="mappin.and.ellipse"
              value={t.landingStatDest}
              label={t.landingStatDestLabel}
              colors={colors}
              index={1}
            />
            <StatCard
              icon="star.fill"
              value={t.landingStatRating}
              label={t.landingStatRatingLabel}
              colors={colors}
              index={2}
            />
          </View>
        </View>

        {/* ══════════════════════════════════════════════════════════════════
            FEATURES SECTION
        ═══════════════════════════════════════════════════════════════════ */}
        <View style={{ paddingHorizontal: 20, marginTop: 48 }}>
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "700",
                color: colors.primary,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                marginBottom: 8,
              }}
            >
              {t.landingWhyEyebrow}
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "800",
                color: colors.foreground,
                marginBottom: 8,
              }}
            >
              {t.landingWhyTitle}
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: colors.muted,
                lineHeight: 22,
                marginBottom: 24,
                maxWidth: 340,
              }}
            >
              {t.landingWhySubtitle}
            </Text>
          </Animated.View>

          {FEATURES.map((feat, i) => (
            <FeatureCard key={feat.title} {...feat} colors={colors} index={i} />
          ))}
        </View>

        {/* ══════════════════════════════════════════════════════════════════
            POPULAR DESTINATIONS PREVIEW
        ═══════════════════════════════════════════════════════════════════ */}
        <View style={{ marginTop: 48 }}>
          <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
            <Animated.View entering={FadeInDown.delay(200).duration(600)}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: colors.primary,
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  marginBottom: 8,
                }}
              >
                {t.landingTrendingEyebrow}
              </Text>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "800",
                  color: colors.foreground,
                }}
              >
                {t.landingTrendingTitle}
              </Text>
            </Animated.View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
          >
            {destinations.map((dest, i) => (
              <Animated.View
                key={dest.id}
                entering={FadeInDown.delay(300 + i * 150).duration(600).springify()}
                style={{
                  width: 220,
                  borderRadius: 20,
                  overflow: "hidden",
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Image
                  source={dest.image}
                  style={{ width: 220, height: 160 }}
                  contentFit="cover"
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.6)"]}
                  style={{
                    position: "absolute",
                    bottom: 56,
                    left: 0,
                    right: 0,
                    height: 60,
                  }}
                />
                <View style={{ padding: 14 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "700",
                      color: colors.foreground,
                      marginBottom: 4,
                    }}
                  >
                    {dest.name}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <IconSymbol
                      name="mappin.and.ellipse"
                      size={12}
                      color={colors.muted}
                    />
                    <Text style={{ fontSize: 12, color: colors.muted }}>
                      {dest.country}
                    </Text>
                    <View style={{ flex: 1 }} />
                    <IconSymbol name="star.fill" size={12} color="#F59E0B" />
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.foreground,
                        fontWeight: "600",
                      }}
                    >
                      {dest.rating}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* ══════════════════════════════════════════════════════════════════
            PACKAGES PREVIEW
        ═══════════════════════════════════════════════════════════════════ */}
        <View style={{ paddingHorizontal: 20, marginTop: 48 }}>
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "700",
                color: colors.primary,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                marginBottom: 8,
              }}
            >
              {t.landingCuratedEyebrow}
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "800",
                color: colors.foreground,
                marginBottom: 20,
              }}
            >
              {t.landingCuratedTitle}
            </Text>
          </Animated.View>

          {packages.slice(0, 3).map((pkg, i) => (
            <Animated.View
              key={pkg.id}
              entering={FadeInDown.delay(300 + i * 150).duration(600).springify()}
              style={{
                flexDirection: "row",
                backgroundColor: colors.surface,
                borderRadius: 20,
                overflow: "hidden",
                marginBottom: 16,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Image
                source={pkg.image}
                style={{ width: 110, height: 120 }}
                contentFit="cover"
              />
              <View style={{ flex: 1, padding: 14, justifyContent: "center" }}>
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: colors.foreground,
                    marginBottom: 6,
                  }}
                >
                  {pkg.title}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 6 }}>
                  <IconSymbol name="mappin.and.ellipse" size={12} color={colors.muted} />
                  <Text style={{ fontSize: 12, color: colors.muted }}>{pkg.location}</Text>
                  <Text style={{ fontSize: 12, color: colors.muted }}>• {pkg.duration}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: colors.primary }}>
                    ${pkg.price}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                    <IconSymbol name="star.fill" size={12} color="#F59E0B" />
                    <Text
                      style={{ fontSize: 12, color: colors.foreground, fontWeight: "600" }}
                    >
                      {pkg.rating}
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* ══════════════════════════════════════════════════════════════════
            TESTIMONIALS SECTION
        ═══════════════════════════════════════════════════════════════════ */}
        <View style={{ marginTop: 48 }}>
          <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
            <Animated.View entering={FadeInDown.delay(200).duration(600)}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: colors.primary,
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  marginBottom: 8,
                }}
              >
                {t.landingTestimonialsEyebrow}
              </Text>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "800",
                  color: colors.foreground,
                }}
              >
                {t.landingTestimonialsTitle}
              </Text>
            </Animated.View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {TESTIMONIALS.map((item, i) => (
              <TestimonialCard key={item.name} {...item} colors={colors} index={i} />
            ))}
          </ScrollView>
        </View>

        {/* ══════════════════════════════════════════════════════════════════
            CTA BANNER
        ═══════════════════════════════════════════════════════════════════ */}
        <View style={{ paddingHorizontal: 20, marginTop: 48 }}>
          <Animated.View entering={FadeInUp.delay(200).duration(700).springify()}>
            <LinearGradient
              colors={["#6366F1", "#8B5CF6", "#A855F7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 28,
                padding: 32,
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              {/* Background decorative circles */}
              <View
                style={{
                  position: "absolute",
                  width: 200,
                  height: 200,
                  borderRadius: 100,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  top: -60,
                  right: -40,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  bottom: -30,
                  left: -20,
                }}
              />

              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  backgroundColor: "rgba(255,255,255,0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <IconSymbol name="airplane" size={26} color="#fff" />
              </View>

              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "800",
                  color: "#fff",
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                {t.landingReadyCTA}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.8)",
                  textAlign: "center",
                  lineHeight: 20,
                  marginBottom: 24,
                  maxWidth: 280,
                }}
              >
                {t.landingReadyDesc}
              </Text>

              <Pressable
                onPress={() => {
                  haptic();
                  router.push("/sign-up");
                }}
                style={({ pressed }) => [
                  {
                    backgroundColor: "#fff",
                    paddingHorizontal: 32,
                    paddingVertical: 14,
                    borderRadius: 50,
                  },
                  pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
                ]}
              >
                <Text style={{ color: "#6366F1", fontWeight: "700", fontSize: 15 }}>
                  {t.landingCreateAccount}
                </Text>
              </Pressable>
            </LinearGradient>
          </Animated.View>
        </View>

        {/* ══════════════════════════════════════════════════════════════════
            FOOTER
        ═══════════════════════════════════════════════════════════════════ */}
        <View
          style={{
            marginTop: 48,
            paddingHorizontal: 20,
            paddingVertical: 32,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            alignItems: "center",
          }}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: colors.primary + "15",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconSymbol name="airplane" size={16} color={colors.primary} />
            </View>
            <Text style={{ fontSize: 18, fontWeight: "800", color: colors.foreground }}>
              {t.landingBrand}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 13,
              color: colors.muted,
              textAlign: "center",
              lineHeight: 20,
              marginBottom: 16,
              maxWidth: 300,
            }}
          >
            {t.landingFooterTagline}
          </Text>
          <View style={{ flexDirection: "row", gap: 24, marginBottom: 16 }}>
            <Pressable onPress={() => router.push("/about")}>
              <Text style={{ fontSize: 13, color: colors.primary, fontWeight: "600" }}>
                {t.landingFooterAbout}
              </Text>
            </Pressable>
            <Pressable onPress={() => router.push("/contact")}>
              <Text style={{ fontSize: 13, color: colors.primary, fontWeight: "600" }}>
                {t.landingFooterContact}
              </Text>
            </Pressable>
            <Pressable onPress={() => router.push("/deals")}>
              <Text style={{ fontSize: 13, color: colors.primary, fontWeight: "600" }}>
                {t.landingFooterDeals}
              </Text>
            </Pressable>
          </View>
          <Text style={{ fontSize: 12, color: colors.muted }}>
            {t.landingFooterCopyright}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
