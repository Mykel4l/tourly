import { Text, View, ScrollView, Pressable, TextInput, Alert, Platform, KeyboardAvoidingView } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/lib/i18n";
import { startOAuthLogin } from "@/constants/oauth";

export default function SignUpScreen() {
  const colors = useColors();
  const { t } = useTranslation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) {
      newErrors.fullName = t.validationNameRequired;
    }
    if (!email.trim()) {
      newErrors.email = t.validationEmailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t.validationEmailInvalid;
    }
    if (!password.trim() || password.length < 8) {
      newErrors.password = t.passwordTooShort;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = t.passwordMismatch;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setLoading(true);
    try {
      // Use the existing OAuth flow for registration
      await startOAuthLogin();
    } catch (_err) {
      Alert.alert("Error", "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    try {
      await startOAuthLogin();
    } catch (_err) {
      Alert.alert("Error", "OAuth login failed. Please try again.");
    }
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <ScreenContainer edges={["left", "right", "top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            style={{ position: "absolute", top: 16, left: 0, zIndex: 10, padding: 8 }}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
          </Pressable>

          {/* Logo / Branding */}
          <View style={{ alignItems: "center", marginBottom: 28 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                backgroundColor: colors.primary,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <IconSymbol name="airplane" size={36} color="#FFFFFF" />
            </View>
            <Text style={{ fontSize: 28, fontWeight: "800", color: colors.foreground, marginBottom: 8 }}>
              {t.createAccount}
            </Text>
            <Text style={{ fontSize: 15, color: colors.muted, textAlign: "center", lineHeight: 22 }}>
              {t.signUpSubtitle}
            </Text>
          </View>

          {/* Full Name Input */}
          <View style={{ marginBottom: 14 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginBottom: 8 }}>
              {t.fullName}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.input,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: errors.fullName ? "#EF4444" : "rgba(255,255,255,0.08)",
                paddingHorizontal: 14,
              }}
            >
              <IconSymbol name="person.fill" size={18} color={colors.inputPlaceholder} />
              <TextInput
                placeholder={t.fullName}
                placeholderTextColor={colors.inputPlaceholder}
                value={fullName}
                onChangeText={(v) => { setFullName(v); clearError("fullName"); }}
                autoCapitalize="words"
                autoComplete="name"
                style={{ flex: 1, paddingVertical: 14, paddingLeft: 10, color: colors.inputText, fontSize: 15 }}
              />
            </View>
            {errors.fullName ? <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>{errors.fullName}</Text> : null}
          </View>

          {/* Email Input */}
          <View style={{ marginBottom: 14 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginBottom: 8 }}>
              {t.email}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.input,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: errors.email ? "#EF4444" : "rgba(255,255,255,0.08)",
                paddingHorizontal: 14,
              }}
            >
              <IconSymbol name="envelope.fill" size={18} color={colors.inputPlaceholder} />
              <TextInput
                placeholder={t.email}
                placeholderTextColor={colors.inputPlaceholder}
                value={email}
                onChangeText={(v) => { setEmail(v); clearError("email"); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                style={{ flex: 1, paddingVertical: 14, paddingLeft: 10, color: colors.inputText, fontSize: 15 }}
              />
            </View>
            {errors.email ? <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>{errors.email}</Text> : null}
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 14 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginBottom: 8 }}>
              {t.password}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.input,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: errors.password ? "#EF4444" : "rgba(255,255,255,0.08)",
                paddingHorizontal: 14,
              }}
            >
              <IconSymbol name="lock.fill" size={18} color={colors.inputPlaceholder} />
              <TextInput
                placeholder={t.password}
                placeholderTextColor={colors.inputPlaceholder}
                value={password}
                onChangeText={(v) => { setPassword(v); clearError("password"); }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="new-password"
                style={{ flex: 1, paddingVertical: 14, paddingLeft: 10, color: colors.inputText, fontSize: 15 }}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                <IconSymbol name={showPassword ? "eye.slash.fill" : "eye.fill"} size={20} color={colors.inputPlaceholder} />
              </Pressable>
            </View>
            {errors.password ? <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>{errors.password}</Text> : null}
          </View>

          {/* Confirm Password Input */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginBottom: 8 }}>
              {t.confirmPassword}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.input,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: errors.confirmPassword ? "#EF4444" : "rgba(255,255,255,0.08)",
                paddingHorizontal: 14,
              }}
            >
              <IconSymbol name="lock.fill" size={18} color={colors.inputPlaceholder} />
              <TextInput
                placeholder={t.confirmPassword}
                placeholderTextColor={colors.inputPlaceholder}
                value={confirmPassword}
                onChangeText={(v) => { setConfirmPassword(v); clearError("confirmPassword"); }}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoComplete="new-password"
                style={{ flex: 1, paddingVertical: 14, paddingLeft: 10, color: colors.inputText, fontSize: 15 }}
              />
              <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} hitSlop={8}>
                <IconSymbol name={showConfirmPassword ? "eye.slash.fill" : "eye.fill"} size={20} color={colors.inputPlaceholder} />
              </Pressable>
            </View>
            {errors.confirmPassword ? <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>{errors.confirmPassword}</Text> : null}
          </View>

          {/* Sign Up Button */}
          <Pressable
            onPress={handleSignUp}
            disabled={loading}
            style={{
              backgroundColor: loading ? colors.muted : colors.primary,
              paddingVertical: 16,
              borderRadius: 14,
              alignItems: "center",
              marginBottom: 20,
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>
              {loading ? t.signingUp : t.signUp}
            </Text>
          </Pressable>

          {/* Terms & Privacy */}
          <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center", lineHeight: 18, marginBottom: 24 }}>
            {t.agreeToTerms}{" "}
            <Text style={{ color: colors.primary, fontWeight: "600" }}>{t.termsOfService}</Text>
            {" "}{t.andText}{" "}
            <Text style={{ color: colors.primary, fontWeight: "600" }}>{t.privacyPolicy}</Text>
          </Text>

          {/* Divider */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            <Text style={{ marginHorizontal: 16, fontSize: 13, color: colors.muted, fontWeight: "500" }}>
              {t.orContinueWith}
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
          </View>

          {/* Social Login Buttons */}
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 32 }}>
            <Pressable
              onPress={handleOAuthLogin}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 14,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.surface,
                gap: 8,
              }}
            >
              <Text style={{ fontSize: 20 }}>G</Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>Google</Text>
            </Pressable>
            <Pressable
              onPress={handleOAuthLogin}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 14,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.surface,
                gap: 8,
              }}
            >
              <IconSymbol name="apple.logo" size={20} color={colors.foreground} />
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>Apple</Text>
            </Pressable>
          </View>

          {/* Sign In Link */}
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 14, color: colors.muted }}>
              {t.alreadyHaveAccount}{" "}
            </Text>
            <Pressable onPress={() => router.replace("/sign-in")}>
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.primary }}>
                {t.signIn}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
