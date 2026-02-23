import { Text, View } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTranslation } from "@/lib/i18n";

type BadgeVariant = "featured" | "sponsored" | "trending";

interface FeaturedBadgeProps {
  variant: BadgeVariant;
  compact?: boolean;
}

const BADGE_STYLES: Record<BadgeVariant, { bg: string; color: string; icon: string }> = {
  featured: { bg: "#6366F1", color: "white", icon: "star.fill" },
  sponsored: { bg: "#F59E0B", color: "white", icon: "megaphone.fill" },
  trending: { bg: "#EF4444", color: "white", icon: "flame.fill" },
};

export function FeaturedBadge({ variant, compact = false }: FeaturedBadgeProps) {
  const { t } = useTranslation();
  const style = BADGE_STYLES[variant];

  const labelMap: Record<BadgeVariant, string> = {
    featured: t.featuredBadge,
    sponsored: t.sponsoredBadge,
    trending: t.trendingBadge,
  };

  if (compact) {
    return (
      <View
        style={{
          backgroundColor: style.bg,
          borderRadius: 6,
          paddingHorizontal: 6,
          paddingVertical: 2,
        }}
      >
        <IconSymbol name={style.icon as any} size={10} color={style.color} />
      </View>
    );
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: style.bg,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
      }}
    >
      <IconSymbol name={style.icon as any} size={11} color={style.color} />
      <Text style={{ color: style.color, fontSize: 11, fontWeight: "700" }}>
        {labelMap[variant]}
      </Text>
    </View>
  );
}
