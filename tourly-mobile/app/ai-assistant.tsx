import { useState, useRef, useCallback } from "react";
import {
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/lib/i18n";
import { TopNavBar } from "@/components/top-nav-bar";
import { usePremium } from "@/lib/premium";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

// Simulated AI responses based on keywords
function getAIResponse(input: string, t: any): string {
  const lower = input.toLowerCase();
  if (lower.includes("bali")) {
    return t.aiResponseBali;
  }
  if (lower.includes("family") || lower.includes("families") || lower.includes("kid")) {
    return t.aiResponseFamily;
  }
  if (lower.includes("budget") || lower.includes("cheap") || lower.includes("affordable")) {
    return t.aiResponseBudget;
  }
  if (lower.includes("europe")) {
    return t.aiResponseEurope;
  }
  return t.aiResponseDefault;
}

export default function AIAssistantScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const { isPro, isElite } = usePremium();
  const scrollRef = useRef<ScrollView>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", text: t.aiWelcomeMessage },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const suggestions = [t.aiSuggestion1, t.aiSuggestion2, t.aiSuggestion3];

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        text: text.trim(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      // Simulate AI thinking delay
      setTimeout(() => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: getAIResponse(text, t),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
      }, 1000 + Math.random() * 1500);

      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    },
    [t]
  );

  return (
    <ScreenContainer edges={["left", "right"]}>
      <TopNavBar title={t.aiAssistantTitle} showBack />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1, paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 16, gap: 12 }}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "80%",
              }}
            >
              {msg.role === "assistant" && (
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4, gap: 6 }}>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: colors.primary,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconSymbol name="sparkles" size={14} color="white" />
                  </View>
                  <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "600" }}>AI</Text>
                </View>
              )}
              <View
                style={{
                  backgroundColor: msg.role === "user" ? colors.primary : colors.surface,
                  borderRadius: 18,
                  borderTopRightRadius: msg.role === "user" ? 4 : 18,
                  borderTopLeftRadius: msg.role === "assistant" ? 4 : 18,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
              >
                <Text
                  style={{
                    color: msg.role === "user" ? "white" : colors.foreground,
                    fontSize: 15,
                    lineHeight: 22,
                  }}
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={{ alignSelf: "flex-start", maxWidth: "80%" }}>
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 18,
                  borderTopLeftRadius: 4,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
              >
                <Text style={{ color: colors.muted, fontSize: 15 }}>...</Text>
              </View>
            </View>
          )}

          {/* Suggestion chips (show only if few messages) */}
          {messages.length <= 2 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              {suggestions.map((s, i) => (
                <Pressable
                  key={i}
                  onPress={() => sendMessage(s)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: colors.primary + "15",
                      borderWidth: 1,
                      borderColor: colors.primary + "30",
                      borderRadius: 20,
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                    },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={{ color: colors.primary, fontSize: 13, fontWeight: "500" }}>{s}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Pro gate banner */}
        {!isPro && !isElite && messages.length > 6 && (
          <View
            style={{
              backgroundColor: colors.primary + "10",
              borderTopWidth: 1,
              borderTopColor: colors.primary + "20",
              paddingHorizontal: 16,
              paddingVertical: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <IconSymbol name="crown.fill" size={16} color={colors.primary} />
            <Text style={{ color: colors.primary, fontSize: 13, flex: 1 }}>{t.aiProFeature}</Text>
          </View>
        )}

        {/* Input */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderTopWidth: 0.5,
            borderTopColor: colors.border,
            gap: 10,
          }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={t.aiPlaceholder}
            placeholderTextColor={colors.muted}
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderRadius: 24,
              paddingHorizontal: 18,
              paddingVertical: 12,
              color: colors.foreground,
              fontSize: 15,
            }}
            multiline
            maxLength={500}
            onSubmitEditing={() => sendMessage(input)}
          />
          <Pressable
            onPress={() => sendMessage(input)}
            disabled={!input.trim()}
            style={({ pressed }) => [
              {
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: input.trim() ? colors.primary : colors.border,
                alignItems: "center",
                justifyContent: "center",
              },
              pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
            ]}
          >
            <IconSymbol name="arrow.up" size={20} color="white" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
