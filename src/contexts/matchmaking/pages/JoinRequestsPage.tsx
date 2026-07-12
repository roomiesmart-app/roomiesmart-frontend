import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoomie } from "../../roomie/RoomieContext";
import {
  getPendingRequests,
  resolveRequest,
  type JoinRequest,
} from "../services/MembershipService";
import { Button } from "../../../shared/components/Button";
import { PageHeader } from "../../../shared/components/ui/PageHeader";
import { AlertBanner } from "../../../shared/components/ui/AlertBanner";
import { EmptyState } from "../../../shared/components/ui/EmptyState";

export const JoinRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const { ownerId } = useRoomie();
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    if (!ownerId) return;
    let cancelled = false;

    const fetchRequests = async () => {
      try {
        const data = await getPendingRequests(ownerId);
        if (!cancelled) setRequests(data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("No pudimos cargar las solicitudes.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRequests();
    return () => {
      cancelled = true;
    };
  }, [ownerId]);

  const handleResolve = async (
    request: JoinRequest,
    action: "accept" | "reject",
  ) => {
    if (!ownerId) return;
    setBusyId(request.id);
    setError("");
    try {
      await resolveRequest(request.id, ownerId, action);
      setRequests((prev) => prev.filter((r) => r.id !== request.id));
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "No se pudo resolver la solicitud.",
      );
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF7F5] px-6 py-8 sm:px-10 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <PageHeader
          eyebrow="Shared Spaces"
          title="Solicitudes de unión"
          subtitle="Personas que quieren unirse a tus espacios publicados."
          actions={
            <Button variant="secondary" onClick={() => navigate("/dashboard")}>
              Volver al inicio
            </Button>
          }
        />

        {error && <AlertBanner>{error}</AlertBanner>}

        {loading ? (
          <p className="text-center text-gray-500">Cargando solicitudes...</p>
        ) : requests.length === 0 ? (
          <EmptyState
            title="No tienes solicitudes pendientes"
            subtitle="Cuando alguien pida unirse a tu espacio, aparecerá aquí."
          />
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <article
                key={request.id}
                className="flex flex-col gap-4 rounded-[28px] border border-[#F1DED6] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-bold text-[#8C3A27]">
                    {request.spaces?.title || "Tu espacio"}
                  </p>
                  <p className="font-semibold text-[#3B241C]">
                    {request.users?.email?.split("@")[0] || "Un roomie"} quiere
                    unirse
                  </p>
                  {request.message && (
                    <p className="mt-1 text-sm text-gray-500">
                      “{request.message}”
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(request.created_at).toLocaleDateString("es-EC", {
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="danger"
                    onClick={() => handleResolve(request, "reject")}
                    disabled={busyId === request.id}
                  >
                    Rechazar
                  </Button>
                  <Button
                    onClick={() => handleResolve(request, "accept")}
                    disabled={busyId === request.id}
                  >
                    {busyId === request.id ? "Procesando..." : "Aceptar"}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
