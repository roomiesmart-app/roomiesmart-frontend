import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

// Conexión singleton: una sola instancia de Socket.io para toda la app.
// Va al mismo dominio del API (nginx enruta /socket.io/ al backend:3000).
let sharedSocket: Socket | null = null;

export function getChatSocket(): Socket {
  if (!sharedSocket) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    sharedSocket = io(baseUrl, {
      path: "/socket.io",
      // websocket primero; polling como red de seguridad si el proxy
      // no soporta upgrade (así el chat nunca muere del todo)
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
  }
  return sharedSocket;
}

/**
 * Hook de acceso al socket del chat.
 * Devuelve la instancia compartida y su estado de conexión reactivo.
 */
export function useChatSocket() {
  const socketRef = useRef<Socket>(getChatSocket());
  const [connected, setConnected] = useState(socketRef.current.connected);

  useEffect(() => {
    const socket = socketRef.current;
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onError = (err: Error) =>
      console.warn("🔌 Socket.io error de conexión:", err.message);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onError);
    };
  }, []);

  return { socket: socketRef.current, connected };
}
