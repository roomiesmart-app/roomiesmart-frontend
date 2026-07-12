import React from "react";
import type { ToastState } from "../../../hooks/useToast";

export const Toast: React.FC<{ toast: ToastState | null }> = ({ toast }) => {
  if (!toast) return null;
  return (
    <div
      role="status"
      className={`fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg ${
        toast.variant === "success" ? "bg-[#059669]" : "bg-[#DC2626]"
      }`}
    >
      {toast.message}
    </div>
  );
};
