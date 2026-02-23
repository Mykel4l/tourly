import { Text, View, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/lib/i18n";
import { TopNavBar } from "@/components/top-nav-bar";

export default function AboutScreen() {
  const colors = useColors();
  const { t } = useTranslation();

  const stats = [
    { number: "500+", label: t.happyTravelers },
    { number: "100+", label: t.destinationLabel },
    { number: "50+", label: t.tourPackages },
    { number: "24/7", label: t.supportUs },
  ];

  const features = [
    {
      icon: "star.fill" as const,
      title: t.featureBestPrice,
      description: t.featureBestPriceDesc,
    },
    {
      icon: "location.fill" as const,
      title: t.featureHandpicked,
      description: t.featureHandpickedDesc,
    },
    {
      icon: "person.2.fill" as const,
      title: t.featureExpertGuides,
      description: t.featureExpertGuidesDesc,
    },
    {
      icon: "clock.fill" as const,
      title: t.featureFlexibleBooking,
      description: t.featureFlexibleBookingDesc,
    },
  ];

  return (
    <ScreenContainer className="px-4" edges={["left", "right"]}>
      <TopNavBar title={t.aboutPageTitle} showBack />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8 }}>

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
            {t.whoWeAre}
          </Text>
          <Text 
            className="text-2xl font-bold mb-4" 
            style={{ color: colors.foreground }}
          >
            {t.trustedTravelPartner}
          </Text>
          <Text 
            className="text-base leading-relaxed mb-4" 
            style={{ color: colors.muted }}
          >
            {t.aboutParagraph1}
          </Text>
          <Text 
            className="text-base leading-relaxed" 
            style={{ color: colors.muted }}
          >
            {t.aboutParagraph2}
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
            {t.whyChooseUs}
          </Text>
          <Text 
            className="text-2xl font-bold mb-4" 
            style={{ color: colors.foreground }}
          >
            {t.whatMakesDifferent}
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
            {t.ourMission}
          </Text>
          <Text 
            className="text-base leading-relaxed" 
            style={{ color: colors.muted }}
          >
            {t.missionStatement}
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
