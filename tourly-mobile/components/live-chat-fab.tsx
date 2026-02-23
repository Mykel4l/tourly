import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useRef, useCallback } from "react";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/lib/i18n";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "support";
  time: string;
}

const AUTO_REPLY_KEYS = [
  "chatReply1",
  "chatReply2",
  "chatReply3",
  "chatReply4",
  "chatReply5",
] as const;

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function LiveChatFab({ bottomOffset = 0 }: { bottomOffset?: number }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [unread, setUnread] = useState(1);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "0", text: t.chatWelcome, sender: "support", time: now() },
  ]);
  const listRef = useRef<FlatList>(null);
  const replyIdx = useRef(0);

  const handleOpen = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setUnread(0);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const sendMessage = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg: ChatMessage = { id: Date.now().toString(), text: trimmed, sender: "user", time: now() };
    setInput("");
    setMessages((prev) => [...prev, userMsg]);

    // Auto-reply after 1.2 s
    setTimeout(() => {
      const reply = t[AUTO_REPLY_KEYS[replyIdx.current % AUTO_REPLY_KEYS.length]];
      replyIdx.current += 1;
      const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), text: reply, sender: "support", time: now() };
      setMessages((prev) => [...prev, botMsg]);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1200);

    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, [input]);

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.sender === "user";
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: isUser ? "flex-end" : "flex-start",
          marginBottom: 10,
          paddingHorizontal: 12,
        }}
      >
        {!isUser && (
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 8,
              marginTop: 2,
            }}
          >
            <MaterialIcons name="support-agent" size={18} color="white" />
          </View>
        )}
        <View
          style={{
            maxWidth: "72%",
            backgroundColor: isUser ? colors.primary : colors.surface,
            borderRadius: 18,
            borderBottomRightRadius: isUser ? 4 : 18,
            borderBottomLeftRadius: isUser ? 18 : 4,
            paddingHorizontal: 14,
            paddingVertical: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text style={{ color: isUser ? "white" : colors.foreground, fontSize: 14, lineHeight: 20 }}>
            {item.text}
          </Text>
          <Text style={{ color: isUser ? "rgba(255,255,255,0.65)" : colors.muted, fontSize: 10, marginTop: 4, textAlign: "right" }}>
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      {/* Floating Button */}
      <Pressable
        onPress={handleOpen}
        style={({ pressed }) => [
          {
            position: "absolute",
            bottom: bottomOffset + Math.max(insets.bottom, 12) + 10,
            right: 20,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 10,
            elevation: 8,
            zIndex: 999,
          },
          pressed && { transform: [{ scale: 0.92 }] },
        ]}
      >
        <MaterialIcons name="chat-bubble" size={26} color="white" />
        {unread > 0 && (
          <View
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: "#EF4444",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: "white",
            }}
          >
            <Text style={{ color: "white", fontSize: 10, fontWeight: "700" }}>{unread}</Text>
          </View>
        )}
      </Pressable>

      {/* Chat Modal */}
      <Modal visible={open} animationType="slide" transparent presentationStyle="overFullScreen">
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.4)" }}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View
              style={{
                backgroundColor: colors.background,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                height: 520,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.15,
                shadowRadius: 16,
                elevation: 20,
              }}
            >
              {/* Header */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <MaterialIcons name="support-agent" size={22} color="white" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.foreground, fontWeight: "700", fontSize: 16 }}>
                    {t.chatTitle}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#22C55E", marginRight: 6 }} />
                    <Text style={{ color: colors.muted, fontSize: 12 }}>{t.chatOnlineStatus}</Text>
                  </View>
                </View>
                <Pressable
                  onPress={handleClose}
                  style={({ pressed }) => [
                    { padding: 8, borderRadius: 20, backgroundColor: colors.surface },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <MaterialIcons name="close" size={20} color={colors.foreground} />
                </Pressable>
              </View>

              {/* Messages */}
              <FlatList
                ref={listRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                contentContainerStyle={{ paddingVertical: 12 }}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
              />

              {/* Input */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  paddingBottom: Math.max(insets.bottom, 10) + 4,
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                  gap: 8,
                }}
              >
                <TextInput
                  value={input}
                  onChangeText={setInput}
                  placeholder={t.chatPlaceholder}
                  placeholderTextColor={colors.muted}
                  style={{
                    flex: 1,
                    backgroundColor: colors.surface,
                    borderRadius: 24,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    color: colors.foreground,
                    fontSize: 14,
                  }}
                  returnKeyType="send"
                  onSubmitEditing={sendMessage}
                  multiline
                  maxLength={300}
                />
                <Pressable
                  onPress={sendMessage}
                  style={({ pressed }) => [
                    {
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: input.trim() ? colors.primary : colors.border,
                      alignItems: "center",
                      justifyContent: "center",
                    },
                    pressed && { transform: [{ scale: 0.92 }] },
                  ]}
                >
                  <MaterialIcons name="send" size={20} color="white" />
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
}
