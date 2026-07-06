import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoomie } from "../../roomie/RoomieContext";
import {
  listSpaces,
  unpublishSpace,
  type PublishedSpace,
} from "../services/PublishService";
import { EditSpaceModal } from "../components/EditSpaceModal";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600";

export const MySpacesPage: React.FC = () => {
  const navigate = useNavigate();
  const { ownerId } = useRoomie();
  const [spaces, setSpaces] = useState<PublishedSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<PublishedSpace | null>(null);
  const [deleting, setDeleting] = useState<PublishedSpace | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  useEffect(() => {
    if (!ownerId) return;
    let cancelled = false;

    const fetchMine = async () => {
      try {
        const all = await listSpaces();
        if (!cancelled) {
          setSpaces(all.filter((s) => s.owner_id === ownerId));
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("No pudimos cargar tus publicaciones.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMine();
    return () => {
      cancelled = true;
    };
  }, [ownerId]);

  const handleSaved = (updated: PublishedSpace) => {
    setSpaces((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setEditing(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await unpublishSpace(deleting.id);
      setSpaces((prev) => prev.filter((s) => s.id !== deleting.id));
      setDeleting(null);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "No se pudo dar de baja la publicación.",
      );
      setDeleting(null);
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF7F5] px-6 py-8 sm:px-10 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-[#A3513D]">
              KAN-142 · Mis espacios
            </p>
            <h1 className="text-4xl font-extrabold text-[#3B241C]">
              Mis publicaciones
            </h1>
            <p className="mt-2 text-gray-500">
              Edita los datos o da de baja los espacios que ya no ofreces.
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
              Nueva publicación
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Cargando tus publicaciones...</p>
        ) : spaces.length === 0 ? (
          <div className="rounded-[32px] border border-[#F1DED6] bg-white p-12 text-center">
            <p className="mb-2 text-lg font-bold text-[#3B241C]">
              No tienes publicaciones activas
            </p>
            <p className="text-sm text-gray-500">
              Publica tu departamento para que aparezca aquí.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {spaces.map((space) => (
              <article
                key={space.id}
                className="flex flex-col overflow-hidden rounded-[28px] border border-[#F1DED6] bg-white shadow-sm"
              >
                <div className="h-44 w-full overflow-hidden bg-gray-100">
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
                      <span className="text-xs font-semibold text-gray-400">/mes</span>
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {space.neighborhood || space.location_address}
                  </p>
                  <div className="mt-auto flex gap-3 pt-4">
                    <button
                      onClick={() => setEditing(space)}
                      className="flex-1 rounded-full border border-[#8C3A27] py-2.5 text-sm font-semibold text-[#8C3A27] hover:bg-[#F9F2EE] transition"
                    >
                      Editar publicación
                    </button>
                    <button
                      onClick={() => setDeleting(space)}
                      className="flex-1 rounded-full bg-red-50 py-2.5 text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-100 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <EditSpaceModal
          space={editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}

      {deleting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setDeleting(null)}
        >
          <div
            className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-xl font-extrabold text-gray-900">
              ¿Dar de baja esta publicación?
            </h3>
            <p className="mb-6 text-sm text-gray-500">
              "{deleting.title}" dejará de aparecer en la exploración. El
              historial de finanzas del departamento se conserva.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleting(null)}
                className="flex-1 rounded-full border border-gray-200 py-3 font-bold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteBusy}
                className="flex-1 rounded-full bg-red-600 py-3 font-bold text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleteBusy ? "Dando de baja..." : "Sí, dar de baja"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
