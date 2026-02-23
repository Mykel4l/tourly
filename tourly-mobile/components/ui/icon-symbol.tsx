// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navigation & layout
  "house.fill": "home",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "chevron.left.forwardslash.chevron.right": "code",
  "xmark": "close",
  "magnifyingglass": "search",
  // People & profile
  "person.fill": "person",
  "person.2.fill": "people",
  "person.crop.circle": "account-circle",
  "person.crop.circle.fill": "account-circle",
  // Notifications & communication
  "bell.fill": "notifications",
  "bell": "notifications-none",
  "paperplane.fill": "send",
  "envelope.fill": "email",
  "phone.fill": "phone",
  "bubble.left.fill": "chat-bubble",
  "bubble.left.and.bubble.right.fill": "chat",
  // Travel & maps
  "map.fill": "map",
  "suitcase.fill": "work",
  "location.fill": "location-on",
  // Media
  "photo.fill": "photo-library",
  "square.and.arrow.up": "share",
  // Ratings & status
  "star.fill": "star",
  "heart.fill": "favorite",
  "heart": "favorite-border",
  "tag": "local-offer",
  "tag.fill": "local-offer",
  "checkmark": "check",
  "checkmark.circle": "check-circle-outline",
  "checkmark.circle.fill": "check-circle",
  "exclamationmark.circle": "error-outline",
  "exclamationmark.triangle.fill": "warning",
  // Time & data
  "clock.fill": "access-time",
  "calendar": "calendar-today",
  "arrow.up.arrow.down": "swap-vert",
  "arrow.clockwise": "refresh",
  // Settings & misc
  "gear": "settings",
  "gearshape.fill": "settings",
  "bell.slash": "notifications-off",
  "bell.slash.fill": "notifications-off",
  "globe": "language",
  "moon.fill": "dark-mode",
  "sun.max.fill": "light-mode",
  "creditcard.fill": "credit-card",
  "lock.fill": "lock",
  "info.circle": "info",
  "info.circle.fill": "info",
  "trash.fill": "delete",
  // Nav mode toggle
  "pin.fill": "keep",
  "pin": "keep-off",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
