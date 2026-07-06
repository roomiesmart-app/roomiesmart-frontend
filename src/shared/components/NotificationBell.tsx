import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabase } from "../../config/supabaseClient";
import { useRoomie } from "../../contexts/roomie/RoomieContext";

interface AppNotification {
  id: string;
  user_id: string;
  type: "new_message" | "join_request" | "request_accepted" | "request_rejected";
  title: string;
  body: string | null;
  resource_id: string | null;
  is_read: boolean;
  created_at: string;
}

const routeForType: Record<AppNotification["type"], string> = {
  new_message: "/mensajes",
  join_request: "/solicitudes",
  request_accepted: "/finanzas",
  request_rejected: "/explorar",
};

const iconForType: Record<AppNotification["type"], string> = {
  new_message: "💬",
  join_request: "🤝",
  request_accepted: "✅",
  request_rejected: "❌",
};

export const NotificationBell: React.FC = () => {
  const navigate = useNavigate();
  const { ownerId } = useRoomie();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;


  useEffect(() => {
    if (!ownerId) return;

    let supabase;
    try {
      supabase = getSupabase();
    } catch (err) {
      console.error("Notificaciones deshabilitadas:", err);
      return;
    }

    let active = true;

    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", ownerId)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data, error }) => {
        if (!error && active && data) {
          setNotifications(data as AppNotification[]);
        }
      });

    const channel = supabase
      .channel(`notifications-${ownerId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${ownerId}`,
        },
        (payload) => {
          setNotifications((prev) =>
            [payload.new as AppNotification, ...prev].slice(0, 20),
          );
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [ownerId]);

  const markAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await getSupabase()
        .from("notifications")
        .update({ is_read: true })
        .in("id", unreadIds);
    } catch (err) {
      console.error("No se pudieron marcar como leídas:", err);
    }
  };

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) markAllRead();
  };

  const handleClickNotification = (notification: AppNotification) => {
    setOpen(false);
    navigate(routeForType[notification.type] || "/dashboard");
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        title="Notificaciones"
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#F1DED6] shadow-sm hover:bg-[#FDF0EB] transition"
      >
        <span className="text-lg">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8C3A27] px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-[20px] border border-[#F1DED6] bg-white shadow-2xl">
          <div className="border-b border-[#F5E8E2] bg-[#FDF8F6] px-4 py-3">
            <p className="text-sm font-bold text-[#3B241C]">Notificaciones</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-gray-400">
                Sin notificaciones por ahora.
              </p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleClickNotification(notification)}
                  className="flex w-full items-start gap-3 border-b border-[#F9F1ED] px-4 py-3 text-left hover:bg-[#FDF8F6] transition"
                >
                  <span className="mt-0.5 text-lg">
                    {iconForType[notification.type] || "🔔"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-[#3B241C]">
                      {notification.title}
                    </span>
                    {notification.body && (
                      <span className="block truncate text-xs text-gray-500">
                        {notification.body}
                      </span>
                    )}
                    <span className="block text-[10px] text-gray-400">
                      {new Date(notification.created_at).toLocaleString("es-EC", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
