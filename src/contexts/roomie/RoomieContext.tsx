import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useMsal } from "@azure/msal-react";

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
  const { accounts } = useMsal();
  const [ownerId, setOwnerId] = useState<string>(getInitialState().ownerId);
  const [departmentId, setDepartmentId] = useState<string>(
    getInitialState().departmentId,
  );

  useEffect(() => {
    if (accounts.length === 0) return;

    const account = accounts[0] as any;
    const claimOwnerId =
      account.idTokenClaims?.oid || account.homeAccountId || "";
    if (claimOwnerId && claimOwnerId !== ownerId) {
      setOwnerId(claimOwnerId);
    }
  }, [accounts, ownerId]);

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
