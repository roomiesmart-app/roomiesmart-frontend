import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../services/api";
import { useRoomie } from "../../roomie/RoomieContext";
import {
  profileSettingsSchema,
  type ProfileSettingsValues,
} from "../schemas/profileSettings.schema";

interface ProfileSettings {
  userId: string;
  isEarlyBird: boolean | null;
  hobbies: string[];
  minBudget: number | null;
  maxBudget: number | null;
  roomType: string | null;
  expenseManagement: string | null;
  sharedItems: string[];
  preferredCommonAreas: string[];
}

const FieldError = ({ message }: { message?: string }) =>
  message ? <span className="text-xs text-red-600">{message}</span> : null;

export const ProfileSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { ownerId } = useRoomie();

  const [profile, setProfile] = useState<ProfileSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileSettingsValues>({
    resolver: zodResolver(profileSettingsSchema),
    mode: "onTouched",
    defaultValues: { isEarlyBird: true, minBudget: "", maxBudget: "" },
  });

  const isEarlyBird = watch("isEarlyBird");

  useEffect(() => {
    if (!ownerId) return;
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        const response = await api.get(
          `/api/profiles?userId=${encodeURIComponent(ownerId)}`,
        );
        if (cancelled) return;
        const data: ProfileSettings = response.data;
        setProfile(data);
        reset({
          isEarlyBird: data.isEarlyBird ?? true,
          minBudget: data.minBudget != null ? String(data.minBudget) : "",
          maxBudget: data.maxBudget != null ? String(data.maxBudget) : "",
        });
      } catch (err) {
        console.error(err);
        if (!cancelled) setApiError("No pudimos cargar tu perfil.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      cancelled = true;
    };
  }, [ownerId, reset]);

  const onSubmit = async (values: ProfileSettingsValues) => {
    setApiError("");
    setSuccess("");
    try {
      await api.post("/api/profiles", {
        userId: ownerId,
        isEarlyBird: values.isEarlyBird,
        ...(values.minBudget !== "" ? { minBudget: Number(values.minBudget) } : {}),
        ...(values.maxBudget !== "" ? { maxBudget: Number(values.maxBudget) } : {}),
      });
      setSuccess("Perfil guardado correctamente. ✓");
    } catch (err: any) {
      const messages = err?.response?.data?.messages;
      setApiError(
        (Array.isArray(messages) ? messages.join(" ") : null) ||
          err?.response?.data?.message ||
          "No se pudo guardar el perfil.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF7F5] px-6 py-8 sm:px-10 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-[#A3513D]">
              Mi cuenta
            </p>
            <h1 className="text-4xl font-extrabold text-[#3B241C]">
              Preferencias y presupuesto
            </h1>
            <p className="mt-2 text-gray-500">
              Esto alimenta el matchmaking y tu tablero de finanzas.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-full border border-[#8C3A27] bg-white px-6 py-3 text-sm font-semibold text-[#8C3A27] hover:bg-[#F9F2EE] transition"
          >
            Volver al inicio
          </button>
        </header>

        {loading ? (
          <p className="text-center text-gray-500">Cargando tu perfil...</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {apiError && (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {apiError}
              </div>
            )}
            {success && (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                {success}
              </div>
            )}

            <section className="rounded-[28px] border border-[#F1DED6] bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-[#3B241C]">
                Ritmo de vida
              </h2>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setValue("isEarlyBird", true)}
                  className={`flex-1 rounded-2xl border p-4 text-sm font-semibold transition ${
                    isEarlyBird
                      ? "border-[#8C3A27] bg-[#8C3A27] text-white"
                      : "border-[#E5D1C6] bg-[#FDF8F6] text-[#5C5C5C]"
                  }`}
                >
                  🌅 Madrugador
                </button>
                <button
                  type="button"
                  onClick={() => setValue("isEarlyBird", false)}
                  className={`flex-1 rounded-2xl border p-4 text-sm font-semibold transition ${
                    !isEarlyBird
                      ? "border-[#8C3A27] bg-[#8C3A27] text-white"
                      : "border-[#E5D1C6] bg-[#FDF8F6] text-[#5C5C5C]"
                  }`}
                >
                  🌙 Noctámbulo
                </button>
              </div>
            </section>

            <section className="rounded-[28px] border border-[#F1DED6] bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-[#3B241C]">
                Presupuesto mensual (USD)
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm text-[#5C5C5C]">
                  Mínimo (desde $50)
                  <input
                    type="number"
                    {...register("minBudget")}
                    placeholder="80"
                    className="rounded-2xl border border-[#E5D1C6] bg-[#FDF8F6] p-3 focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30"
                  />
                  <FieldError message={errors.minBudget?.message} />
                </label>
                <label className="flex flex-col gap-1 text-sm text-[#5C5C5C]">
                  Máximo (hasta $2000)
                  <input
                    type="number"
                    {...register("maxBudget")}
                    placeholder="300"
                    className="rounded-2xl border border-[#E5D1C6] bg-[#FDF8F6] p-3 focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30"
                  />
                  <FieldError message={errors.maxBudget?.message} />
                </label>
              </div>
            </section>

            {profile && (
              <section className="rounded-[28px] border border-[#F1DED6] bg-[#FFF8F4] p-8">
                <h2 className="mb-3 text-lg font-bold text-[#3B241C]">
                  Preferencias del registro
                </h2>
                <p className="mb-4 text-xs text-gray-500">
                  Definidas en tu onboarding (solo lectura por ahora).
                </p>
                <div className="grid gap-3 text-sm text-[#5C5C5C] sm:grid-cols-2">
                  <p>
                    <span className="font-bold text-[#8C3A27]">Habitación:</span>{" "}
                    {profile.roomType || "—"}
                  </p>
                  <p>
                    <span className="font-bold text-[#8C3A27]">Gastos:</span>{" "}
                    {profile.expenseManagement || "—"}
                  </p>
                  <p className="sm:col-span-2">
                    <span className="font-bold text-[#8C3A27]">Áreas comunes:</span>{" "}
                    {profile.preferredCommonAreas.length > 0
                      ? profile.preferredCommonAreas.join(", ")
                      : "—"}
                  </p>
                  <p className="sm:col-span-2">
                    <span className="font-bold text-[#8C3A27]">Compartes:</span>{" "}
                    {profile.sharedItems.length > 0
                      ? profile.sharedItems.join(", ")
                      : "—"}
                  </p>
                </div>
              </section>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !ownerId}
              className="w-full rounded-full bg-[#8C3A27] py-4 font-bold text-white hover:bg-[#702d1f] transition disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
