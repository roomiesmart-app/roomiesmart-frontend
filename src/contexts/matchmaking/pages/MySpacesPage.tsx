import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoomie } from "../../roomie/RoomieContext";
import {
  listSpaces,
  unpublishSpace,
  type PublishedSpace,
} from "../services/PublishService";
import { EditSpaceModal } from "../components/EditSpaceModal";
import { SpaceCard } from "../components/SpaceCard";
import { Button } from "../../../shared/components/Button";
import { PageHeader } from "../../../shared/components/ui/PageHeader";
import { AlertBanner } from "../../../shared/components/ui/AlertBanner";
import { EmptyState } from "../../../shared/components/ui/EmptyState";
import { ModalShell } from "../../../shared/components/ui/ModalShell";

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
        <PageHeader
          eyebrow="KAN-142 · Mis espacios"
          title="Mis publicaciones"
          subtitle="Edita los datos o da de baja los espacios que ya no ofreces."
          actions={
            <>
              <Button variant="secondary" onClick={() => navigate("/dashboard")}>
                Volver al inicio
              </Button>
              <Button onClick={() => navigate("/publish-department")}>
                Nueva publicación
              </Button>
            </>
          }
        />

        {error && <AlertBanner>{error}</AlertBanner>}

        {loading ? (
          <p className="text-center text-gray-500">Cargando tus publicaciones...</p>
        ) : spaces.length === 0 ? (
          <EmptyState
            title="No tienes publicaciones activas"
            subtitle="Publica tu departamento para que aparezca aquí."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {spaces.map((space) => (
              <SpaceCard key={space.id} space={space}>
                <div className="flex gap-3">
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
              </SpaceCard>
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
        <ModalShell
          onClose={() => setDeleting(null)}
          panelClassName="max-w-md rounded-[28px] p-8"
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
        </ModalShell>
      )}
    </div>
  );
};
