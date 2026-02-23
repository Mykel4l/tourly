import { Text, View, ScrollView, Pressable, Switch } from "react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useState } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useThemeContext } from "@/lib/theme-provider";
import { useTranslation, LANGUAGES, type Language } from "@/lib/i18n";
import { useCurrency, CURRENCIES as CURRENCY_LIST } from "@/lib/currency";
import { PickerModal } from "@/components/picker-modal";
import { TopNavBar } from "@/components/top-nav-bar";

export default function SettingsScreen() {
  const colors = useColors();
  const { colorScheme, setColorScheme } = useThemeContext();
  const isDark = colorScheme === "dark";
  const { t, language, setLanguage: setI18nLanguage } = useTranslation();
  const { currency, setCurrency } = useCurrency();

  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  const toggleTheme = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setColorScheme(isDark ? "light" : "dark");
  };

  return (
    <ScreenContainer className="px-4" edges={["left", "right"]}>
      <TopNavBar title={t.settingsTitle} showBack />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8 }}>

        {/* Appearance */}
        <Text
          style={{
            color: colors.muted,
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
            marginBottom: 10,
            letterSpacing: 0.8,
          }}
        >
          {t.darkMode}
        </Text>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 24,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 18,
              paddingVertical: 16,
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: colors.primary + "18",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
              }}
            >
              <IconSymbol
                name={isDark ? "moon.fill" : "sun.max.fill"}
                size={18}
                color={colors.primary}
              />
            </View>
            <Text style={{ flex: 1, color: colors.foreground, fontSize: 15, fontWeight: "500" }}>
              {t.darkMode}
            </Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="white"
            />
          </View>
        </View>

        {/* Currency */}
        <Text
          style={{
            color: colors.muted,
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
            marginBottom: 10,
            letterSpacing: 0.8,
          }}
        >
          {t.currency}
        </Text>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 24,
          }}
        >
          <Pressable
            onPress={() => setShowCurrencyPicker(true)}
            style={({ pressed }) => [
              { flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 16 },
              pressed && { backgroundColor: colors.border + "40" },
            ]}
          >
            <Text style={{ flex: 1, color: colors.foreground, fontSize: 15, fontWeight: "500" }}>
              {currency}
            </Text>
            <IconSymbol name="chevron.right" size={16} color={colors.muted} />
          </Pressable>
        </View>
        <PickerModal
          visible={showCurrencyPicker}
          onClose={() => setShowCurrencyPicker(false)}
          title={t.currency}
          options={CURRENCY_LIST.map((c) => ({ value: c.code, label: `${c.symbol}  ${c.code} — ${c.label}` }))}
          selectedValue={currency}
          onSelect={(v) => setCurrency(v as any)}
        />

        {/* Language */}
        <Text
          style={{
            color: colors.muted,
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
            marginBottom: 10,
            letterSpacing: 0.8,
          }}
        >
          {t.language}
        </Text>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 24,
          }}
        >
          <Pressable
            onPress={() => setShowLanguagePicker(true)}
            style={({ pressed }) => [
              { flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 16 },
              pressed && { backgroundColor: colors.border + "40" },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "500" }}>
                {LANGUAGES.find((l) => l.code === language)?.nativeLabel ?? language}
              </Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>
                {LANGUAGES.find((l) => l.code === language)?.label ?? language}
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={16} color={colors.muted} />
          </Pressable>
        </View>
        <PickerModal
          visible={showLanguagePicker}
          onClose={() => setShowLanguagePicker(false)}
          title={t.language}
          options={LANGUAGES.map((l) => ({ value: l.code, label: l.nativeLabel, sublabel: l.label }))}
          selectedValue={language}
          onSelect={(v) => setI18nLanguage(v as Language)}
        />

        {/* Notifications */}
        <Text
          style={{
            color: colors.muted,
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
            marginBottom: 10,
            letterSpacing: 0.8,
          }}
        >
          {t.notificationsTitle}
        </Text>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 32,
          }}
        >
          {[
            {
              icon: "bell.fill" as const,
              label: t.pushNotifications,
              value: pushNotifications,
              onChange: setPushNotifications,
            },
            {
              icon: "envelope.fill" as const,
              label: t.emailNotifications,
              value: emailUpdates,
              onChange: setEmailUpdates,
            },
          ].map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 18,
                paddingVertical: 16,
                borderBottomWidth: index === 0 ? 0.5 : 0,
                borderBottomColor: colors.border,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: colors.primary + "18",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 14,
                }}
              >
                <IconSymbol name={item.icon} size={18} color={colors.primary} />
              </View>
              <Text
                style={{ flex: 1, color: colors.foreground, fontSize: 15, fontWeight: "500" }}
              >
                {item.label}
              </Text>
              <Switch
                value={item.value}
                onValueChange={(v) => {
                  if (Platform.OS !== "web") Haptics.selectionAsync();
                  item.onChange(v);
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="white"
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
