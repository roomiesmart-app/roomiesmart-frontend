import React, { useEffect } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import api from "../identity-profile/services/api";
import { useSessionStore } from "../../stores/useSessionStore";

// Migrado a Zustand: el estado global vive en useSessionStore (persistido
// en localStorage). Este provider queda como "bootstrapper": resuelve el
// UUID real del usuario vía /me cuando hay sesión de Kinde. La API pública
// useRoomie() se conserva para no tocar las páginas existentes.

export function RoomieProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, getIdToken } = useKindeAuth();
  const setOwnerId = useSessionStore((state) => state.setOwnerId);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    const fetchProfileId = async () => {
      try {
        // Token explícito: este efecto puede correr antes de que el
        // AxiosInterceptor registre su interceptor de Authorization.
        const token = await getIdToken();
        const response = await api.get("/api/v1/identity/me", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const profileId: string = response.data?.data?.id || "";
        if (!cancelled && profileId) {
          setOwnerId(profileId);
        }
      } catch (error) {
        console.error("No se pudo recuperar el perfil del usuario:", error);
      }
    };

    fetchProfileId();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, getIdToken, setOwnerId]);

  return <>{children}</>;
}

export function useRoomie() {
  const ownerId = useSessionStore((state) => state.ownerId);
  const departmentId = useSessionStore((state) => state.departmentId);
  const setOwnerId = useSessionStore((state) => state.setOwnerId);
  const setDepartmentId = useSessionStore((state) => state.setDepartmentId);

  return { ownerId, departmentId, setOwnerId, setDepartmentId };
}
