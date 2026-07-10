import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SessionState {
  /** UUID del usuario en la BD (resuelto vía /api/v1/identity/me) */
  ownerId: string;
  /** Departamento activo (se setea al publicar un espacio) */
  departmentId: string;
  setOwnerId: (ownerId: string) => void;
  setDepartmentId: (departmentId: string) => void;
  clearSession: () => void;
}

// Mantiene la misma clave de localStorage que usaba RoomieContext,
// así el logout existente (removeItem) sigue funcionando.
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      ownerId: "",
      departmentId: "",
      setOwnerId: (ownerId) => set({ ownerId }),
      setDepartmentId: (departmentId) => set({ departmentId }),
      clearSession: () => set({ ownerId: "", departmentId: "" }),
    }),
    { name: "roomieSmartState" },
  ),
);
