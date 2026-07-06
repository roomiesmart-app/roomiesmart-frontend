import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoomie } from "../../roomie/RoomieContext";
import {
  getPendingRequests,
  resolveRequest,
  type JoinRequest,
} from "../services/MembershipService";

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
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-[#A3513D]">
              Shared Spaces
            </p>
            <h1 className="text-4xl font-extrabold text-[#3B241C]">
              Solicitudes de unión
            </h1>
            <p className="mt-2 text-gray-500">
              Personas que quieren unirse a tus espacios publicados.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-full border border-[#8C3A27] bg-white px-6 py-3 text-sm font-semibold text-[#8C3A27] hover:bg-[#F9F2EE] transition"
          >
            Volver al inicio
          </button>
        </header>

        {error && (
          <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Cargando solicitudes...</p>
        ) : requests.length === 0 ? (
          <div className="rounded-[32px] border border-[#F1DED6] bg-white p-12 text-center">
            <p className="mb-2 text-lg font-bold text-[#3B241C]">
              No tienes solicitudes pendientes
            </p>
            <p className="text-sm text-gray-500">
              Cuando alguien pida unirse a tu espacio, aparecerá aquí.
            </p>
          </div>
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
                  <button
                    onClick={() => handleResolve(request, "reject")}
                    disabled={busyId === request.id}
                    className="rounded-full border border-red-200 bg-red-50 px-6 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition disabled:opacity-50"
                  >
                    Rechazar
                  </button>
                  <button
                    onClick={() => handleResolve(request, "accept")}
                    disabled={busyId === request.id}
                    className="rounded-full bg-[#8C3A27] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#702d1f] transition disabled:opacity-50"
                  >
                    {busyId === request.id ? "Procesando..." : "Aceptar"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
