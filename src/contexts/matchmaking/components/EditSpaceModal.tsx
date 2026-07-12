import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  updateSpace,
  type PublishedSpace,
} from "../services/PublishService";
import {
  fetchCommonAreas,
  fetchAmenities,
  CATALOG_QUERY_OPTIONS,
} from "../services/CatalogService";
import {
  editSpaceSchema,
  type EditSpaceFormValues,
} from "../schemas/publishSpace.schema";

const roomTypes = [
  "Departamento completo",
  "Habitación privada",
  "Habitación compartida",
];

const fieldClass =
  "rounded-2xl border border-[#E5D1C6] bg-[#FDF8F6] p-3 focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30";

const FieldError = ({ message }: { message?: string }) =>
  message ? <span className="text-xs text-red-600">{message}</span> : null;

interface EditSpaceModalProps {
  space: PublishedSpace;
  onClose: () => void;
  onSaved: (updated: PublishedSpace) => void;
}

export const EditSpaceModal: React.FC<EditSpaceModalProps> = ({
  space,
  onClose,
  onSaved,
}) => {
  const [apiError, setApiError] = useState("");

  const { data: commonAreaOptions = [] } = useQuery({
    queryKey: ["catalog", "common-areas"],
    queryFn: fetchCommonAreas,
    ...CATALOG_QUERY_OPTIONS,
  });
  const { data: amenityOptions = [] } = useQuery({
    queryKey: ["catalog", "amenities"],
    queryFn: fetchAmenities,
    ...CATALOG_QUERY_OPTIONS,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditSpaceFormValues>({
    resolver: zodResolver(editSpaceSchema),
    mode: "onTouched",
    defaultValues: {
      title: space.title,
      description: space.description || "",
      price: String(space.monthly_price ?? ""),
      address: space.location_address || "",
      neighborhood: space.neighborhood || "",
      roomType: space.space_type || "",
      commonAreas: space.common_areas || [],
      amenities: space.amenities || [],
    },
  });

  const areas = watch("commonAreas");
  const amenities = watch("amenities");

  const toggle = (
    field: "commonAreas" | "amenities",
    current: string[],
    value: string,
  ) => {
    setValue(
      field,
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
      { shouldValidate: true },
    );
  };

  const onSubmit = async (values: EditSpaceFormValues) => {
    setApiError("");
    try {
      const updated = await updateSpace(space.id, {
        title: values.title,
        description: values.description,
        monthlyPrice: Number(values.price),
        locationAddress: values.address,
        neighborhood: values.neighborhood,
        spaceType: values.roomType,
        commonAreas: values.commonAreas,
        amenities: values.amenities,
      });
      onSaved(updated);
    } catch (err: any) {
      setApiError(
        err?.response?.data?.message ||
          "No se pudo guardar la publicación. Intenta de nuevo.",
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-8"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-full overflow-y-auto rounded-[28px] bg-white p-8 shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-[#3B241C]">
              Editar publicación
            </h2>
            <p className="text-sm text-gray-500">
              Solo tú, como dueño, puedes modificar este espacio.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-gray-100 px-3 py-1 text-sm font-bold text-gray-500 hover:bg-gray-200 transition"
          >
            ✕
          </button>
        </div>

        {apiError && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {apiError}
          </div>
        )}

        <div className="grid gap-4">
          <label className="flex flex-col gap-1 text-sm text-[#5C5C5C]">
            Título
            <input {...register("title")} className={fieldClass} />
            <FieldError message={errors.title?.message} />
          </label>

          <label className="flex flex-col gap-1 text-sm text-[#5C5C5C]">
            Descripción
            <textarea
              {...register("description")}
              rows={4}
              className={fieldClass}
            />
            <FieldError message={errors.description?.message} />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-[#5C5C5C]">
              Precio por mes (USD)
              <input type="number" {...register("price")} className={fieldClass} />
              <FieldError message={errors.price?.message} />
            </label>
            <label className="flex flex-col gap-1 text-sm text-[#5C5C5C]">
              Tipo de espacio
              <select {...register("roomType")} className={fieldClass}>
                <option value="">Selecciona tipo</option>
                {roomTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <FieldError message={errors.roomType?.message} />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-[#5C5C5C]">
              Dirección
              <input {...register("address")} className={fieldClass} />
              <FieldError message={errors.address?.message} />
            </label>
            <label className="flex flex-col gap-1 text-sm text-[#5C5C5C]">
              Barrio / Sector
              <input {...register("neighborhood")} className={fieldClass} />
              <FieldError message={errors.neighborhood?.message} />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="text-sm text-[#5C5C5C]">
              <p className="mb-2">Áreas comunes</p>
              <div className="grid gap-2 rounded-2xl border border-[#E5D1C6] bg-[#FDF8F6] p-3">
                {commonAreaOptions.map((area) => (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => toggle("commonAreas", areas, area.name)}
                    className={`rounded-xl px-3 py-2 text-left text-sm transition ${
                      areas.includes(area.name)
                        ? "bg-[#8C3A27] text-white"
                        : "bg-white text-[#5C5C5C] border border-[#E5D1C6]"
                    }`}
                  >
                    {area.name}
                  </button>
                ))}
              </div>
              <FieldError message={errors.commonAreas?.message} />
            </div>
            <div className="text-sm text-[#5C5C5C]">
              <p className="mb-2">Amenidades</p>
              <div className="grid gap-2 rounded-2xl border border-[#E5D1C6] bg-[#FDF8F6] p-3">
                {amenityOptions.map((amenity) => (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggle("amenities", amenities, amenity.name)}
                    className={`rounded-xl px-3 py-2 text-left text-sm transition ${
                      amenities.includes(amenity.name)
                        ? "bg-[#8C3A27] text-white"
                        : "bg-white text-[#5C5C5C] border border-[#E5D1C6]"
                    }`}
                  >
                    {amenity.name}
                  </button>
                ))}
              </div>
              <FieldError message={errors.amenities?.message} />
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-gray-200 py-3 font-bold text-gray-600 hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-full bg-[#8C3A27] py-3 font-bold text-white hover:bg-[#702d1f] transition disabled:opacity-50"
          >
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};
