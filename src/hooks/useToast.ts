import { useCallback, useEffect, useState } from "react";

export interface ToastState {
  message: string;
  variant: "success" | "error";
}

export function useToast(durationMs = 3500) {
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), durationMs);
    return () => clearTimeout(timer);
  }, [toast, durationMs]);

  const showToast = useCallback(
    (message: string, variant: ToastState["variant"] = "success") =>
      setToast({ message, variant }),
    [],
  );

  return { toast, showToast };
}
