import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useRoomie } from "../../roomie/RoomieContext";
import { useDebounce } from "../../../hooks/useDebounce";
import { listSpaces, type PublishedSpace } from "../services/PublishService";
import { requestToJoin } from "../services/MembershipService";
import { ChatModal } from "../components/ChatModal";
import { SpaceCard } from "../components/SpaceCard";
import { Button } from "../../../shared/components/Button";
import { PageHeader } from "../../../shared/components/ui/PageHeader";
import { AlertBanner } from "../../../shared/components/ui/AlertBanner";
import { EmptyState } from "../../../shared/components/ui/EmptyState";

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
        <PageHeader
          eyebrow="Shared Spaces"
          title="Espacios disponibles"
          subtitle="Explora departamentos y habitaciones publicados por otros roomies."
          actions={
            <>
              <Button variant="secondary" onClick={() => navigate("/dashboard")}>
                Volver al inicio
              </Button>
              <Button onClick={() => navigate("/publish-department")}>
                Publicar el mío
              </Button>
            </>
          }
        />

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

        {error && <AlertBanner>{error}</AlertBanner>}

        {joinError && <AlertBanner variant="warning">{joinError}</AlertBanner>}

        {loading ? (
          <p className="text-center text-gray-500">Cargando espacios...</p>
        ) : filteredSpaces.length === 0 && !error ? (
          <EmptyState
            title={
              debouncedQuery
                ? "Ningún espacio coincide con tu búsqueda"
                : "Aún no hay espacios publicados"
            }
            subtitle={
              debouncedQuery
                ? "Prueba con otro barrio, título o tipo de espacio."
                : "Sé el primero en publicar tu departamento."
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSpaces.map((space) => {
              const isMine = ownerId && space.owner_id === ownerId;
              return (
                <SpaceCard
                  key={space.id}
                  space={space}
                  imageHeightClass="h-48"
                  showTypeBadge
                >
                  <div className="flex flex-col gap-2">
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
                </SpaceCard>
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
