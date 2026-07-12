import React from "react";

interface ModalShellProps {
  onClose: () => void;
  children: React.ReactNode;

  // Clases del panel blanco (ancho, padding, etc.)
  panelClassName?: string;
}

export const ModalShell: React.FC<ModalShellProps> = ({
  onClose,
  children,
  panelClassName = "max-w-md rounded-[2rem] p-8",
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    onClick={onClose}
  >
    <div
      className={`relative w-full bg-white shadow-2xl ${panelClassName}`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);
