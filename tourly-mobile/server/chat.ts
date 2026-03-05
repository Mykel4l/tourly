/**
 * Server-side in-memory chat store + tRPC router.
 *
 * Conversations live in memory (lost on restart).  For production you'd
 * persist to a database table – but for the demo this is sufficient and
 * keeps things simple without requiring DB migrations.
 */

import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";

// NOTE: In production, admin-only endpoints should use `adminProcedure`.
// Using `publicProcedure` here for demo compatibility with client-side
// dummy login which doesn't create a server-side session.

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "support";
  senderName?: string;
  time: string;
  createdAt: number; // epoch ms – used for polling "since"
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
  lastActivity: string; // ISO
  unreadByAdmin: number;
  unreadByUser: number;
  status: "open" | "closed";
  closedBy?: "user" | "admin";
}

// ─── In-memory store ────────────────────────────────────────────────────────

const conversations: Map<string, ChatConversation> = new Map();

function getOrCreateConvo(
  id: string,
  userName: string,
  userEmail: string,
): ChatConversation {
  let convo = conversations.get(id);
  if (!convo) {
    convo = {
      id,
      userName,
      userEmail,
      messages: [],
      lastActivity: new Date().toISOString(),
      unreadByAdmin: 0,
      unreadByUser: 0,
      status: "open",
    };
    conversations.set(id, convo);
  }
  return convo;
}

function timeNow() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── tRPC Router ────────────────────────────────────────────────────────────

