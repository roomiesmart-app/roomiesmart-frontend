import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import api from "../identity-profile/services/api";

interface RoomieState {
  ownerId: string;
  departmentId: string;
}

interface RoomieContextProps extends RoomieState {
  setOwnerId: (ownerId: string) => void;
  setDepartmentId: (departmentId: string) => void;
}

const STORAGE_KEY = "roomieSmartState";

const RoomieContext = createContext<RoomieContextProps | undefined>(undefined);

function getInitialState(): RoomieState {
  if (typeof window === "undefined") {
    return { ownerId: "", departmentId: "" };
  }

  const cached = window.localStorage.getItem(STORAGE_KEY);
  if (!cached) {
    return { ownerId: "", departmentId: "" };
  }

  try {
    return JSON.parse(cached) as RoomieState;
  } catch {
    return { ownerId: "", departmentId: "" };
  }
}

export function RoomieProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, getIdToken } = useKindeAuth();
  const [ownerId, setOwnerId] = useState<string>(getInitialState().ownerId);
  const [departmentId, setDepartmentId] = useState<string>(
    getInitialState().departmentId,
  );

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
  }, [isAuthenticated, getIdToken]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ownerId, departmentId }),
    );
  }, [ownerId, departmentId]);

  const value = useMemo(
    () => ({ ownerId, departmentId, setOwnerId, setDepartmentId }),
    [ownerId, departmentId],
  );

  return (
    <RoomieContext.Provider value={value}>{children}</RoomieContext.Provider>
  );
}

export function useRoomie() {
  const context = useContext(RoomieContext);
  if (!context) {
    throw new Error("useRoomie must be used within RoomieProvider");
  }
  return context;
}
