import { Text, View, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function AboutScreen() {
  const colors = useColors();

  const handleBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const stats = [
    { number: "500+", label: "Happy Travelers" },
    { number: "100+", label: "Destinations" },
    { number: "50+", label: "Tour Packages" },
    { number: "24/7", label: "Support" },
  ];

  const features = [
    {
      icon: "star.fill" as const,
      title: "Best Price Guarantee",
      description: "We offer the best prices for all our travel packages with no hidden fees.",
    },
    {
      icon: "location.fill" as const,
      title: "Handpicked Destinations",
      description: "Our experts carefully select the most beautiful and unique destinations.",
    },
    {
      icon: "person.2.fill" as const,
      title: "Expert Guides",
      description: "Professional local guides who know every corner of the destination.",
    },
    {
      icon: "clock.fill" as const,
      title: "Flexible Booking",
      description: "Easy booking process with flexible cancellation policies.",
    },
  ];

  return (
    <ScreenContainer className="px-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center pt-4 pb-6">
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [
              { padding: 8, marginLeft: -8 },
              pressed && { opacity: 0.7 }
            ]}
          >
            <IconSymbol name="chevron.right" size={24} color={colors.foreground} style={{ transform: [{ rotate: '180deg' }] }} />
          </Pressable>
          <Text 
            className="text-2xl font-bold ml-2" 
            style={{ color: colors.foreground }}
          >
            About Us
          </Text>
        </View>

        {/* Hero Section */}
        <View className="rounded-2xl overflow-hidden mb-6">
          <Image
            source={require("@/assets/images/hero-banner.jpg")}
            style={{ width: "100%", height: 200 }}
            contentFit="cover"
          />
        </View>

        {/* About Text */}
        <View className="mb-6">
          <Text 
            className="text-sm font-semibold uppercase mb-2" 
            style={{ color: colors.primary }}
          >
            Who We Are
          </Text>
          <Text 
            className="text-2xl font-bold mb-4" 
            style={{ color: colors.foreground }}
          >
            Your Trusted Travel Partner
          </Text>
          <Text 
            className="text-base leading-relaxed mb-4" 
            style={{ color: colors.muted }}
          >
            Tourly is a premier travel agency dedicated to creating unforgettable travel experiences. 
            With years of expertise in the travel industry, we specialize in crafting personalized 
            journeys that cater to your unique preferences and desires.
          </Text>
          <Text 
            className="text-base leading-relaxed" 
            style={{ color: colors.muted }}
          >
            Our team of passionate travel experts works tirelessly to ensure every aspect of your 
            trip is perfect, from selecting the ideal destinations to arranging comfortable 
            accommodations and exciting activities.
          </Text>
        </View>

        {/* Stats */}
        <View 
          className="flex-row flex-wrap rounded-2xl p-4 mb-6"
          style={{ backgroundColor: colors.primary }}
        >
          {stats.map((stat, index) => (
            <View key={index} className="w-1/2 items-center py-4">
              <Text className="text-white text-2xl font-bold">{stat.number}</Text>
              <Text className="text-white/80 text-sm">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Why Choose Us */}
        <View className="mb-8">
          <Text 
            className="text-sm font-semibold uppercase mb-2" 
            style={{ color: colors.primary }}
          >
            Why Choose Us
          </Text>
          <Text 
            className="text-2xl font-bold mb-4" 
            style={{ color: colors.foreground }}
          >
            What Makes Us Different
          </Text>

          {features.map((feature, index) => (
            <View 
              key={index}
              className="flex-row items-start p-4 rounded-xl mb-3"
              style={{ backgroundColor: colors.surface }}
            >
              <View 
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: colors.primary }}
              >
                <IconSymbol name={feature.icon} size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text 
                  className="text-base font-bold mb-1" 
                  style={{ color: colors.foreground }}
                >
                  {feature.title}
                </Text>
                <Text 
                  className="text-sm" 
                  style={{ color: colors.muted }}
                >
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Mission Statement */}
        <View 
          className="rounded-2xl p-6 mb-8"
          style={{ backgroundColor: colors.surface }}
        >
          <Text 
            className="text-lg font-bold mb-3" 
            style={{ color: colors.foreground }}
          >
            Our Mission
          </Text>
          <Text 
            className="text-base leading-relaxed" 
            style={{ color: colors.muted }}
          >
            To inspire and enable people to explore the world by providing exceptional travel 
            experiences that create lasting memories. We believe travel has the power to transform 
            lives, broaden perspectives, and connect people across cultures.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
