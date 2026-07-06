import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoomie } from "../../roomie/RoomieContext";
import { listSpaces, type PublishedSpace } from "../services/PublishService";
import { ChatModal } from "../components/ChatModal";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600";

export const ExploreSpacesPage: React.FC = () => {
  const navigate = useNavigate();
  const { ownerId } = useRoomie();
  const [spaces, setSpaces] = useState<PublishedSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chatTarget, setChatTarget] = useState<PublishedSpace | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchSpaces = async () => {
      try {
        const data = await listSpaces();
        if (!cancelled) setSpaces(data);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("No pudimos cargar los espacios. Intenta de nuevo.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSpaces();
    return () => {
      cancelled = true;
    };
  }, []);

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

        {error && (
          <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Cargando espacios...</p>
        ) : spaces.length === 0 && !error ? (
          <div className="rounded-[32px] border border-[#F1DED6] bg-white p-12 text-center">
            <p className="text-lg font-bold text-[#3B241C] mb-2">
              Aún no hay espacios publicados
            </p>
            <p className="text-sm text-gray-500">
              Sé el primero en publicar tu departamento.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {spaces.map((space) => {
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
                    <div className="mt-auto pt-4">
                      {isMine ? (
                        <p className="rounded-full bg-gray-100 py-3 text-center text-sm font-semibold text-gray-500">
                          Tu publicación
                        </p>
                      ) : (
                        <button
                          onClick={() => setChatTarget(space)}
                          className="w-full rounded-full bg-[#8C3A27] py-3 text-sm font-semibold text-white hover:bg-[#702d1f] transition"
                        >
                          Mensaje
                        </button>
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
