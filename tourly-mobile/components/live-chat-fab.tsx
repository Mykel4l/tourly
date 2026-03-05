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
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/lib/i18n";
import { useChat, type ChatMessage } from "@/lib/store";

const GUEST_CONVO_ID = "guest-user";
const GUEST_NAME = "Guest User";
const GUEST_EMAIL = "guest@tourly.com";
const CHAT_VISIT_KEY = "@tourly/chat-visits";
const CHAT_ARCHIVE_KEY = "@tourly/chat-archive";

interface ArchivedChat {
  id: string;
  archivedAt: string;
  mode: "bot" | "live";
  messages: LocalMessage[];
  messageCount: number;
  preview: string;
}

const AUTO_REPLY_KEYS = [
  "chatReply1",
  "chatReply2",
  "chatReply3",
  "chatReply4",
  "chatReply5",
] as const;

type LocalMessage = { id: string; text: string; sender: "user" | "support"; time: string };

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function LiveChatFab({ bottomOffset = 0 }: { bottomOffset?: number }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, language } = useTranslation();
  const { conversations, ensureConversation, sendUserMessage, markReadByUser, closeConversation, reopenConversation, refreshNow, translateMessage, translateBatch } = useChat({ role: "user", pollMs: 2000 });

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [unread, setUnread] = useState(1);
  const [visitCount, setVisitCount] = useState(0);
  const [archivedChats, setArchivedChats] = useState<ArchivedChat[]>([]);
  const [showArchive, setShowArchive] = useState(false);
  const [viewingArchive, setViewingArchive] = useState<ArchivedChat | null>(null);
  const listRef = useRef<FlatList>(null);

  // ── Chat translation state ──
  /** Whether auto-translate is enabled for incoming messages */
  const [autoTranslate, setAutoTranslate] = useState(false);
  /** Map of messageId → translated text (for messages the user tapped "Translate" on) */
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});
  /** Set of messageIds currently being translated */
  const [translatingIds, setTranslatingIds] = useState<Set<string>>(new Set());
  /** Set of messageIds where user toggled to show the translated version */
  const [showTranslated, setShowTranslated] = useState<Set<string>>(new Set());

  /** Translate a single message and toggle its display */
  const handleTranslateMessage = useCallback(async (msgId: string, conversationId: string) => {
    // Already translated → just toggle
    if (translatedTexts[msgId]) {
      setShowTranslated((prev) => {
        const next = new Set(prev);
        if (next.has(msgId)) next.delete(msgId); else next.add(msgId);
        return next;
      });
      return;
    }
    // Start translating
    setTranslatingIds((prev) => new Set(prev).add(msgId));
    try {
      const result = await translateMessage(conversationId, msgId, language);
      if (result) {
        setTranslatedTexts((prev) => ({ ...prev, [msgId]: result }));
        setShowTranslated((prev) => new Set(prev).add(msgId));
      }
    } catch (err) {
      console.error("Translation failed:", err);
    } finally {
      setTranslatingIds((prev) => { const next = new Set(prev); next.delete(msgId); return next; });
    }
  }, [translatedTexts, translateMessage, language]);

  // ── Dual mode: "bot" (local auto-reply) or "live" (shared store → admin) ──
  const [mode, setMode] = useState<"bot" | "live">("bot");
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([
    { id: "welcome", text: t.chatWelcome, sender: "support", time: now() },
  ]);
  const replyIdx = useRef(0);

  // Track which live messages belong to the *current* session.
  // When we archive / start new, we bump this so old messages are hidden.
  const [liveMessageOffset, setLiveMessageOffset] = useState(0);

  // Track visits for welcome-back
  useEffect(() => {
    AsyncStorage.getItem(CHAT_VISIT_KEY).then((raw) => {
      const count = raw ? parseInt(raw, 10) : 0;
      setVisitCount(count);
    });
    // Load archived chats
    AsyncStorage.getItem(CHAT_ARCHIVE_KEY).then((raw) => {
      if (raw) setArchivedChats(JSON.parse(raw));
    });
  }, []);

  // Live-mode conversation from the shared store
  const convo = conversations.find((c) => c.id === GUEST_CONVO_ID);
  const allLiveMessages: ChatMessage[] = useMemo(() => {
    return convo?.messages ?? [];
  }, [convo?.messages]);

  // Only show live messages from the current session (after offset)
  const liveMessages: ChatMessage[] = useMemo(() => {
    return allLiveMessages.slice(liveMessageOffset);
  }, [allLiveMessages, liveMessageOffset]);

  // Count new admin replies as unread when chat is closed, OR auto-scroll + haptic when open
  const prevLiveMsgCount = useRef(liveMessages.length);
  useEffect(() => {
    if (mode === "live" && liveMessages.length > prevLiveMsgCount.current) {
      const newMsgs = liveMessages.slice(prevLiveMsgCount.current);
      const adminReplies = newMsgs.filter((m) => m.sender === "support").length;
      if (adminReplies > 0) {
        if (!open) {
          // Chat widget is closed → increment unread badge
          setUnread((u) => u + adminReplies);
        } else {
          // Chat widget is open → auto-scroll + haptic for new admin message
          if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 120);
        }
      }
    }
    prevLiveMsgCount.current = liveMessages.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveMessages.length, mode, open]);

  // ── Auto-translate incoming support messages ──
  useEffect(() => {
    if (!autoTranslate || mode !== "live" || language === "en") return;
    const untranslated = liveMessages.filter(
      (m) => m.sender === "support" && !translatedTexts[m.id] && !translatingIds.has(m.id),
    );
    if (untranslated.length === 0) return;
    // Batch-translate all untranslated support messages
    const ids = untranslated.map((m) => m.id);
    // Mark them as translating
    setTranslatingIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
    translateBatch(GUEST_CONVO_ID, ids, language).then((results) => {
      setTranslatingIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
      if (Object.keys(results).length > 0) {
        setTranslatedTexts((prev) => ({ ...prev, ...results }));
        setShowTranslated((prev) => {
          const next = new Set(prev);
          Object.keys(results).forEach((id) => next.add(id));
          return next;
        });
      }
    }).catch(() => {
      setTranslatingIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoTranslate, mode, language, liveMessages.length]);

  // ── Translate all existing support messages at once ──
  const handleTranslateAll = useCallback(() => {
    if (mode !== "live" || language === "en") return;
    const supportMsgs = liveMessages.filter((m) => m.sender === "support" && !translatedTexts[m.id] && !translatingIds.has(m.id));
    if (supportMsgs.length === 0) return;
    const ids = supportMsgs.map((m) => m.id);
    setTranslatingIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
    translateBatch(GUEST_CONVO_ID, ids, language).then((results) => {
      setTranslatingIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
      if (Object.keys(results).length > 0) {
        setTranslatedTexts((prev) => ({ ...prev, ...results }));
        setShowTranslated((prev) => {
          const next = new Set(prev);
          Object.keys(results).forEach((id) => next.add(id));
          return next;
        });
      }
    }).catch(() => {
      setTranslatingIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    });
  }, [mode, language, liveMessages, translatedTexts, translatingIds, translateBatch]);

  // Whether the live conversation is closed
  const isClosed = mode === "live" && convo?.status === "closed";

  // Pick the right message list based on mode
  const messages = mode === "bot" ? localMessages : liveMessages;

  const handleOpen = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setUnread(0);
    if (mode === "live") markReadByUser(GUEST_CONVO_ID);
    // Trigger immediate server sync when chat opens
    refreshNow();

    // Bump visit count and inject welcome-back message on revisit
    const newCount = visitCount + 1;
    setVisitCount(newCount);
    AsyncStorage.setItem(CHAT_VISIT_KEY, String(newCount));

    if (newCount > 1 && mode === "bot") {
      const alreadyHasWelcomeBack = localMessages.some((m) => m.id === "welcome-back");
      if (!alreadyHasWelcomeBack) {
        setLocalMessages((prev) => [
          ...prev,
          {
            id: "welcome-back",
            text: t.chatWelcomeBack,
            sender: "support",
            time: now(),
          },
        ]);
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 150);
      }
    }

    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // ── Switch to live agent mode ──
  const connectToAgent = useCallback(() => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Ensure conversation exists in shared store
    ensureConversation(GUEST_CONVO_ID, GUEST_NAME, GUEST_EMAIL);
    // Only transfer *current session* user messages (not old ones)
    const userMsgs = localMessages.filter((m) => m.sender === "user");
    for (const msg of userMsgs) {
      sendUserMessage(GUEST_CONVO_ID, msg.text, GUEST_NAME, GUEST_EMAIL, language);
    }
    // Set offset so any old messages before this point are hidden
    const currentTotal = convo?.messages?.length ?? 0;
    setLiveMessageOffset(currentTotal);
    setMode("live");
    // Immediate sync so admin sees user messages right away
    refreshNow();
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 200);
  }, [ensureConversation, sendUserMessage, localMessages, convo?.messages?.length, refreshNow, language]);

  // ── Return from live mode back to bot mode ──
  const returnToBot = useCallback(() => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMode("bot");
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  const handleEndChat = useCallback(() => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    closeConversation(GUEST_CONVO_ID, "user");
  }, [closeConversation]);

  // ── Archive current chat and start fresh ──
  const archiveAndStartNew = useCallback(() => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Build archive from current messages (bot or live)
    const currentMsgs: LocalMessage[] =
      mode === "bot"
        ? localMessages
        : liveMessages.map((m) => ({ id: m.id, text: m.text, sender: m.sender, time: m.time }));

    // Only archive if there are user messages (not just the welcome message)
    const hasUserMessages = currentMsgs.some((m) => m.sender === "user");
    if (hasUserMessages) {
      const lastUserMsg = [...currentMsgs].reverse().find((m) => m.sender === "user");
      const archive: ArchivedChat = {
        id: "archive-" + Date.now(),
        archivedAt: new Date().toISOString(),
        mode,
        messages: currentMsgs,
        messageCount: currentMsgs.length,
        preview: lastUserMsg?.text ?? currentMsgs[currentMsgs.length - 1]?.text ?? "",
      };

      const updated = [archive, ...archivedChats].slice(0, 20); // keep last 20
      setArchivedChats(updated);
      AsyncStorage.setItem(CHAT_ARCHIVE_KEY, JSON.stringify(updated));
    }

    // If live convo is active, close it
    if (mode === "live" && convo && convo.status !== "closed") {
      closeConversation(GUEST_CONVO_ID, "user");
    }

    // Bump offset so all existing live messages are hidden in the next session
    setLiveMessageOffset(allLiveMessages.length);

    // Reset to fresh bot mode
    setLocalMessages([
      { id: "welcome", text: t.chatWelcome, sender: "support", time: now() },
      {
        id: "fresh-" + Date.now(),
        text: t.chatNewConvo,
        sender: "support",
        time: now(),
      },
    ]);
    replyIdx.current = 0;
    setMode("bot");
    setInput("");
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 150);
  }, [mode, localMessages, liveMessages, allLiveMessages, archivedChats, convo, closeConversation, t]);

  // ── Delete a single archive ──
  const deleteArchive = useCallback((archiveId: string) => {
    setArchivedChats((prev) => {
      const updated = prev.filter((a) => a.id !== archiveId);
      AsyncStorage.setItem(CHAT_ARCHIVE_KEY, JSON.stringify(updated));
      return updated;
    });
    if (viewingArchive?.id === archiveId) setViewingArchive(null);
  }, [viewingArchive]);

  // ── Clear all archives ──
  const clearAllArchives = useCallback(() => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setArchivedChats([]);
    setViewingArchive(null);
    AsyncStorage.setItem(CHAT_ARCHIVE_KEY, "[]");
  }, []);

  // ── Start a fresh conversation (after a closed one) ──
  const startNewConversation = useCallback(() => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Reset bot messages
    setLocalMessages([
      { id: "welcome", text: t.chatWelcome, sender: "support", time: now() },
      {
        id: "new-convo-" + Date.now(),
        text: t.chatFreshConvo,
        sender: "support",
        time: now(),
      },
    ]);
    replyIdx.current = 0;
    // Bump offset so old live messages are hidden
    setLiveMessageOffset(allLiveMessages.length);
    // If there was a closed live convo, reopen it so admin can see new messages
    if (convo?.status === "closed") {
      reopenConversation(GUEST_CONVO_ID);
    }
    setMode("bot");
    setInput("");
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 150);
  }, [t, convo?.status, reopenConversation, allLiveMessages.length]);

  // ── Send message ──
  const sendMessage = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInput("");

    if (mode === "bot") {
      // Local auto-reply mode
      const userMsg: LocalMessage = { id: Date.now().toString(), text: trimmed, sender: "user", time: now() };
      setLocalMessages((prev) => [...prev, userMsg]);

      // Auto-reply after 1.2s
      setTimeout(() => {
        const reply = t[AUTO_REPLY_KEYS[replyIdx.current % AUTO_REPLY_KEYS.length]];
        replyIdx.current += 1;
        const botMsg: LocalMessage = { id: (Date.now() + 1).toString(), text: reply, sender: "support", time: now() };
        setLocalMessages((prev) => [...prev, botMsg]);
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
      }, 1200);
    } else {
      // Live mode → shared store (pass current language for translation context)
      sendUserMessage(GUEST_CONVO_ID, trimmed, GUEST_NAME, GUEST_EMAIL, language);
      // Trigger immediate sync after sending so reply comes back faster
      setTimeout(() => refreshNow(), 800);
    }

    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, [input, mode, sendUserMessage, t, refreshNow, language]);

  const renderMessage = ({ item, index }: { item: LocalMessage | ChatMessage; index: number }) => {
    const isUser = item.sender === "user";
    const msgId = item.id;
    const isTranslated = showTranslated.has(msgId);
    const isTranslating = translatingIds.has(msgId);
    const displayText = isTranslated && translatedTexts[msgId] ? translatedTexts[msgId] : item.text;
    // Show translate button on support messages in live mode (messages from other language)
    const canTranslate = mode === "live" && !isUser && !("sender" in item && (item as any).senderName === "System");

    return (
      <Animated.View
        entering={FadeInDown.duration(250).delay(Math.min(index * 30, 150))}
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
        <View style={{ maxWidth: "72%" }}>
          <View
            style={{
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
              {displayText}
            </Text>
            {isTranslated && (
              <Text style={{ color: isUser ? "rgba(255,255,255,0.5)" : colors.muted, fontSize: 10, fontStyle: "italic", marginTop: 2 }}>
                {t.chatTranslatedFrom} {(item as ChatMessage).originalLang ?? "?"}
              </Text>
            )}
            <Text style={{ color: isUser ? "rgba(255,255,255,0.65)" : colors.muted, fontSize: 10, marginTop: 4, textAlign: "right" }}>
              {item.time}
            </Text>
          </View>
          {/* Translate button for incoming live messages */}
          {canTranslate && (
            <Pressable
              onPress={() => handleTranslateMessage(msgId, GUEST_CONVO_ID)}
              disabled={isTranslating}
              style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4, marginLeft: 4 }}
            >
              <MaterialIcons name="translate" size={12} color={colors.primary} />
              <Text style={{ fontSize: 11, color: colors.primary, fontWeight: "500" }}>
                {isTranslating ? t.chatTranslating : isTranslated ? t.chatShowOriginal : t.chatTranslate}
              </Text>
            </Pressable>
          )}
        </View>
      </Animated.View>
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
                {/* Back button: in live mode → return to bot; in bot mode → close chat */}
                <Pressable
                  onPress={mode === "live" ? returnToBot : handleClose}
                  style={({ pressed }) => [
                    {
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: colors.surface,
                      marginRight: 10,
                    },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <MaterialIcons name="chevron-left" size={22} color={colors.foreground} />
                </Pressable>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: mode === "live" ? "#22C55E" : colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <MaterialIcons
                    name={mode === "live" ? "headset-mic" : "support-agent"}
                    size={22}
                    color="white"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.foreground, fontWeight: "700", fontSize: 16 }}>
                    {mode === "live" ? t.chatLiveAgent : t.chatTitle}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#22C55E",
                        marginRight: 6,
                      }}
                    />
                    <Text style={{ color: colors.muted, fontSize: 12 }}>
                      {mode === "live" ? t.chatConnectedTeam : t.chatOnlineStatus}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  {/* Archive & New Chat button */}
                  {messages.length > 1 && (
                    <Pressable
                      onPress={archiveAndStartNew}
                      style={({ pressed }) => [
                        {
                          paddingHorizontal: 8,
                          paddingVertical: 6,
                          borderRadius: 16,
                          backgroundColor: colors.primary + "12",
                        },
                        pressed && { opacity: 0.7 },
                      ]}
                    >
                      <MaterialIcons name="refresh" size={16} color={colors.primary} />
                    </Pressable>
                  )}
                  {/* Archive history button */}
                  {archivedChats.length > 0 && (
                    <Pressable
                      onPress={() => { if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowArchive(true); }}
                      style={({ pressed }) => [
                        {
                          paddingHorizontal: 8,
                          paddingVertical: 6,
                          borderRadius: 16,
                          backgroundColor: colors.surface,
                        },
                        pressed && { opacity: 0.7 },
                      ]}
                    >
                      <MaterialIcons name="inventory" size={16} color={colors.muted} />
                    </Pressable>
                  )}
                  {/* Translation controls — live mode only */}
                  {mode === "live" && language !== "en" && (
                    <>
                      {/* Translate all messages */}
                      <Pressable
                        onPress={handleTranslateAll}
                        style={({ pressed }) => [
                          {
                            paddingHorizontal: 8,
                            paddingVertical: 6,
                            borderRadius: 16,
                            backgroundColor: colors.primary + "12",
                          },
                          pressed && { opacity: 0.7 },
                        ]}
                      >
                        <MaterialIcons name="translate" size={16} color={colors.primary} />
                      </Pressable>
                      {/* Auto-translate toggle */}
                      <Pressable
                        onPress={() => setAutoTranslate((v) => !v)}
                        style={({ pressed }) => [
                          {
                            paddingHorizontal: 8,
                            paddingVertical: 6,
                            borderRadius: 16,
                            backgroundColor: autoTranslate ? colors.primary + "25" : colors.surface,
                            borderWidth: autoTranslate ? 1 : 0,
                            borderColor: colors.primary + "50",
                          },
                          pressed && { opacity: 0.7 },
                        ]}
                      >
                        <MaterialIcons name="auto-fix-high" size={16} color={autoTranslate ? colors.primary : colors.muted} />
                      </Pressable>
                    </>
                  )}
                  {mode === "live" && !isClosed && (
                    <Pressable
                      onPress={handleEndChat}
                      style={({ pressed }) => [
                        {
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderRadius: 16,
                          backgroundColor: colors.error + "15",
                        },
                        pressed && { opacity: 0.7 },
                      ]}
                    >
                      <Text style={{ fontSize: 11, fontWeight: "700", color: colors.error }}>
                        {t.chatEnd}
                      </Text>
                    </Pressable>
                  )}
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
              </View>

              {/* "Closed" banner in live mode */}
              {isClosed && (
                <View
                  style={{
                    marginHorizontal: 12,
                    marginTop: 10,
                    borderRadius: 14,
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      backgroundColor: colors.muted + "12",
                    }}
                  >
                    <MaterialIcons name="check-circle" size={18} color={colors.muted} />
                    <Text style={{ fontSize: 13, color: colors.muted, fontWeight: "600", flex: 1 }}>
                      {t.chatConvoClosed}
                    </Text>
                  </View>
                  <Pressable
                    onPress={startNewConversation}
                    style={({ pressed }) => [
                      {
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                      },
                      pressed && { opacity: 0.7 },
                    ]}
                  >
                    <MaterialIcons name="add-circle" size={20} color={colors.primary} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: "700", color: colors.primary }}>
                        {t.chatStartNew}
                      </Text>
                      <Text style={{ fontSize: 11, color: colors.muted }}>
                        {t.chatHereToHelp}
                      </Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={20} color={colors.primary} />
                  </Pressable>
                </View>
              )}

              {/* "Return to Live Chat" banner — bot mode with active live convo */}
              {mode === "bot" && convo && convo.status !== "closed" && (
                <Pressable
                  onPress={() => {
                    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setMode("live");
                    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
                  }}
                  style={({ pressed }) => [
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      marginHorizontal: 12,
                      marginTop: 10,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      borderRadius: 14,
                      backgroundColor: colors.primary + "12",
                      borderWidth: 1,
                      borderColor: colors.primary + "30",
                    },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <MaterialIcons name="headset-mic" size={20} color={colors.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: "700", color: colors.foreground }}>
                      {t.chatReturnLive}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.muted }}>
                      {t.chatActiveConvo}
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color={colors.primary} />
                </Pressable>
              )}

              {/* "Connect to Live Agent" banner — bot mode with no active live convo */}
              {mode === "bot" && (!convo || convo.status === "closed") && (
                <Pressable
                  onPress={connectToAgent}
                  style={({ pressed }) => [
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      marginHorizontal: 12,
                      marginTop: 10,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      borderRadius: 14,
                      backgroundColor: "#22C55E" + "12",
                      borderWidth: 1,
                      borderColor: "#22C55E" + "30",
                    },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <MaterialIcons name="headset-mic" size={20} color="#22C55E" />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: "700", color: colors.foreground }}>
                      {t.chatConnectAgent}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.muted }}>
                      {t.chatConnectAgentDesc}
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color="#22C55E" />
                </Pressable>
              )}

              {/* "Connected" indicator in live mode */}
              {mode === "live" && liveMessages.length === 0 && (
                <View
                  style={{
                    alignItems: "center",
                    paddingVertical: 24,
                    paddingHorizontal: 16,
                    gap: 8,
                  }}
                >
                  <MaterialIcons name="headset-mic" size={36} color="#22C55E" />
                  <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                    {t.chatConnectedLive}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center" }}>
                    {t.chatAgentRespondSoon}
                  </Text>
                </View>
              )}

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
                  placeholder={isClosed ? t.chatEnded : t.chatPlaceholder}
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
                  editable={!isClosed}
                />
                <Pressable
                  onPress={sendMessage}
                  disabled={isClosed}
                  style={({ pressed }) => [
                    {
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: input.trim() && !isClosed ? colors.primary : colors.border,
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

      {/* Archive Modal */}
      <Modal visible={showArchive} animationType="slide" transparent presentationStyle="overFullScreen">
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.4)" }}>
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
            {/* Archive Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <Pressable
                onPress={() => { if (viewingArchive) { setViewingArchive(null); } else { setShowArchive(false); } }}
                style={({ pressed }) => [
                  {
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.surface,
                    marginRight: 10,
                  },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <MaterialIcons name={viewingArchive ? "chevron-left" : "close"} size={22} color={colors.foreground} />
              </Pressable>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.foreground, fontWeight: "700", fontSize: 16 }}>
                  {viewingArchive ? t.chatArchivedChat : t.chatHistory}
                </Text>
                <Text style={{ color: colors.muted, fontSize: 12 }}>
                  {viewingArchive
                    ? new Date(viewingArchive.archivedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
                    : `${archivedChats.length} ${t.chatConversations}`}
                </Text>
              </View>
              {!viewingArchive && archivedChats.length > 0 && (
                <Pressable
                  onPress={clearAllArchives}
                  style={({ pressed }) => [
                    {
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 16,
                      backgroundColor: colors.error + "12",
                    },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={{ fontSize: 11, fontWeight: "700", color: colors.error }}>
                    {t.chatClearAll}
                  </Text>
                </Pressable>
              )}
              {viewingArchive && (
                <Pressable
                  onPress={() => deleteArchive(viewingArchive.id)}
                  style={({ pressed }) => [
                    {
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 16,
                      backgroundColor: colors.error + "12",
                    },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={{ fontSize: 11, fontWeight: "700", color: colors.error }}>
                    {t.chatDelete}
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Archive Content */}
            {viewingArchive ? (
              /* Viewing a single archived conversation */
              <FlatList
                data={viewingArchive.messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                contentContainerStyle={{ paddingVertical: 12 }}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              /* Archive list */
              <FlatList
                data={archivedChats}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 12 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={{ alignItems: "center", paddingVertical: 40 }}>
                    <MaterialIcons name="inventory" size={40} color={colors.muted} />
                    <Text style={{ fontSize: 14, color: colors.muted, marginTop: 12 }}>
                      {t.chatNoArchives}
                    </Text>
                  </View>
                }
                renderItem={({ item, index }) => (
                  <Animated.View entering={FadeInDown.delay(index * 60).duration(300)}>
                    <Pressable
                      onPress={() => setViewingArchive(item)}
                      style={({ pressed }) => [
                        {
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: colors.surface,
                          borderRadius: 14,
                          padding: 14,
                          marginBottom: 8,
                          borderWidth: 1,
                          borderColor: colors.border,
                          gap: 12,
                        },
                        pressed && { opacity: 0.7 },
                      ]}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          backgroundColor: item.mode === "live" ? "#22C55E" + "15" : colors.primary + "15",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MaterialIcons
                          name={item.mode === "live" ? "headset-mic" : "smart-toy"}
                          size={20}
                          color={item.mode === "live" ? "#22C55E" : colors.primary}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                          <Text style={{ fontSize: 13, fontWeight: "700", color: colors.foreground }}>
                            {item.mode === "live" ? t.chatLiveAgentChat : t.chatBotConvo}
                          </Text>
                          <Text style={{ fontSize: 10, color: colors.muted }}>
                            {new Date(item.archivedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                          </Text>
                        </View>
                        <Text
                          style={{ fontSize: 12, color: colors.muted, marginTop: 3 }}
                          numberOfLines={1}
                        >
                          {item.preview}
                        </Text>
                        <Text style={{ fontSize: 10, color: colors.muted, marginTop: 2 }}>
                          {item.messageCount} {t.chatMessages}
                        </Text>
                      </View>
                      <MaterialIcons name="chevron-right" size={20} color={colors.muted} />
                    </Pressable>
                  </Animated.View>
                )}
              />
            )}

            {/* Back to archive list from viewing */}
            {viewingArchive && (
              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  paddingBottom: Math.max(insets.bottom, 10) + 4,
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                }}
              >
                <Pressable
                  onPress={() => setViewingArchive(null)}
                  style={({ pressed }) => [
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      paddingVertical: 12,
                      borderRadius: 14,
                      backgroundColor: colors.surface,
                      borderWidth: 1,
                      borderColor: colors.border,
                    },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <MaterialIcons name="arrow-back" size={18} color={colors.foreground} />
                  <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }}>
                    {t.chatBackToArchives}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}
