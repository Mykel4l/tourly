import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback } from "react";
import { getApiBaseUrl } from "@/constants/oauth";
import * as Auth from "@/lib/_core/auth";

// ─── Wishlist ──────────────────────────────────────────────────────────────

const WISHLIST_KEY = "@tourly:wishlist";

export interface WishlistItem {
  id: string;
  type: "destination" | "package";
  name: string;
  image: any;
  subtitle: string; // country for destinations, price string for packages
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(WISHLIST_KEY).then((raw) => {
      if (raw) setItems(JSON.parse(raw));
    });
  }, []);

  const toggle = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id && i.type === item.type);
      const next = exists
        ? prev.filter((i) => !(i.id === item.id && i.type === item.type))
        : [...prev, item];
      AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isSaved = useCallback(
    (id: string, type: WishlistItem["type"]) =>
      items.some((i) => i.id === id && i.type === type),
    [items]
  );

  return { items, toggle, isSaved };
}

// ─── Bookings ──────────────────────────────────────────────────────────────

const BOOKINGS_KEY = "@tourly:bookings";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  id: string;
  packageName: string;
  fullName: string;
  email: string;
  phone: string;
  travelers: string;
  checkIn: string;
  checkOut: string;
  price?: string;
  status: BookingStatus;
  createdAt: string;
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(BOOKINGS_KEY).then((raw) => {
      if (raw) setBookings(JSON.parse(raw));
    });
  }, []);

  const addBooking = useCallback(
    (booking: Omit<Booking, "id" | "createdAt" | "status">): Booking => {
      const newBooking: Booking = {
        ...booking,
        id: Date.now().toString(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      setBookings((prev) => {
        const next = [newBooking, ...prev];
        AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
        return next;
      });
      return newBooking;
    },
    []
  );

  const cancelBooking = useCallback((id: string) => {
    setBookings((prev) => {
      const next = prev.map((b) =>
        b.id === id ? { ...b, status: "cancelled" as BookingStatus } : b
      );
      AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const confirmBooking = useCallback((id: string) => {
    setBookings((prev) => {
      const next = prev.map((b) =>
        b.id === id ? { ...b, status: "confirmed" as BookingStatus } : b
      );
      AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateBooking = useCallback((id: string, updates: Partial<Omit<Booking, "id" | "createdAt" | "status">>) => {
    setBookings((prev) => {
      const next = prev.map((b) => b.id === id ? { ...b, ...updates } : b);
      AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { bookings, addBooking, cancelBooking, confirmBooking, updateBooking };
}

// ─── Notifications ─────────────────────────────────────────────────────────

const NOTIFICATIONS_KEY = "@tourly:notifications";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  /** i18n key for title – resolved at render time */
  titleKey?: string;
  /** i18n key for body – resolved at render time */
  bodyKey?: string;
  type: "booking" | "offer" | "reminder";
  read: boolean;
  createdAt: string;
}

const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    title: "Welcome to Tourly 🌍",
    body: "Start exploring amazing destinations and book your next adventure.",
    titleKey: "notifWelcomeTitle",
    bodyKey: "notifWelcomeBody",
    type: "offer",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: "n2",
    title: "Summer Sale — Up to 30% Off",
    body: "Limited-time offer on select packages. Book before March 31, 2026.",
    titleKey: "notifSaleTitle",
    bodyKey: "notifSaleBody",
    type: "offer",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "n3",
    title: "New Destination Added",
    body: "Bali, Indonesia is now available. Check out our exclusive packages!",
    titleKey: "notifNewDestTitle",
    bodyKey: "notifNewDestBody",
    type: "reminder",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(NOTIFICATIONS_KEY).then((raw) => {
      if (raw) {
        setNotifications(JSON.parse(raw));
      } else {
        setNotifications(SEED_NOTIFICATIONS);
        AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(SEED_NOTIFICATIONS));
      }
    });
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const addNotification = useCallback(
    (notif: Omit<AppNotification, "id" | "read" | "createdAt">) => {
      const newNotif: AppNotification = {
        ...notif,
        id: Date.now().toString(),
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => {
        const next = [newNotif, ...prev];
        AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, markRead, markAllRead, addNotification, unreadCount };
}

// ─── Live Chat (synced between user FAB ↔ server ↔ admin panel) ────────────

const CHAT_KEY = "@tourly:chat";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "support";
  senderName?: string;
  time: string;
  createdAt?: number; // epoch ms from server
  /** ISO language code of the original message (e.g. "en", "es") */
  originalLang?: string;
  /** Cached translations keyed by target language code */
  translations?: Record<string, string>;
}

export interface ChatConversation {
  id: string;
  userName: string;
  userEmail: string;
  messages: ChatMessage[];
  lastActivity: string;
  unreadByAdmin: number;
  unreadByUser: number;
  status?: "open" | "closed";
  closedBy?: "user" | "admin";
}

// ── global pub/sub so every useChat() instance stays in sync ──
type ChatListener = (convos: ChatConversation[]) => void;
const chatListeners = new Set<ChatListener>();
let chatCache: ChatConversation[] | null = null;

function notifyChat(convos: ChatConversation[]) {
  chatCache = convos;
  chatListeners.forEach((fn) => fn(convos));
}

function persistChat(convos: ChatConversation[]) {
  AsyncStorage.setItem(CHAT_KEY, JSON.stringify(convos));
  notifyChat(convos);
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── Server API helpers ──
// Uses plain fetch against tRPC HTTP endpoints so the store stays decoupled
// from the React tRPC provider.

async function chatApi<T>(
  path: string,
  input: Record<string, unknown>,
  method: "query" | "mutation" = "mutation",
): Promise<T | null> {
  try {
    const base = getApiBaseUrl();
    if (!base) return null;

    const token = await Auth.getSessionToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    // tRPC httpBatchLink format with superjson transformer
    if (method === "query") {
      // tRPC batch GET: ?batch=1&input={"0":{"json":{...}}}
      const batchInput = encodeURIComponent(JSON.stringify({ "0": { json: input } }));
      const url = `${base}/api/trpc/${path}?batch=1&input=${batchInput}`;
      const res = await fetch(url, { headers, credentials: "include" });
      if (!res.ok) return null;
      const json = await res.json();
      // Batch response: [ { result: { data: { json: ... } } } ]
      const item = Array.isArray(json) ? json[0] : json;
      return (item?.result?.data?.json ?? null) as T;
    }

    // tRPC batch POST: body = {"0":{"json":{...}}}
    const url = `${base}/api/trpc/${path}?batch=1`;
    const res = await fetch(url, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({ "0": { json: input } }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const item = Array.isArray(json) ? json[0] : json;
    return (item?.result?.data?.json ?? null) as T;
  } catch {
    // Server not reachable – fall back to local-only mode
    return null;
  }
}

// ── Polling bookkeeping ──
let pollRefCount = 0;
let pollingInterval: ReturnType<typeof setInterval> | null = null;
let pollSince = 0; // epoch ms – only fetch messages newer than this
const activeRoles = new Set<"user" | "admin">();
let pollFn: (() => Promise<void>) | null = null; // ref to current poll function for refreshNow

/**
 * Shared chat hook used by both the user LiveChatFab and the Admin chat tab.
 *
 * Data flow:
 *  1. Optimistic local update (instant UI).
 *  2. Fire-and-forget POST to server tRPC mutation.
 *  3. Background poll merges server-side messages into local state.
 */
export function useChat(options?: { pollMs?: number; role?: "user" | "admin" }) {
  const pollMs = options?.pollMs ?? 3000;
  const role = options?.role ?? "user";

  const [conversations, setConversations] = useState<ChatConversation[]>(chatCache ?? []);

  // hydrate from AsyncStorage on first mount
  useEffect(() => {
    if (chatCache !== null) {
      setConversations(chatCache);
    } else {
      AsyncStorage.getItem(CHAT_KEY).then((raw) => {
        const parsed: ChatConversation[] = raw ? JSON.parse(raw) : [];
        chatCache = parsed;
        setConversations(parsed);
      });
    }
  }, []);

  // subscribe to cross-hook updates (same JS context)
  useEffect(() => {
    const handler: ChatListener = (c) => setConversations(c);
    chatListeners.add(handler);
    return () => { chatListeners.delete(handler); };
  }, []);

  // ── Server polling ──
  useEffect(() => {
    activeRoles.add(role);
    pollRefCount++;

    // Only one poll loop globally
    if (pollingInterval) return;

    const poll = async () => {
      try {
        if (activeRoles.has("admin")) {
          // Admin fetches all conversations
          const data = await chatApi<ChatConversation[]>(
            "chat.listConversations",
            { since: pollSince },
            "query",
          );
          if (data && data.length > 0) {
            // Merge server conversations into local cache
            const current = chatCache ?? [];
            const merged = [...current];
            for (const serverConvo of data) {
              const idx = merged.findIndex((c) => c.id === serverConvo.id);
              if (idx >= 0) {
                // Merge new messages
                const existing = merged[idx];
                const existingIds = new Set(existing.messages.map((m) => m.id));
                const newMsgs = serverConvo.messages.filter((m) => !existingIds.has(m.id));
                if (newMsgs.length > 0) {
                  merged[idx] = {
                    ...existing,
                    messages: [...existing.messages, ...newMsgs],
                    lastActivity: serverConvo.lastActivity,
                    unreadByAdmin: serverConvo.unreadByAdmin,
                    unreadByUser: serverConvo.unreadByUser ?? 0,
                    status: serverConvo.status,
                  };
                }
                // Always sync status even if no new messages
                if (existing.status !== serverConvo.status) {
                  merged[idx] = { ...merged[idx], status: serverConvo.status };
                }
              } else {
                merged.push({ ...serverConvo, unreadByUser: serverConvo.unreadByUser ?? 0 });
              }
            }
            persistChat(merged);
            pollSince = Date.now();
          }
        }
        if (activeRoles.has("user")) {
          // User polls only their own conversation
          const current = chatCache ?? [];
          for (const convo of current) {
            const data = await chatApi<{
              messages: ChatMessage[];
              unreadByUser: number;
              unreadByAdmin: number;
              status?: string;
            }>("chat.getMessages", { conversationId: convo.id, since: pollSince }, "query");
            if (data) {
              const existingIds = new Set(convo.messages.map((m) => m.id));
              const newMsgs = data.messages.filter((m) => !existingIds.has(m.id));
              if (newMsgs.length > 0 || (data.status && data.status !== convo.status)) {
                const updatedConvos = (chatCache ?? []).map((c) =>
                  c.id === convo.id
                    ? {
                        ...c,
                        messages: newMsgs.length > 0 ? [...c.messages, ...newMsgs] : c.messages,
                        unreadByUser: data.unreadByUser,
                        ...(data.status ? { status: data.status as "open" | "closed" } : {}),
                      }
                    : c,
                );
                persistChat(updatedConvos);
              }
            }
          }
          pollSince = Date.now();
        }
      } catch {
        // Silently ignore poll errors
      }
    };

    // Store ref for refreshNow
    pollFn = poll;

    // Initial poll immediately when first hook mounts
    poll();
    pollingInterval = setInterval(poll, pollMs);

    return () => {
      activeRoles.delete(role);
      pollRefCount--;
      if (pollRefCount <= 0 && pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
        pollRefCount = 0;
        pollFn = null;
      }
    };
  }, [role, pollMs]);

  /** Ensure a conversation exists locally + on server */
  const ensureConversation = useCallback(
    (id: string, userName: string, userEmail: string): string => {
      const current = chatCache ?? [];
      if (!current.find((c) => c.id === id)) {
        const updated = [
          ...current,
          {
            id,
            userName,
            userEmail,
            messages: [],
            lastActivity: new Date().toISOString(),
            unreadByAdmin: 0,
            unreadByUser: 0,
            status: "open" as const,
          },
        ];
        persistChat(updated);
      }
      // Fire-and-forget server call
      chatApi("chat.ensure", { conversationId: id, userName, userEmail });
      return id;
    },
    [],
  );

  /** Send message from user side — optimistic local + server push */
  const sendUserMessage = useCallback(
    (conversationId: string, text: string, userName?: string, userEmail?: string, lang?: string) => {
      const msgId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const msg: ChatMessage = {
        id: msgId,
        text,
        sender: "user",
        time: timeNow(),
        createdAt: Date.now(),
        originalLang: lang,
      };
      // Optimistic local update
      const current = chatCache ?? [];
      const updated = current.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: [...c.messages, msg],
              lastActivity: new Date().toISOString(),
              unreadByAdmin: c.unreadByAdmin + 1,
            }
          : c,
      );
      persistChat(updated);
      // Server push
      chatApi("chat.sendUserMessage", {
        conversationId,
        text,
        userName: userName ?? "Guest",
        userEmail: userEmail ?? "",
        lang: lang ?? "en",
      });
    },
    [],
  );

  /** Send message from admin side — optimistic local + server push */
  const sendAdminMessage = useCallback(
    (conversationId: string, text: string, lang?: string) => {
      const msgId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const msg: ChatMessage = {
        id: msgId,
        text,
        sender: "support",
        senderName: "Admin",
        time: timeNow(),
        createdAt: Date.now(),
        originalLang: lang,
      };
      // Optimistic local update
      const current = chatCache ?? [];
      const updated = current.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: [...c.messages, msg],
              lastActivity: new Date().toISOString(),
              unreadByUser: c.unreadByUser + 1,
            }
          : c,
      );
      persistChat(updated);
      // Server push
      chatApi("chat.sendAdminMessage", { conversationId, text, lang: lang ?? "en" });
    },
    [],
  );

  /** Mark as read by admin — local + server */
  const markReadByAdmin = useCallback((conversationId: string) => {
    const current = chatCache ?? [];
    const updated = current.map((c) =>
      c.id === conversationId ? { ...c, unreadByAdmin: 0 } : c,
    );
    persistChat(updated);
    chatApi("chat.markReadByAdmin", { conversationId });
  }, []);

  /** Mark as read by user — local + server */
  const markReadByUser = useCallback((conversationId: string) => {
    const current = chatCache ?? [];
    const updated = current.map((c) =>
      c.id === conversationId ? { ...c, unreadByUser: 0 } : c,
    );
    persistChat(updated);
    chatApi("chat.markReadByUser", { conversationId });
  }, []);

  /** Close a conversation — local + server */
  const closeConversation = useCallback(
    (conversationId: string, closedBy: "user" | "admin") => {
      const current = chatCache ?? [];
      const systemMsg: ChatMessage = {
        id: `${Date.now()}-sys`,
        text:
          closedBy === "admin"
            ? "This conversation has been closed by support."
            : "You ended the conversation.",
        sender: "support",
        senderName: "System",
        time: timeNow(),
        createdAt: Date.now(),
      };
      const updated = current.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              status: "closed" as const,
              closedBy,
              messages: [...c.messages, systemMsg],
              lastActivity: new Date().toISOString(),
            }
          : c,
      );
      persistChat(updated);
      chatApi("chat.closeConversation", { conversationId, closedBy });
    },
    [],
  );

  /** Reopen a closed conversation — local + server */
  const reopenConversation = useCallback((conversationId: string) => {
    const current = chatCache ?? [];
    const updated = current.map((c) =>
      c.id === conversationId
        ? { ...c, status: "open" as const, closedBy: undefined }
        : c,
    );
    persistChat(updated);
    chatApi("chat.reopenConversation", { conversationId });
  }, []);

  /** Total unread count across all conversations (for admin badge) */
  const totalUnreadByAdmin = conversations.reduce(
    (sum, c) => sum + c.unreadByAdmin,
    0,
  );

  /** Trigger an immediate server sync (e.g. when opening chat, connecting to agent) */
  const refreshNow = useCallback(() => {
    if (pollFn) pollFn();
  }, []);

  /**
   * Translate a single message to a target language.
   * Returns the translated text and caches it on the local message object.
   */
  const translateMessage = useCallback(
    async (conversationId: string, messageId: string, targetLang: string): Promise<string | null> => {
      // Check local cache first
      const current = chatCache ?? [];
      const convo = current.find((c) => c.id === conversationId);
      const msg = convo?.messages.find((m) => m.id === messageId);
      if (msg?.translations?.[targetLang]) return msg.translations[targetLang];

      // Call server
      const result = await chatApi<{ translatedText: string }>(
        "chat.translateMessage",
        { conversationId, messageId, targetLang },
      );
      if (result?.translatedText) {
        // Cache locally
        const updated = (chatCache ?? []).map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === messageId
                    ? { ...m, translations: { ...m.translations, [targetLang]: result.translatedText } }
                    : m,
                ),
              }
            : c,
        );
        persistChat(updated);
        return result.translatedText;
      }
      return null;
    },
    [],
  );

  /**
   * Translate multiple messages at once (e.g. entire conversation).
   * Returns a map of messageId -> translatedText.
   */
  const translateBatch = useCallback(
    async (
      conversationId: string,
      messageIds: string[],
      targetLang: string,
    ): Promise<Record<string, string>> => {
      // Filter out already-cached translations
      const current = chatCache ?? [];
      const convo = current.find((c) => c.id === conversationId);
      const cached: Record<string, string> = {};
      const uncachedIds: string[] = [];

      for (const id of messageIds) {
        const msg = convo?.messages.find((m) => m.id === id);
        if (msg?.translations?.[targetLang]) {
          cached[id] = msg.translations[targetLang];
        } else {
          uncachedIds.push(id);
        }
      }

      if (uncachedIds.length === 0) return cached;

      const result = await chatApi<{ translations: Record<string, string> }>(
        "chat.translateBatch",
        { conversationId, messageIds: uncachedIds, targetLang },
      );

      const serverTranslations = result?.translations ?? {};

      // Merge and cache locally
      const allTranslations = { ...cached, ...serverTranslations };
      const updated = (chatCache ?? []).map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: c.messages.map((m) => {
                const translated = serverTranslations[m.id];
                if (translated) {
                  return { ...m, translations: { ...m.translations, [targetLang]: translated } };
                }
                return m;
              }),
            }
          : c,
      );
      persistChat(updated);
      return allTranslations;
    },
    [],
  );

  return {
    conversations,
    ensureConversation,
    sendUserMessage,
    sendAdminMessage,
    markReadByAdmin,
    markReadByUser,
    closeConversation,
    reopenConversation,
    totalUnreadByAdmin,
    refreshNow,
    translateMessage,
    translateBatch,
  };
}
