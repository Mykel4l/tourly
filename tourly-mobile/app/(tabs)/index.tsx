import { ScrollView, Text, View, ImageBackground, TextInput, Pressable, Alert, useWindowDimensions, Platform } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { destinations } from "@/data/destinations";
import { packages } from "@/data/packages";
import { useNotifications, useWishlist } from "@/lib/store";
import { useTranslation } from "@/lib/i18n";
import { useCurrency } from "@/lib/currency";

export default function HomeScreen() {
  const colors = useColors();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { unreadCount } = useNotifications();
  const { toggle, isSaved } = useWishlist();
  const { t } = useTranslation();
  const { format } = useCurrency();
  const [destination, setDestination] = useState("");
  const [travelers, setTravelers] = useState("");

  const handleInquire = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (destination.trim()) {
      router.push({
        pathname: "/booking",
        params: { packageName: destination }
      });
    } else {
      Alert.alert(t.enterDestination, t.searchPlaceholder);
    }
  };

  const handleLearnMore = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/about");
  };

  const handleBookNow = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/booking");
  };

  const handleContact = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/contact");
  };

  const handleSearch = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/search");
  };

  const handleDestinationPress = (destId: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/destination/${destId}`);
  };

  const handlePackagePress = (pkgId: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/package/${pkgId}`);
  };

  const handlePackageBook = (pkg: typeof packages[0]) => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    router.push({
      pathname: "/booking",
      params: { packageName: pkg.title, price: pkg.price.toString() }
    });
  };

  return (
    <ScreenContainer edges={["left", "right"]}>
      {/* ── Fixed hero icons ── stay on screen while scrolling ── */}
      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          top: insets.top + 12,
          left: 0,
          right: 0,
          zIndex: 50,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 20,
        }}
      >
        {/* Profile Button */}
        <Pressable
          onPress={() => router.push("/profile")}
          style={({ pressed }) => [
            {
              backgroundColor: "rgba(255,255,255,0.2)",
              padding: 12,
              borderRadius: 50,
            },
            pressed && { opacity: 0.7 },
          ]}
        >
          <IconSymbol name="person.fill" size={22} color="white" />
        </Pressable>

        <View style={{ flexDirection: "row", gap: 8 }}>
          {/* Bell / Notifications Button */}
          <Pressable
            onPress={() => router.push("/notifications")}
            style={({ pressed }) => [
              {
                backgroundColor: "rgba(255,255,255,0.2)",
                padding: 12,
                borderRadius: 50,
              },
              pressed && { opacity: 0.7 },
            ]}
          >
            <IconSymbol name="bell.fill" size={22} color="white" />
            {unreadCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: colors.error,
                  borderWidth: 1.5,
                  borderColor: "transparent",
                }}
              />
            )}
          </Pressable>

          {/* Search Button */}
          <Pressable
            onPress={handleSearch}
            style={({ pressed }) => [
              {
                backgroundColor: "rgba(255,255,255,0.2)",
                padding: 12,
                borderRadius: 50,
              },
              pressed && { opacity: 0.7 },
            ]}
          >
            <IconSymbol name="magnifyingglass" size={22} color="white" />
          </Pressable>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Hero Section */}
        <ImageBackground
          source={require("@/assets/images/hero-banner.jpg")}
          style={{ width: "100%", height: 420 }}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.7)"]}
            style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24, paddingTop: insets.top + 20 }}
          >

            <Text className="text-white text-4xl font-bold text-center mb-4" style={{ fontFamily: "System" }}>
              {t.heroTitle}
            </Text>
            <Text className="text-white/80 text-base text-center mb-6 px-4">
              {t.heroSubtitle}
            </Text>
            <View className="flex-row gap-3">
              <Pressable
                onPress={handleLearnMore}
                style={({ pressed }) => [
                  { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 50 },
                  pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }
                ]}
              >
                <Text className="text-white font-semibold">{t.learnMore}</Text>
              </Pressable>
              <Pressable
                onPress={handleBookNow}
                style={({ pressed }) => [
                  { borderWidth: 2, borderColor: "white", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 50 },
                  pressed && { opacity: 0.8 }
                ]}
              >
                <Text className="text-white font-semibold">{t.bookNow}</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Search Section */}
        <View className="bg-primary mx-4 -mt-8 rounded-2xl p-5 shadow-lg" style={{ backgroundColor: colors.primary }}>
          <Text className="text-white text-lg font-bold mb-4">{t.findYourTrip}</Text>
          
          <Pressable 
            onPress={handleSearch}
            style={{ marginBottom: 12 }}
          >
            <View className="bg-white rounded-full px-4 py-3 flex-row items-center">
              <IconSymbol name="magnifyingglass" size={20} color={colors.muted} />
              <TextInput
                placeholder={t.enterDestination}
                placeholderTextColor={colors.muted}
                value={destination}
                onChangeText={setDestination}
                className="flex-1 ml-3 text-foreground"
                style={{ color: colors.foreground }}
              />
            </View>
          </Pressable>

          <View className="bg-white rounded-full px-4 py-3 mb-4 flex-row items-center">
            <IconSymbol name="person.2.fill" size={20} color={colors.muted} />
            <TextInput
              placeholder={t.numberOfTravelers}
              placeholderTextColor={colors.muted}
              value={travelers}
              onChangeText={setTravelers}
              keyboardType="number-pad"
              className="flex-1 ml-3"
              style={{ color: colors.foreground }}
            />
          </View>

          <Pressable
            onPress={handleInquire}
            style={({ pressed }) => [
              { backgroundColor: "white", paddingVertical: 14, borderRadius: 50, alignItems: "center" },
              pressed && { opacity: 0.9 }
            ]}
          >
            <Text className="font-bold" style={{ color: colors.primary }}>{t.inquireNow}</Text>
          </Pressable>
        </View>

        {/* Popular Destinations Section */}
        <View className="mt-8 px-4">
          <Text className="text-primary text-sm font-semibold uppercase mb-1" style={{ color: colors.primary }}>
            {t.uncoverPlace}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <Text className="text-foreground text-2xl font-bold" style={{ color: colors.foreground }}>
              {t.popularDestinations}
            </Text>
            <Pressable
              onPress={() => router.push("/(tabs)/destinations")}
              style={({ pressed }) => [pressed && { opacity: 0.7 }]}
            >
              <Text style={{ color: colors.primary, fontSize: 13, fontWeight: "600" }}>{t.viewAll}</Text>
            </Pressable>
          </View>
          <Text className="text-muted text-sm mb-5" style={{ color: colors.muted }}>
            {t.popularDestinationsSubtitle}
          </Text>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
          >
            {destinations.map((dest) => (
              <Pressable
                key={dest.id}
                onPress={() => handleDestinationPress(dest.id)}
                style={({ pressed }) => [
                  { width: width * 0.7, height: 280, borderRadius: 25, overflow: "hidden" },
                  pressed && { opacity: 0.9 }
                ]}
              >
                <Image
                  source={dest.image}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
                <View className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl p-4">
                  <View 
                    className="absolute -top-4 right-4 flex-row items-center px-3 py-1 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {[...Array(dest.rating)].map((_, i) => (
                      <IconSymbol key={i} name="star.fill" size={12} color="white" />
                    ))}
                  </View>
                  <Text className="text-primary text-xs uppercase" style={{ color: colors.primary }}>
                    {dest.country}
                  </Text>
                  <Text className="text-foreground text-lg font-bold" style={{ color: colors.foreground }}>
                    {dest.name}
                  </Text>
                  <Text className="text-muted text-xs mt-1" style={{ color: colors.muted }} numberOfLines={2}>
                    {dest.description}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Deals Banner */}
        <Pressable
          onPress={() => router.push("/deals")}
          style={({ pressed }) => [
            {
              marginHorizontal: 16,
              marginTop: 28,
              backgroundColor: colors.error,
              borderRadius: 20,
              padding: 18,
              flexDirection: "row",
              alignItems: "center",
            },
            pressed && { opacity: 0.9 },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: "white", fontSize: 11, fontWeight: "700", textTransform: "uppercase", marginBottom: 4 }}>
              {t.limitedTime}
            </Text>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "800", marginBottom: 4 }}>
              {t.dealsTitle}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>{t.dealsSubtitle}</Text>
          </View>
          <IconSymbol name="chevron.right" size={24} color="rgba(255,255,255,0.7)" />
        </Pressable>

        {/* Featured Packages Preview */}
        <View className="mt-8 px-4">
          <Text className="text-primary text-sm font-semibold uppercase mb-1" style={{ color: colors.primary }}>
            {t.popularPackages}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <Text className="text-foreground text-2xl font-bold" style={{ color: colors.foreground }}>
              {t.checkoutPackages}
            </Text>
            <Pressable
              onPress={() => router.push("/(tabs)/packages")}
              style={({ pressed }) => [pressed && { opacity: 0.7 }]}
            >
              <Text style={{ color: colors.primary, fontSize: 13, fontWeight: "600" }}>{t.viewAll}</Text>
            </Pressable>
          </View>
          <Text className="text-muted text-sm mb-5" style={{ color: colors.muted }}>
            {t.packagesSubtitle}
          </Text>

          {packages.slice(0, 2).map((pkg) => (
            <Pressable 
              key={pkg.id}
              onPress={() => handlePackagePress(pkg.id)}
              style={({ pressed }) => [pressed && { opacity: 0.95 }]}
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
                  source={pkg.image}
                  style={{ width: "100%", height: 180 }}
                  contentFit="cover"
                />
                <View className="p-4">
                  <Text className="text-foreground text-lg font-bold mb-2" style={{ color: colors.foreground }}>
                    {pkg.title}
                  </Text>
                  <Text className="text-muted text-sm mb-3" style={{ color: colors.muted }} numberOfLines={2}>
                    {pkg.description}
                  </Text>
                  <View className="flex-row items-center gap-4 mb-3">
                    <View className="flex-row items-center gap-1">
                      <IconSymbol name="clock.fill" size={14} color={colors.muted} />
                      <Text className="text-muted text-xs" style={{ color: colors.muted }}>{pkg.duration}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <IconSymbol name="person.2.fill" size={14} color={colors.muted} />
                      <Text className="text-muted text-xs" style={{ color: colors.muted }}>{t.maxPax}: {pkg.maxPax}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <IconSymbol name="location.fill" size={14} color={colors.muted} />
                      <Text className="text-muted text-xs" style={{ color: colors.muted }}>{pkg.location}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-foreground text-xl font-bold" style={{ color: colors.foreground }}>
                        {format(pkg.price)}
                        <Text className="text-muted text-sm font-normal" style={{ color: colors.muted }}> {t.perPerson}</Text>
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                      <Pressable
                        onPress={() => toggle({ id: pkg.id, type: "package", name: pkg.title, image: pkg.image, subtitle: `${format(pkg.price)} ${t.perPerson}` })}
                        style={({ pressed }) => [
                          {
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: isSaved(pkg.id, "package") ? colors.error : "white",
                            borderWidth: 2,
                            borderColor: colors.error,
                            shadowColor: colors.error,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: isSaved(pkg.id, "package") ? 0.35 : 0.12,
                            shadowRadius: 4,
                            elevation: isSaved(pkg.id, "package") ? 4 : 2,
                          },
                          pressed && { transform: [{ scale: 0.88 }] },
                        ]}
                      >
                        <IconSymbol
                          name={isSaved(pkg.id, "package") ? "heart.fill" : "heart"}
                          size={17}
                          color={isSaved(pkg.id, "package") ? "white" : colors.error}
                        />
                      </Pressable>
                      <Pressable
                        onPress={() => handlePackageBook(pkg)}
                        style={({ pressed }) => [
                          { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 50 },
                          pressed && { opacity: 0.9 }
                        ]}
                      >
                        <Text className="text-white font-semibold text-sm">{t.bookNow}</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* CTA Section */}
        <View className="mt-4 mx-4 bg-primary rounded-2xl p-6" style={{ backgroundColor: colors.primary }}>
          <Text className="text-white/80 text-sm uppercase mb-2">{t.callToAction}</Text>
          <Text className="text-white text-xl font-bold mb-3">
            {t.readyForTravel}
          </Text>
          <Text className="text-white/80 text-sm mb-4">
            {t.ctaDescription}
          </Text>
          <Pressable
            onPress={handleContact}
            style={({ pressed }) => [
              { borderWidth: 2, borderColor: "white", paddingVertical: 12, borderRadius: 50, alignItems: "center" },
              pressed && { backgroundColor: "rgba(255,255,255,0.1)" }
            ]}
          >
            <Text className="text-white font-semibold">{t.contactUs}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
