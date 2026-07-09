import React from "react";
import { useNavigate } from "react-router-dom";
import { NotificationBell } from "./NotificationBell";

export interface HeaderProps {
  userName?: string;
  userSubtitle?: string;
  avatarUrl?: string;
  onLogout?: () => void;
  /** Apagar en Storybook: la campanita depende de Supabase y RoomieContext */
  showBell?: boolean;
}

const navLinks = [
  { label: "Find Roomies", path: "/matchmaking" },
  { label: "Explore Spaces", path: "/explorar" },
  { label: "Post Space", path: "/publish-department" },
  { label: "My Spaces", path: "/mis-publicaciones" },
  { label: "Requests", path: "/solicitudes" },
  { label: "Messages", path: "/mensajes" },
  { label: "Finance", path: "/finanzas" },
];

export const Header: React.FC<HeaderProps> = ({
  userName = "Roomie",
  userSubtitle = "Universidad Central",
  avatarUrl,
  onLogout,
  showBell = true,
}) => {
  const navigate = useNavigate();

  return (
    <header className="mb-16 flex flex-col gap-4 rounded-[24px] bg-[#8C3A27] px-6 py-4 shadow-lg lg:flex-row lg:items-center lg:justify-between">
      <button
        onClick={() => navigate("/dashboard")}
        className="text-left text-xl font-bold text-white"
      >
        Roomie<span className="text-[#F3C1AB]">Smart</span>
      </button>

      <nav className="flex flex-wrap gap-5 text-sm font-medium text-white/75">
        {navLinks.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className="transition-colors hover:text-white"
          >
            {link.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        {showBell && <NotificationBell />}
        <div className="text-right">
          <p className="text-sm font-bold text-white">{userName}</p>
          <p className="text-xs text-white/60">{userSubtitle}</p>
        </div>
        <button
          onClick={() => navigate("/perfil")}
          title="Editar mi perfil"
          className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white/20 ring-2 ring-transparent transition hover:ring-white"
        >
          <img
            src={
              avatarUrl ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`
            }
            alt="Avatar"
            className="h-full w-full object-cover"
          />
        </button>
        {onLogout && (
          <button
            onClick={onLogout}
            title="Cerrar sesión"
            className="rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/30"
          >
            Salir
          </button>
        )}
      </div>
    </header>
  );
};
