import React, { useCallback, useEffect, useRef, useState } from "react";
import api from "../../identity-profile/services/api";
import { useChatSocket } from "../../chat/useChatSocket";

interface ChatMessage {
  id: string;
  sender_id: string;
  content: string;
  is_read?: boolean;
  created_at: string;
}

interface ChatModalProps {
  currentUserId: string;
  targetUserId: string;
  targetName: string;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  currentUserId,
  targetUserId,
  targetName,
  onClose,
}) => {
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { socket, connected } = useChatSocket();

  // Agrega un mensaje evitando duplicados (ack + broadcast del room)
  const appendMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) =>
      prev.some((m) => m.id === message.id) ? prev : [...prev, message],
    );
  }, []);

  // 1) POST /conversations: inicia o recupera la conversación con el dueño
  useEffect(() => {
    let cancelled = false;

    const initConversation = async () => {
      try {
        const response = await api.post("/api/v1/roomies/conversations", {
          currentUserId,
          targetUserId,
        });
        if (!cancelled) {
          setConversationId(response.data?.conversationId || "");
        }
      } catch {
        if (!cancelled) {
          setError("No se pudo iniciar la conversación.");
          setLoading(false);
        }
      }
    };

    initConversation();
    return () => {
      cancelled = true;
    };
  }, [currentUserId, targetUserId]);

  // 2) GET /conversations/:id/messages: historial inicial (una sola vez;
  //    el tiempo real llega por Socket.io, ya no hay polling)
  const loadMessages = useCallback(async () => {
    if (!conversationId) return;
    try {
      const response = await api.get(
        `/api/v1/roomies/conversations/${conversationId}/messages`,
      );
      const data: ChatMessage[] = Array.isArray(response.data)
        ? response.data
        : [];
      // El backend entrega del más reciente al más antiguo
      setMessages([...data].reverse());
      setError("");
    } catch {
      setError("No se pudieron cargar los mensajes.");
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;
    loadMessages();
  }, [conversationId, loadMessages]);

  // 2b) Tiempo real: unirse al room de la conversación y escuchar mensajes
  useEffect(() => {
    if (!conversationId) return;

    socket.emit("join_conversation", conversationId);
    const onNewMessage = (message: ChatMessage) => appendMessage(message);
    socket.on("new_message", onNewMessage);

    return () => {
      socket.emit("leave_conversation", conversationId);
      socket.off("new_message", onNewMessage);
    };
  }, [conversationId, socket, appendMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // 3) Enviar mensaje: Socket.io con ack; si el socket está caído,
  //    fallback al POST REST original.
  const sendViaSocket = (content: string) =>
    new Promise<ChatMessage>((resolve, reject) => {
      const timeout = window.setTimeout(
        () => reject(new Error("Sin respuesta del servidor.")),
        5000,
      );
      socket.emit(
        "send_message",
        { conversationId, senderId: currentUserId, content },
        (response: { ok: boolean; message?: ChatMessage; error?: string }) => {
          window.clearTimeout(timeout);
          if (response?.ok && response.message) resolve(response.message);
          else reject(new Error(response?.error || "No se pudo enviar."));
        },
      );
    });

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content || !conversationId || sending) return;

    setSending(true);
    setError("");
    try {
      let message: ChatMessage;
      if (connected) {
        message = await sendViaSocket(content);
      } else {
        // Fallback REST: el chat sigue funcionando sin WebSocket
        const response = await api.post(
          `/api/v1/roomies/conversations/${conversationId}/messages`,
          { senderId: currentUserId, content },
        );
        message = response.data;
      }
      setDraft("");
      appendMessage(message);
    } catch {
      setError("No se pudo enviar el mensaje. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[480px] w-[360px] flex-col overflow-hidden rounded-[28px] border border-[#F1DED6] bg-white shadow-2xl">
      <header className="flex items-center justify-between bg-[#8C3A27] px-5 py-4 text-white">
        <div>
          <p className="text-sm font-bold">{targetName}</p>
          <p className="text-xs text-white/70">
            {!conversationId
              ? "Conectando..."
              : connected
                ? "En vivo ⚡"
                : "Conectado (modo respaldo)"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-white/15 px-3 py-1 text-sm font-bold hover:bg-white/25 transition"
          aria-label="Cerrar chat"
        >
          ✕
        </button>
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto bg-[#FDF8F6] p-4">
        {loading && (
          <p className="text-center text-xs text-gray-400">
            Cargando mensajes...
          </p>
        )}
        {!loading && messages.length === 0 && !error && (
          <p className="text-center text-xs text-gray-400">
            Aún no hay mensajes. ¡Rompe el hielo!
          </p>
        )}
        {messages.map((message) => {
          const isMine = message.sender_id === currentUserId;
          return (
            <div
              key={message.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                  isMine
                    ? "bg-[#8C3A27] text-white rounded-br-md"
                    : "bg-white text-[#3B241C] border border-[#F1DED6] rounded-bl-md"
                }`}
              >
                {message.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="border-t border-red-100 bg-red-50 px-4 py-2 text-xs text-red-600">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-[#F1DED6] bg-white p-3"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 rounded-full border border-[#E5D1C6] bg-[#FDF8F6] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30"
        />
        <button
          type="submit"
          disabled={sending || !conversationId || !draft.trim()}
          className="rounded-full bg-[#8C3A27] px-4 py-2 text-sm font-semibold text-white hover:bg-[#702d1f] transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};
