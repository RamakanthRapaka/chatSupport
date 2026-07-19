import { apiGet } from "./httpClient.js";
import { conversationRoom } from "./rooms.js";

async function ensureConversationAccess(socket, config, conversationId) {
  const session = socket.data.session;
  if (!session?.token) {
    throw new Error("Unauthenticated socket.");
  }

  await apiGet(
    `${config.fastapiBaseUrl}/chat/conversations/${conversationId}`,
    session.token,
  );
}

export function registerSocketEvents(io, socket, config) {
  socket.on("join_conversation", async (payload = {}, callback) => {
    try {
      const conversationId = Number(payload.conversationId);
      if (!conversationId) {
        throw new Error("conversationId is required.");
      }

      await ensureConversationAccess(socket, config, conversationId);
      const room = conversationRoom(conversationId);
      await socket.join(room);

      callback?.({
        success: true,
        room,
        conversationId,
      });
    } catch (error) {
      callback?.({
        success: false,
        message: error instanceof Error ? error.message : "Unable to join conversation.",
      });
    }
  });

  socket.on("leave_conversation", async (payload = {}, callback) => {
    const conversationId = Number(payload.conversationId);
    if (!conversationId) {
      callback?.({ success: false, message: "conversationId is required." });
      return;
    }

    const room = conversationRoom(conversationId);
    await socket.leave(room);

    callback?.({
      success: true,
      room,
      conversationId,
    });
  });

  socket.on("broadcast_message", async (payload = {}, callback) => {
    try {
      const conversationId = Number(payload.conversationId);
      const message = payload.message;

      if (!conversationId || !message?.id) {
        throw new Error("conversationId and saved message payload are required.");
      }

      await ensureConversationAccess(socket, config, conversationId);

      const room = conversationRoom(conversationId);
      io.to(room).emit("message_created", {
        conversationId,
        message,
      });

      callback?.({ success: true });
    } catch (error) {
      callback?.({
        success: false,
        message: error instanceof Error ? error.message : "Unable to broadcast message.",
      });
    }
  });

  socket.on("broadcast_read", async (payload = {}, callback) => {
    try {
      const conversationId = Number(payload.conversationId);
      const lastReadMessageId = Number(payload.lastReadMessageId);

      if (!conversationId || !lastReadMessageId) {
        throw new Error("conversationId and lastReadMessageId are required.");
      }

      await ensureConversationAccess(socket, config, conversationId);

      const room = conversationRoom(conversationId);
      io.to(room).emit("conversation_read", {
        conversationId,
        userId: socket.data.session.user.id,
        lastReadMessageId,
      });

      callback?.({ success: true });
    } catch (error) {
      callback?.({
        success: false,
        message: error instanceof Error ? error.message : "Unable to broadcast read status.",
      });
    }
  });
}
