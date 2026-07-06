import React, { useState } from "react";
import {
  updateSpace,
  type PublishedSpace,
} from "../services/PublishService";

const roomTypes = [
  "Departamento completo",
  "Habitación privada",
  "Habitación compartida",
];
const commonAreaOptions = ["Sala", "Cocina", "Baño compartido", "Terraza"];
const amenityOptions = [
  "Wi-Fi",
  "Lavadora",
  "Aire acondicionado",
  "Parqueadero",
  "Muebles incluidos",
];

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
  const [title, setTitle] = useState(space.title);
  const [description, setDescription] = useState(space.description || "");
  const [price, setPrice] = useState(String(space.monthly_price ?? ""));
  const [address, setAddress] = useState(space.location_address || "");
  const [neighborhood, setNeighborhood] = useState(space.neighborhood || "");
  const [spaceType, setSpaceType] = useState(space.space_type || "");
  const [areas, setAreas] = useState<string[]>(space.common_areas || []);
  const [amenities, setAmenities] = useState<string[]>(space.amenities || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggle = (
    list: string[],
    setList: (v: string[]) => void,
    value: string,
  ) => {
    setList(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value],
    );
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !address.trim() || !neighborhood.trim()) {
      setError("Título, dirección y barrio no pueden quedar vacíos.");
      return;
    }
    if (!price || Number(price) <= 0) {
      setError("El precio debe ser mayor a cero.");
      return;
    }
    if (areas.length === 0 || amenities.length === 0) {
      setError("Selecciona al menos un área común y una amenidad.");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateSpace(space.id, {
        title,
        description,
        monthlyPrice: Number(price),
        locationAddress: address,
        neighborhood,
        spaceType,
        commonAreas: areas,
        amenities,
      });
      onSaved(updated);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "No se pudo guardar la publicación. Intenta de nuevo.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-8"
      onClick={onClose}
    >
      <form
        onSubmit={handleSave}
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

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          <label className="flex flex-col gap-1 text-sm text-[#5C5C5C]">
            Título
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-2xl border border-[#E5D1C6] bg-[#FDF8F6] p-3 focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-[#5C5C5C]">
            Descripción
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="rounded-2xl border border-[#E5D1C6] bg-[#FDF8F6] p-3 focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-[#5C5C5C]">
              Precio por mes (USD)
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="rounded-2xl border border-[#E5D1C6] bg-[#FDF8F6] p-3 focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-[#5C5C5C]">
              Tipo de espacio
              <select
                value={spaceType}
                onChange={(e) => setSpaceType(e.target.value)}
                className="rounded-2xl border border-[#E5D1C6] bg-[#FDF8F6] p-3 focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30"
              >
                <option value="">Selecciona tipo</option>
                {roomTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-[#5C5C5C]">
              Dirección
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="rounded-2xl border border-[#E5D1C6] bg-[#FDF8F6] p-3 focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-[#5C5C5C]">
              Barrio / Sector
              <input
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="rounded-2xl border border-[#E5D1C6] bg-[#FDF8F6] p-3 focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="text-sm text-[#5C5C5C]">
              <p className="mb-2">Áreas comunes</p>
              <div className="grid gap-2 rounded-2xl border border-[#E5D1C6] bg-[#FDF8F6] p-3">
                {commonAreaOptions.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggle(areas, setAreas, area)}
                    className={`rounded-xl px-3 py-2 text-left text-sm transition ${
                      areas.includes(area)
                        ? "bg-[#8C3A27] text-white"
                        : "bg-white text-[#5C5C5C] border border-[#E5D1C6]"
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-sm text-[#5C5C5C]">
              <p className="mb-2">Amenidades</p>
              <div className="grid gap-2 rounded-2xl border border-[#E5D1C6] bg-[#FDF8F6] p-3">
                {amenityOptions.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggle(amenities, setAmenities, amenity)}
                    className={`rounded-xl px-3 py-2 text-left text-sm transition ${
                      amenities.includes(amenity)
                        ? "bg-[#8C3A27] text-white"
                        : "bg-white text-[#5C5C5C] border border-[#E5D1C6]"
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
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
            disabled={saving}
            className="flex-1 rounded-full bg-[#8C3A27] py-3 font-bold text-white hover:bg-[#702d1f] transition disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};
