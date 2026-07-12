import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SessionState {

  ownerId: string;

  departmentId: string;
  setOwnerId: (ownerId: string) => void;
  setDepartmentId: (departmentId: string) => void;
  clearSession: () => void;
}

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
