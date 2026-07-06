import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../identity-profile/services/api";
import { useRoomie } from "../../roomie/RoomieContext";
import { ChatModal } from "../components/ChatModal";

interface InboxItem {
  conversationId: string;
  participant: { id: string; email: string } | null;
  lastMessage: {
    conversation_id: string;
    content: string;
    sender_id: string;
    created_at: string;
  } | null;
}

export const InboxPage: React.FC = () => {
  const navigate = useNavigate();
  const { ownerId } = useRoomie();
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openChat, setOpenChat] = useState<InboxItem | null>(null);

  useEffect(() => {
    if (!ownerId) return;
    let cancelled = false;

    const fetchInbox = async () => {
      try {
        const response = await api.get(
          `/api/v1/roomies/conversations/user/${ownerId}`,
        );
        if (!cancelled) setItems(response.data?.data || []);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("No pudimos cargar tus conversaciones.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchInbox();
    return () => {
      cancelled = true;
    };
  }, [ownerId]);

  const displayName = (item: InboxItem) =>
    item.participant?.email?.split("@")[0] || "Roomie";

  return (
    <div className="min-h-screen bg-[#FDF7F5] px-6 py-8 sm:px-10 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-[#A3513D]">
              Mensajes
            </p>
            <h1 className="text-4xl font-extrabold text-[#3B241C]">
              Bandeja de entrada
            </h1>
            <p className="mt-2 text-gray-500">
              Todas tus conversaciones activas, en un solo lugar.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-full border border-[#8C3A27] bg-white px-6 py-3 text-sm font-semibold text-[#8C3A27] hover:bg-[#F9F2EE] transition"
          >
            Volver al inicio
          </button>
        </header>

        {error && (
          <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Cargando conversaciones...</p>
        ) : items.length === 0 ? (
          <div className="rounded-[32px] border border-[#F1DED6] bg-white p-12 text-center">
            <p className="mb-2 text-lg font-bold text-[#3B241C]">
              No tienes conversaciones todavía
            </p>
            <p className="mb-6 text-sm text-gray-500">
              Explora espacios o roomies y envía tu primer mensaje.
            </p>
            <button
              onClick={() => navigate("/explorar")}
              className="rounded-full bg-[#8C3A27] px-8 py-3 text-sm font-semibold text-white hover:bg-[#702d1f] transition"
            >
              Explorar espacios
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <button
                key={item.conversationId}
                onClick={() => item.participant && setOpenChat(item)}
                className="flex w-full items-center gap-4 rounded-[24px] border border-[#F1DED6] bg-white p-5 text-left shadow-sm hover:border-[#8C3A27]/40 hover:shadow transition"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#FDF0EB]">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.participant?.email || "roomie")}`}
                    alt={displayName(item)}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-bold text-[#3B241C]">
                      {displayName(item)}
                    </p>
                    {item.lastMessage && (
                      <p className="shrink-0 text-xs text-gray-400">
                        {new Date(item.lastMessage.created_at).toLocaleDateString(
                          "es-EC",
                          { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" },
                        )}
                      </p>
                    )}
                  </div>
                  <p className="truncate text-sm text-gray-500">
                    {item.lastMessage
                      ? `${item.lastMessage.sender_id === ownerId ? "Tú: " : ""}${item.lastMessage.content}`
                      : "Sin mensajes aún"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {openChat && openChat.participant && ownerId && (
        <ChatModal
          currentUserId={ownerId}
          targetUserId={openChat.participant.id}
          targetName={displayName(openChat)}
          onClose={() => setOpenChat(null)}
        />
      )}
    </div>
  );
};
