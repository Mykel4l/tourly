import { useEffect } from "react";
import { View, Text, Platform } from "react-native";
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
} from "react-native-reanimated";
import { useColors } from "@/hooks/use-colors";

// ─── Animated dot for the pulsing loader ────────────────────────────────────

function PulseDot({
  delay,
  color,
  size = 8,
}: {
  delay: number;
  color: string;
  size?: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.3, 1]),
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.8, 1.3]) }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

// ─── Spinner ring ───────────────────────────────────────────────────────────

function SpinnerRing({ size = 44, color }: { size?: number; color: string }) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1200, easing: Easing.linear }),
      -1,
      false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 3,
          borderColor: color + "20",
          borderTopColor: color,
          borderRightColor: color + "60",
        },
        style,
      ]}
    />
  );
}

// ─── Logo mark ──────────────────────────────────────────────────────────────

function LogoMark({ colors, size = 56 }: { colors: any; size?: number }) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.15, 0.35]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.4]) }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.05]) }],
  }));

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Glow ring */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: size * 1.8,
            height: size * 1.8,
            borderRadius: (size * 1.8) / 2,
            backgroundColor: colors.primary,
          },
          glowStyle,
        ]}
      />
      {/* Main circle */}
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            ...Platform.select({
              ios: {
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
              },
              android: { elevation: 8 },
              default: {},
            }),
          },
          iconStyle,
        ]}
      >
        <Text style={{ fontSize: size * 0.45, color: "#FFFFFF", fontWeight: "900" }}>T</Text>
      </Animated.View>
    </View>
  );
}

// ─── Main Preloader variants ────────────────────────────────────────────────

export type PreloaderVariant = "app" | "landing" | "minimal";

interface PreloaderProps {
  /** Style variant */
  variant?: PreloaderVariant;
  /** Optional status message shown below the loader */
  message?: string;
  /** Show the "tourly" brand text */
  showBrand?: boolean;
}

/**
 * Branded preloader with multiple visual variants.
 *
 * - `app` — Full branded splash with logo, spinner, and tagline (auth gate)
 * - `landing` — Centered logo with pulse dots (landing page entrance)
 * - `minimal` — Small spinner with optional message (inline loading)
 */
export function Preloader({ variant = "app", message, showBrand = true }: PreloaderProps) {
  const colors = useColors();

  // ── App preloader (auth gate splash) ──────────────────────────────────
  if (variant === "app") {
    return (
      <Animated.View
        entering={FadeIn.duration(400)}
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
        }}
      >
        <LogoMark colors={colors} size={64} />

        {showBrand && (
          <View style={{ alignItems: "center", gap: 6 }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "900",
                color: colors.foreground,
                letterSpacing: -0.5,
              }}
            >
              tourly
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.muted,
                fontWeight: "500",
                letterSpacing: 0.3,
              }}
            >
              Your journey starts here
            </Text>
          </View>
        )}

        <View style={{ alignItems: "center", gap: 16 }}>
          <SpinnerRing size={32} color={colors.primary} />
          {message && (
            <Text style={{ fontSize: 12, color: colors.muted, fontWeight: "500" }}>
              {message}
            </Text>
          )}
        </View>
      </Animated.View>
    );
  }

  // ── Landing preloader (page entrance) ─────────────────────────────────
  if (variant === "landing") {
    return (
      <Animated.View
        entering={FadeIn.duration(300)}
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
        }}
      >
        <LogoMark colors={colors} size={72} />

        <View style={{ alignItems: "center", gap: 8 }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "900",
              color: colors.foreground,
              letterSpacing: -0.5,
            }}
          >
            tourly
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.muted,
              fontWeight: "500",
            }}
          >
            Discover the world with us
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <PulseDot delay={0} color={colors.primary} />
          <PulseDot delay={150} color={colors.primary} />
          <PulseDot delay={300} color={colors.primary} />
        </View>

        {message && (
          <Text style={{ fontSize: 12, color: colors.muted, fontWeight: "500" }}>
            {message}
          </Text>
        )}
      </Animated.View>
    );
  }

  // ── Minimal preloader (inline) ────────────────────────────────────────
  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
      }}
    >
      <SpinnerRing size={28} color={colors.primary} />
      {message && (
        <Text style={{ fontSize: 12, color: colors.muted, fontWeight: "500" }}>
          {message}
        </Text>
      )}
    </Animated.View>
  );
}

