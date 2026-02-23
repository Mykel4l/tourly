import { View, Pressable, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  color?: string;
}

export function StarRating({
  rating,
  maxStars = 5,
  size = 20,
  interactive = false,
  onChange,
  color,
}: StarRatingProps) {
  const colors = useColors();
  const starColor = color || colors.primary;

  const handlePress = (index: number) => {
    if (!interactive || !onChange) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onChange(index + 1);
  };

  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      {Array.from({ length: maxStars }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const halfFilled = !filled && i < rating;

        const star = (
          <IconSymbol
            name={filled ? "star.fill" : halfFilled ? "star.leadinghalf.filled" : "star"}
            size={size}
            color={filled || halfFilled ? starColor : colors.border}
          />
        );

        if (interactive) {
          return (
            <Pressable
              key={i}
              onPress={() => handlePress(i)}
              hitSlop={4}
              style={({ pressed }) => pressed && { opacity: 0.7 }}
            >
              {star}
            </Pressable>
          );
        }

        return <View key={i}>{star}</View>;
      })}
    </View>
  );
}