export const chatRouter = router({
  /**
   * Ensure a conversation exists (called by the user side when connecting to
   * a live agent). Returns the conversation id.
   */
  ensure: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
        userName: z.string(),
        userEmail: z.string(),
      }),
    )
    .mutation(({ input }) => {
      const convo = getOrCreateConvo(
        input.conversationId,
        input.userName,
        input.userEmail,
      );
      return { id: convo.id };
    }),

  /**
   * Send a message from the user side.
   */
  sendUserMessage: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
        text: z.string().min(1).max(2000),
        userName: z.string().optional(),
        userEmail: z.string().optional(),
        lang: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      const convo = getOrCreateConvo(
        input.conversationId,
        input.userName ?? "Guest",
        input.userEmail ?? "",
      );
      if (convo.status === "closed") {
        // Reopen conversation when user sends a new message
        convo.status = "open";
        convo.closedBy = undefined;
      }
      const msg: ChatMessage = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        text: input.text,
        sender: "user",
        time: timeNow(),
        createdAt: Date.now(),
        originalLang: input.lang,
      };
      convo.messages.push(msg);
      convo.lastActivity = new Date().toISOString();
      convo.unreadByAdmin += 1;
      return msg;
    }),

  /**
   * Send a message from the admin/support side.
   */
  sendAdminMessage: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
        text: z.string().min(1).max(2000),
        lang: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      const convo = conversations.get(input.conversationId);
      if (!convo) {
        throw new Error("Conversation not found");
      }
      const msg: ChatMessage = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        text: input.text,
        sender: "support",
        senderName: "Admin",
        time: timeNow(),
        createdAt: Date.now(),
        originalLang: input.lang,
      };
      convo.messages.push(msg);
      convo.lastActivity = new Date().toISOString();
      convo.unreadByUser += 1;
      return msg;
    }),

  /**
   * Mark a conversation as read by admin.
   */
  markReadByAdmin: publicProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(({ input }) => {
      const convo = conversations.get(input.conversationId);
      if (convo) convo.unreadByAdmin = 0;
      return { ok: true };
    }),

  /**
   * Mark a conversation as read by user.
   */
  markReadByUser: publicProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(({ input }) => {
      const convo = conversations.get(input.conversationId);
      if (convo) convo.unreadByUser = 0;
      return { ok: true };
    }),

  /**
   * Close a conversation. Can be called by either user or admin.
   */
  closeConversation: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
        closedBy: z.enum(["user", "admin"]),
      }),
    )
    .mutation(({ input }) => {
      const convo = conversations.get(input.conversationId);
      if (!convo) throw new Error("Conversation not found");
      convo.status = "closed";
      convo.closedBy = input.closedBy;
      convo.lastActivity = new Date().toISOString();
      // Add a system message
      const msg: ChatMessage = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        text: input.closedBy === "admin"
          ? "This conversation has been closed by support."
          : "User ended the conversation.",
        sender: "support",
        senderName: "System",
        time: timeNow(),
        createdAt: Date.now(),
      };
      convo.messages.push(msg);
      return { ok: true };
    }),

  /**
   * Reopen a closed conversation (admin).
   */
  reopenConversation: publicProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(({ input }) => {
      const convo = conversations.get(input.conversationId);
      if (!convo) throw new Error("Conversation not found");
      convo.status = "open";
      convo.closedBy = undefined;
      convo.lastActivity = new Date().toISOString();
      return { ok: true };
    }),

  /**
   * Get all conversations (admin only). Supports "since" for incremental
   * polling – only returns conversations that have new messages after the
   * given epoch-ms timestamp.
   */
  listConversations: publicProcedure
    .input(z.object({ since: z.number().optional() }).optional())
    .query(({ input }) => {
      const since = input?.since ?? 0;
      const all = Array.from(conversations.values());
      if (since === 0) return all;
      // Only conversations with messages newer than "since"
      return all.filter((c) =>
        c.messages.some((m) => m.createdAt > since),
      );
    }),

  /**
   * Get messages for a single conversation.  Supports "since" for polling.
   */
  getMessages: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
        since: z.number().optional(),
      }),
    )
    .query(({ input }) => {
      const convo = conversations.get(input.conversationId);
      if (!convo) return { messages: [], unreadByUser: 0, unreadByAdmin: 0 };
      const since = input.since ?? 0;
      const msgs =
        since === 0
          ? convo.messages
          : convo.messages.filter((m) => m.createdAt > since);
      return {
        messages: msgs,
        unreadByUser: convo.unreadByUser,
        unreadByAdmin: convo.unreadByAdmin,
      };
    }),

  /**
   * Translate a chat message to a target language using the LLM.
   * Results are cached on the server-side ChatMessage to avoid re-translating.
   */
  translateMessage: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
        messageId: z.string(),
        targetLang: z.string().min(2).max(5),
      }),
    )
    .mutation(async ({ input }) => {
      const convo = conversations.get(input.conversationId);
      if (!convo) throw new Error("Conversation not found");

      const msg = convo.messages.find((m) => m.id === input.messageId);
      if (!msg) throw new Error("Message not found");

      // Return cached translation if available
      if (msg.translations?.[input.targetLang]) {
        return { translatedText: msg.translations[input.targetLang] };
      }

      // Use LLM to translate
      try {
        const result = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are a translation assistant. Translate the following chat message to ${input.targetLang}. Return ONLY the translated text, nothing else. Do not add quotes or explanations. Preserve the original tone and meaning. If the text is already in the target language, return it unchanged.`,
            },
            {
              role: "user",
              content: msg.text,
            },
          ],
          maxTokens: 500,
        });

        const translated =
          typeof result.choices?.[0]?.message?.content === "string"
            ? result.choices[0].message.content.trim()
            : msg.text;

        // Cache the translation on the message
        if (!msg.translations) msg.translations = {};
        msg.translations[input.targetLang] = translated;

        return { translatedText: translated };
      } catch (err) {
        // If LLM fails, return original text
        console.error("Translation failed:", err);
        return { translatedText: msg.text };
      }
    }),

  /**
   * Batch translate multiple messages in one call.
   * Useful for translating an entire conversation at once.
   */
  translateBatch: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
        messageIds: z.array(z.string()).max(50),
        targetLang: z.string().min(2).max(5),
      }),
    )
    .mutation(async ({ input }) => {
      const convo = conversations.get(input.conversationId);
      if (!convo) throw new Error("Conversation not found");

      const results: Record<string, string> = {};
      const toTranslate: { id: string; text: string }[] = [];

      // Collect cached and uncached
      for (const msgId of input.messageIds) {
        const msg = convo.messages.find((m) => m.id === msgId);
        if (!msg) continue;
        if (msg.translations?.[input.targetLang]) {
          results[msgId] = msg.translations[input.targetLang];
        } else {
          toTranslate.push({ id: msgId, text: msg.text });
        }
      }

      // Batch translate uncached messages via a single LLM call
      if (toTranslate.length > 0) {
        try {
          const numbered = toTranslate
            .map((m, i) => `[${i}] ${m.text}`)
            .join("\n");

          const result = await invokeLLM({
            messages: [
              {
                role: "system",
                content: `You are a translation assistant. Translate each numbered chat message below to ${input.targetLang}. Return each translation on its own line prefixed with the same [N] number. Return ONLY the numbered translations, nothing else. Preserve the original tone and meaning.`,
              },
              {
                role: "user",
                content: numbered,
              },
            ],
            maxTokens: 2000,
          });

          const rawOutput =
            typeof result.choices?.[0]?.message?.content === "string"
              ? result.choices[0].message.content.trim()
              : "";

          // Parse "[N] translated text" lines — group continuation lines that
          // don't start with a new [N] marker back into the previous entry.
          const lines = rawOutput.split("\n");
          let currentIdx = -1;
          let currentText = "";
          const flush = () => {
            if (currentIdx >= 0 && currentIdx < toTranslate.length) {
              const msgId = toTranslate[currentIdx].id;
              results[msgId] = currentText.trim();
              // Cache on server
              const msg = convo.messages.find((m) => m.id === msgId);
              if (msg) {
                if (!msg.translations) msg.translations = {};
                msg.translations[input.targetLang] = currentText.trim();
              }
            }
          };
          for (const line of lines) {
            const match = line.match(/^\[(\d+)\]\s*(.*)$/);
            if (match) {
              flush(); // save previous entry
              currentIdx = parseInt(match[1], 10);
              currentText = match[2];
            } else if (currentIdx >= 0 && line.trim()) {
              // Continuation line for the current translation
              currentText += "\n" + line;
            }
          }
          flush(); // save last entry

          // Fill in any that weren't parsed (fallback to original)
          for (const item of toTranslate) {
            if (!results[item.id]) {
              results[item.id] = item.text;
            }
          }
        } catch (err) {
          console.error("Batch translation failed:", err);
          for (const item of toTranslate) {
            if (!results[item.id]) results[item.id] = item.text;
          }
        }
      }

      return { translations: results };
    }),
});