// ─── Skeleton loader primitives ─────────────────────────────────────────────

function SkeletonPulse({
  width,
  height,
  borderRadius = 8,
  style,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}) {
  const colors = useColors();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.4, 0.8]),
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: colors.border,
        },
        animStyle,
        style,
      ]}
    />
  );
}

/**
 * Skeleton layout that mimics the Home tab content.
 * Use while async data is resolving.
 */
export function HomeSkeleton() {
  const colors = useColors();
  return (
    <Animated.View entering={FadeIn.duration(300)} style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      {/* Hero card skeleton */}
      <SkeletonPulse width="100%" height={200} borderRadius={20} style={{ marginBottom: 24 }} />

      {/* Search bar skeleton */}
      <SkeletonPulse width="100%" height={48} borderRadius={14} style={{ marginBottom: 24 }} />

      {/* Section title */}
      <SkeletonPulse width={140} height={18} style={{ marginBottom: 14 }} />

      {/* Horizontal card row */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 28 }}>
        <SkeletonPulse width={160} height={190} borderRadius={16} />
        <SkeletonPulse width={160} height={190} borderRadius={16} />
        <SkeletonPulse width={160} height={190} borderRadius={16} />
      </View>

      {/* Section title */}
      <SkeletonPulse width={170} height={18} style={{ marginBottom: 14 }} />

      {/* Package cards */}
      <SkeletonPulse width="100%" height={120} borderRadius={16} style={{ marginBottom: 12 }} />
      <SkeletonPulse width="100%" height={120} borderRadius={16} style={{ marginBottom: 12 }} />
    </Animated.View>
  );
}

/**
 * Skeleton layout for the landing page hero section.
 */
export function LandingSkeleton() {
  const colors = useColors();
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={{ flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 60 }}
    >
      {/* Nav bar skeleton */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
        <SkeletonPulse width={90} height={28} borderRadius={8} />
        <View style={{ flexDirection: "row", gap: 10 }}>
          <SkeletonPulse width={70} height={32} borderRadius={10} />
          <SkeletonPulse width={70} height={32} borderRadius={10} />
        </View>
      </View>

      {/* Hero text */}
      <SkeletonPulse width="85%" height={32} style={{ marginBottom: 12 }} />
      <SkeletonPulse width="65%" height={32} style={{ marginBottom: 20 }} />
      <SkeletonPulse width="90%" height={14} style={{ marginBottom: 8 }} />
      <SkeletonPulse width="70%" height={14} style={{ marginBottom: 28 }} />

      {/* CTA buttons */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 48 }}>
        <SkeletonPulse width={140} height={48} borderRadius={14} />
        <SkeletonPulse width={140} height={48} borderRadius={14} />
      </View>

      {/* Stats row */}
      <View style={{ flexDirection: "row", gap: 16, marginBottom: 40 }}>
        <SkeletonPulse width={80} height={60} borderRadius={12} style={{ flex: 1 }} />
        <SkeletonPulse width={80} height={60} borderRadius={12} style={{ flex: 1 }} />
        <SkeletonPulse width={80} height={60} borderRadius={12} style={{ flex: 1 }} />
      </View>

      {/* Destination cards */}
      <SkeletonPulse width={160} height={18} style={{ marginBottom: 16 }} />
      <View style={{ flexDirection: "row", gap: 12 }}>
        <SkeletonPulse width={200} height={240} borderRadius={16} />
        <SkeletonPulse width={200} height={240} borderRadius={16} />
      </View>
    </Animated.View>
  );
}
