import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useRoomie } from "../../roomie/RoomieContext";
import { useDebounce } from "../../../hooks/useDebounce";
import { listSpaces, type PublishedSpace } from "../services/PublishService";
import { requestToJoin } from "../services/MembershipService";
import { ChatModal } from "../components/ChatModal";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600";

const SNAPSHOT_KEY = "roomieSmartSpacesSnapshot";

function readSpacesSnapshot(): PublishedSpace[] | undefined {
  try {
    const raw = window.localStorage.getItem(SNAPSHOT_KEY);
    return raw ? (JSON.parse(raw) as PublishedSpace[]) : undefined;
  } catch {
    return undefined;
  }
}

export const ExploreSpacesPage: React.FC = () => {
  const navigate = useNavigate();
  const { ownerId } = useRoomie();
  const [chatTarget, setChatTarget] = useState<PublishedSpace | null>(null);

  const {
    data: spaces = [],
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey: ["spaces", "available"],
    queryFn: listSpaces,
    staleTime: 60_000,
    placeholderData: readSpacesSnapshot,
  });
  const error = isError
    ? "No pudimos cargar los espacios. Intenta de nuevo."
    : "";

  useEffect(() => {
    if (spaces.length === 0) return;
    try {
      window.localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(spaces));
    } catch {

    }
  }, [spaces]);
  const [joinStatus, setJoinStatus] = useState<
    Record<string, "sending" | "sent" | undefined>
  >({});
  const [joinError, setJoinError] = useState("");
  const [query, setQuery] = useState("");

  const debouncedQuery = useDebounce(query, 300);

  const filteredSpaces = useMemo(() => {
    const term = debouncedQuery.trim().toLowerCase();
    if (!term) return spaces;
    return spaces.filter((space) =>
      [space.title, space.neighborhood, space.space_type, space.location_address]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term)),
    );
  }, [spaces, debouncedQuery]);

  const handleRequestToJoin = async (space: PublishedSpace) => {
    if (!ownerId) {
      setJoinError("Todavía estamos cargando tu perfil. Intenta en unos segundos.");
      return;
    }
    setJoinError("");
    setJoinStatus((prev) => ({ ...prev, [space.id]: "sending" }));
    try {
      await requestToJoin(space.id, ownerId);
      setJoinStatus((prev) => ({ ...prev, [space.id]: "sent" }));
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "No se pudo enviar la solicitud.";

      if (message.includes("pendiente")) {
        setJoinStatus((prev) => ({ ...prev, [space.id]: "sent" }));
      } else {
        setJoinStatus((prev) => ({ ...prev, [space.id]: undefined }));
      }
      setJoinError(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF7F5] px-6 py-8 sm:px-10 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-[#A3513D]">
              Shared Spaces
            </p>
            <h1 className="text-4xl font-extrabold text-[#3B241C]">
              Espacios disponibles
            </h1>
            <p className="mt-2 text-gray-500">
              Explora departamentos y habitaciones publicados por otros roomies.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-full border border-[#8C3A27] bg-white px-6 py-3 text-sm font-semibold text-[#8C3A27] hover:bg-[#F9F2EE] transition"
            >
              Volver al inicio
            </button>
            <button
              onClick={() => navigate("/publish-department")}
              className="rounded-full bg-[#8C3A27] px-6 py-3 text-sm font-semibold text-white hover:bg-[#702d1f] transition"
            >
              Publicar el mío
            </button>
          </div>
        </header>

        <div className="mb-8">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 Busca por título, barrio o tipo de espacio..."
            className="w-full max-w-xl rounded-full border border-[#E5D1C6] bg-white px-6 py-3.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30"
          />
          {debouncedQuery && (
            <p className="mt-2 text-xs text-gray-500">
              {filteredSpaces.length} resultado(s) para “{debouncedQuery}”
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {joinError && (
          <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {joinError}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Cargando espacios...</p>
        ) : filteredSpaces.length === 0 && !error ? (
          <div className="rounded-[32px] border border-[#F1DED6] bg-white p-12 text-center">
            <p className="text-lg font-bold text-[#3B241C] mb-2">
              {debouncedQuery
                ? "Ningún espacio coincide con tu búsqueda"
                : "Aún no hay espacios publicados"}
            </p>
            <p className="text-sm text-gray-500">
              {debouncedQuery
                ? "Prueba con otro barrio, título o tipo de espacio."
                : "Sé el primero en publicar tu departamento."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSpaces.map((space) => {
              const isMine = ownerId && space.owner_id === ownerId;
              return (
                <article
                  key={space.id}
                  className="flex flex-col overflow-hidden rounded-[28px] border border-[#F1DED6] bg-white shadow-sm"
                >
                  <div className="h-48 w-full overflow-hidden bg-gray-100">
                    <img
                      src={space.images?.[0] || FALLBACK_IMAGE}
                      alt={space.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-bold text-[#3B241C] line-clamp-1">
                        {space.title}
                      </h2>
                      <p className="whitespace-nowrap text-lg font-extrabold text-[#8C3A27]">
                        ${Number(space.monthly_price).toFixed(0)}
                        <span className="text-xs font-semibold text-gray-400">
                          /mes
                        </span>
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {space.neighborhood || space.location_address}
                    </p>
                    {space.space_type && (
                      <span className="w-fit rounded-full bg-[#FDF0EB] px-3 py-1 text-xs font-semibold text-[#8C3A27]">
                        {space.space_type}
                      </span>
                    )}
                    <div className="mt-auto flex flex-col gap-2 pt-4">
                      {isMine ? (
                        <p className="rounded-full bg-gray-100 py-3 text-center text-sm font-semibold text-gray-500">
                          Tu publicación
                        </p>
                      ) : (
                        <>
                          <button
                            onClick={() => setChatTarget(space)}
                            className="w-full rounded-full bg-[#8C3A27] py-3 text-sm font-semibold text-white hover:bg-[#702d1f] transition"
                          >
                            Mensaje
                          </button>
                          <button
                            onClick={() => handleRequestToJoin(space)}
                            disabled={
                              joinStatus[space.id] === "sending" ||
                              joinStatus[space.id] === "sent"
                            }
                            className="w-full rounded-full border border-[#8C3A27] bg-white py-3 text-sm font-semibold text-[#8C3A27] hover:bg-[#F9F2EE] transition disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {joinStatus[space.id] === "sending"
                              ? "Enviando..."
                              : joinStatus[space.id] === "sent"
                                ? "Solicitud enviada ✓"
                                : "Solicitar Unirse"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {chatTarget && ownerId && (
        <ChatModal
          currentUserId={ownerId}
          targetUserId={chatTarget.owner_id}
          targetName={chatTarget.title}
          onClose={() => setChatTarget(null)}
        />
      )}
    </div>
  );
};
