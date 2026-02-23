import { ScrollView, Text, View, ImageBackground, TextInput, Pressable, Dimensions, Alert } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { destinations } from "@/data/destinations";
import { packages } from "@/data/packages";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const colors = useColors();
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
      Alert.alert("Please Enter Destination", "Enter a destination to submit your inquiry.");
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
            style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24, paddingTop: 60 }}
          >
            {/* Search Button */}
            <Pressable
              onPress={handleSearch}
              style={({ pressed }) => [
                { 
                  position: "absolute", 
                  top: 50, 
                  right: 20, 
                  backgroundColor: "rgba(255,255,255,0.2)",
                  padding: 12,
                  borderRadius: 50,
                },
                pressed && { opacity: 0.7 }
              ]}
            >
              <IconSymbol name="magnifyingglass" size={22} color="white" />
            </Pressable>

            <Text className="text-white text-4xl font-bold text-center mb-4" style={{ fontFamily: "System" }}>
              Journey to{"\n"}Explore World
            </Text>
            <Text className="text-white/80 text-base text-center mb-6 px-4">
              Discover amazing destinations and create unforgettable memories with Tourly
            </Text>
            <View className="flex-row gap-3">
              <Pressable
                onPress={handleLearnMore}
                style={({ pressed }) => [
                  { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 50 },
                  pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }
                ]}
              >
                <Text className="text-white font-semibold">Learn More</Text>
              </Pressable>
              <Pressable
                onPress={handleBookNow}
                style={({ pressed }) => [
                  { borderWidth: 2, borderColor: "white", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 50 },
                  pressed && { opacity: 0.8 }
                ]}
              >
                <Text className="text-white font-semibold">Book Now</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Search Section */}
        <View className="bg-primary mx-4 -mt-8 rounded-2xl p-5 shadow-lg" style={{ backgroundColor: colors.primary }}>
          <Text className="text-white text-lg font-bold mb-4">Find Your Trip</Text>
          
          <Pressable 
            onPress={handleSearch}
            style={{ marginBottom: 12 }}
          >
            <View className="bg-white rounded-full px-4 py-3 flex-row items-center">
              <IconSymbol name="magnifyingglass" size={20} color={colors.muted} />
              <TextInput
                placeholder="Enter Destination"
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
              placeholder="Number of Travelers"
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
            <Text className="font-bold" style={{ color: colors.primary }}>Inquire Now</Text>
          </Pressable>
        </View>

        {/* Popular Destinations Section */}
        <View className="mt-8 px-4">
          <Text className="text-primary text-sm font-semibold uppercase mb-1" style={{ color: colors.primary }}>
            Uncover Place
          </Text>
          <Text className="text-foreground text-2xl font-bold mb-2" style={{ color: colors.foreground }}>
            Popular Destinations
          </Text>
          <Text className="text-muted text-sm mb-5" style={{ color: colors.muted }}>
            Explore our most visited destinations around the world
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

        {/* Featured Packages Preview */}
        <View className="mt-8 px-4">
          <Text className="text-primary text-sm font-semibold uppercase mb-1" style={{ color: colors.primary }}>
            Popular Packages
          </Text>
          <Text className="text-foreground text-2xl font-bold mb-2" style={{ color: colors.foreground }}>
            Checkout Our Packages
          </Text>
          <Text className="text-muted text-sm mb-5" style={{ color: colors.muted }}>
            Find the perfect travel package for your next adventure
          </Text>

          {packages.slice(0, 2).map((pkg) => (
            <Pressable 
              key={pkg.id}
              onPress={() => handlePackagePress(pkg.id)}
              style={({ pressed }) => [pressed && { opacity: 0.95 }]}
            >
              <View 
                className="bg-surface rounded-2xl mb-4 overflow-hidden shadow-sm"
                style={{ backgroundColor: colors.surface }}
              >
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
                      <Text className="text-muted text-xs" style={{ color: colors.muted }}>pax: {pkg.maxPax}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <IconSymbol name="location.fill" size={14} color={colors.muted} />
                      <Text className="text-muted text-xs" style={{ color: colors.muted }}>{pkg.location}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-foreground text-xl font-bold" style={{ color: colors.foreground }}>
                        ${pkg.price}
                        <Text className="text-muted text-sm font-normal" style={{ color: colors.muted }}> / per person</Text>
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => handlePackageBook(pkg)}
                      style={({ pressed }) => [
                        { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 50 },
                        pressed && { opacity: 0.9 }
                      ]}
                    >
                      <Text className="text-white font-semibold text-sm">Book Now</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* CTA Section */}
        <View className="mt-4 mx-4 bg-primary rounded-2xl p-6" style={{ backgroundColor: colors.primary }}>
          <Text className="text-white/80 text-sm uppercase mb-2">Call To Action</Text>
          <Text className="text-white text-xl font-bold mb-3">
            Ready For Unforgettable Travel?
          </Text>
          <Text className="text-white/80 text-sm mb-4">
            Contact us today and let us help you plan your dream vacation!
          </Text>
          <Pressable
            onPress={handleContact}
            style={({ pressed }) => [
              { borderWidth: 2, borderColor: "white", paddingVertical: 12, borderRadius: 50, alignItems: "center" },
              pressed && { backgroundColor: "rgba(255,255,255,0.1)" }
            ]}
          >
            <Text className="text-white font-semibold">Contact Us</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
