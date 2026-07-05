import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublishDepartmentStepIndicator } from "../components/PublishDepartmentStepIndicator";
import { useRoomie } from "../../../contexts/roomie/RoomieContext";
import {
  createSpace,
  uploadDepartmentPhotos,
} from "../services/PublishService";

const roomTypes = [
  "Departamento completo",
  "Habitación privada",
  "Habitación compartida",
];
const cityOptions = [
  { id: "11111111-1111-1111-1111-111111111111", label: "Quito" },
  { id: "22222222-2222-2222-2222-222222222222", label: "Guayaquil" },
  { id: "33333333-3333-3333-3333-333333333333", label: "Cuenca" },
];
const commonAreas = ["Sala", "Cocina", "Baño compartido", "Terraza"];
const amenities = [
  "Wi-Fi",
  "Lavadora",
  "Aire acondicionado",
  "Parqueadero",
  "Muebles incluidos",
];

export const PublishDepartmentPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const navigate = useNavigate();
  const { ownerId, setDepartmentId } = useRoomie();
  const [roomType, setRoomType] = useState("");
  const [cityId, setCityId] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotos = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 5 - photos.length);
    setPhotos((prev) => [...prev, ...newFiles]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area)
        ? prev.filter((item) => item !== area)
        : [...prev, area],
    );
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity],
    );
  };

  const handleContinue = () => {
    setSubmissionError("");

    if (step === 1 && photos.length < 5) {
      setSubmissionError("Debes subir al menos 5 fotos.");
      return;
    }

    if (step === 2 && (!cityId || !address || !price || !roomType)) {
      setSubmissionError("Completa todos los campos antes de continuar.");
      return;
    }

    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!ownerId) {
      setSubmissionError(
        "No se encontró el usuario autenticado. Vuelve a iniciar sesión.",
      );
      return;
    }

    if (photos.length < 5) {
      setSubmissionError("Debes subir al menos 5 fotos.");
      return;
    }

    if (!cityId || !title || !description || !address || !price || !roomType) {
      setSubmissionError(
        "Completa todos los campos requeridos antes de publicar.",
      );
      return;
    }

    setSubmissionError("");
    setIsSubmitting(true);

    try {
      const imageUrls = await uploadDepartmentPhotos(
        photos,
        `departments/${ownerId}`,
      );

      if (imageUrls.length < 5) {
        throw new Error(
          "Se requieren al menos 5 fotos para publicar el departamento.",
        );
      }

      const created = await createSpace({
        ownerId,
        cityId,
        title,
        description,
        monthlyPrice: Number(price),
        locationAddress: address,
        images: imageUrls,
      });

      const createdId = created?.id || created?.departmentId || "";
      if (createdId) {
        setDepartmentId(createdId);
      }

      alert("Departamento publicado correctamente.");
      navigate("/dashboard");
    } catch (error: any) {
      setSubmissionError(
        error?.message || "Error al publicar el departamento.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF7F5] px-6 py-8 sm:px-10 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] font-bold text-[#A3513D] mb-2">
              Publica tu departamento
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#3B241C]">
              Crea una publicación atractiva para tus futuros roomies
            </h1>
          </div>
          <div className="rounded-[32px] bg-white border border-[#F1DED6] px-6 py-4 shadow-sm w-full md:w-auto">
            <p className="text-sm font-semibold text-[#8C3A27]">
              Paso {step} de 3
            </p>
            <p className="text-xs text-gray-500">
              Llena los detalles clave para destacar tu espacio.
            </p>
          </div>
        </header>

        <PublishDepartmentStepIndicator currentStep={step} />

        {submissionError && (
          <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {submissionError}
          </div>
        )}

        <main className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <section className="space-y-8">
            {step === 1 && (
              <div className="space-y-6 rounded-[32px] bg-white p-8 shadow-sm border border-[#F1DED6]">
                <div>
                  <h2 className="text-2xl font-bold text-[#3B241C] mb-3">
                    Info básica y fotos
                  </h2>
                  <p className="text-sm text-gray-500">
                    Captura la esencia de tu departamento con un título claro,
                    una descripción atractiva y fotos de calidad.
                  </p>
                </div>

                <div className="grid gap-6">
                  <label className="flex flex-col gap-2 text-sm text-[#5C5C5C]">
                    Título del anuncio
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej. Departamento amplio junto a la UCE"
                      className="rounded-3xl border border-[#E5D1C6] bg-[#FDF8F6] p-4 focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30"
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm text-[#5C5C5C]">
                    Descripción
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      placeholder="Describe el departamento, las áreas comunes y qué tipo de roomie buscas..."
                      className="rounded-[28px] border border-[#E5D1C6] bg-[#FDF8F6] p-4 focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30"
                    />
                  </label>

                  <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                    <label className="flex flex-col gap-2 text-sm text-[#5C5C5C]">
                      Foto de portada y galería
                      <div className="rounded-[28px] border border-dashed border-[#D9B6A1] bg-[#FFF6F2] p-10 text-center text-sm text-[#8C3A27]">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handlePhotos(e.target.files)}
                          className="hidden"
                          id="department-photos"
                        />
                        <label
                          htmlFor="department-photos"
                          className="cursor-pointer text-[#8C3A27] font-bold"
                        >
                          Arrastra o haz clic para subir fotos
                        </label>
                        <p className="mt-2 text-xs text-gray-500">
                          Hasta 5 fotos. Las imágenes de alta calidad ayudan a
                          atraer más roomies.
                        </p>
                      </div>
                    </label>
                    <div className="grid gap-3">
                      {photos.length > 0 ? (
                        photos.map((photo, index) => (
                          <div
                            key={index}
                            className="relative overflow-hidden rounded-3xl border border-[#E7D7D0] bg-[#F7F1EE] p-4"
                          >
                            <div className="h-24 overflow-hidden rounded-3xl bg-[#F6ECE7] flex items-center justify-center text-sm text-[#8C3A27]">
                              {photo.name}
                            </div>
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute right-3 top-3 rounded-full bg-[#8C3A27] p-2 text-white text-xs"
                            >
                              Eliminar
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-3xl border border-[#E5D1C6] bg-[#FFF8F4] p-6 text-center text-sm text-[#8C3A27]">
                          No hay fotos por ahora. Súbelas para mejorar la
                          visibilidad.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 rounded-[32px] bg-white p-8 shadow-sm border border-[#F1DED6]">
                <div>
                  <h2 className="text-2xl font-bold text-[#3B241C] mb-3">
                    Ubicación y detalles
                  </h2>
                  <p className="text-sm text-gray-500">
                    Agrega la dirección, el precio y características clave que
                    hagan destacar tu espacio.
                  </p>
                </div>

                <div className="grid gap-6">
                  <label className="flex flex-col gap-2 text-sm text-[#5C5C5C]">
                    Dirección
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Calle, edificio, número"
                      className="rounded-3xl border border-[#E5D1C6] bg-[#FDF8F6] p-4 focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-[#5C5C5C]">
                    Ciudad
                    <select
                      value={cityId}
                      onChange={(e) => setCityId(e.target.value)}
                      className="rounded-3xl border border-[#E5D1C6] bg-[#FDF8F6] p-4 focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30"
                    >
                      <option value="">Selecciona ciudad</option>
                      {cityOptions.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-[#5C5C5C]">
                    Barrio / Sector
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="La Carolina, El Girón"
                      className="rounded-3xl border border-[#E5D1C6] bg-[#FDF8F6] p-4 focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-[#5C5C5C]">
                    Precio por mes
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="USD 250"
                      className="rounded-3xl border border-[#E5D1C6] bg-[#FDF8F6] p-4 focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30"
                    />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-2 text-sm text-[#5C5C5C]">
                      Tipo de espacio
                      <select
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                        className="rounded-3xl border border-[#E5D1C6] bg-[#FDF8F6] p-4 focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30"
                      >
                        <option value="">Selecciona tipo de habitación</option>
                        {roomTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="flex flex-col gap-2 text-sm text-[#5C5C5C]">
                      Áreas comunes
                      <div className="grid gap-2 rounded-3xl border border-[#E5D1C6] bg-[#FDF8F6] p-4">
                        {commonAreas.map((area) => (
                          <button
                            key={area}
                            type="button"
                            onClick={() => toggleArea(area)}
                            className={`rounded-2xl px-4 py-2 text-left text-sm transition ${selectedAreas.includes(area) ? "bg-[#8C3A27] text-white" : "bg-white text-[#5C5C5C] border border-[#E5D1C6]"}`}
                          >
                            {area}
                          </button>
                        ))}
                      </div>
                    </label>
                  </div>

                  <label className="flex flex-col gap-2 text-sm text-[#5C5C5C]">
                    Amenidades
                    <div className="grid gap-2 rounded-3xl border border-[#E5D1C6] bg-[#FDF8F6] p-4">
                      {amenities.map((amenity) => (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => toggleAmenity(amenity)}
                          className={`rounded-2xl px-4 py-2 text-left text-sm transition ${selectedAmenities.includes(amenity) ? "bg-[#8C3A27] text-white" : "bg-white text-[#5C5C5C] border border-[#E5D1C6]"}`}
                        >
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </label>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 rounded-[32px] bg-white p-8 shadow-sm border border-[#F1DED6]">
                <div>
                  <h2 className="text-2xl font-bold text-[#3B241C] mb-3">
                    Revisar y finalizar
                  </h2>
                  <p className="text-sm text-gray-500">
                    Verifica todos los datos antes de publicar.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl border border-[#E5D1C6] bg-[#FEF6F1] p-6">
                    <p className="text-sm font-bold text-[#8C3A27] mb-2">
                      Título
                    </p>
                    <p className="text-[#4D403D]">{title || "Sin título"}</p>
                  </div>
                  <div className="rounded-3xl border border-[#E5D1C6] bg-[#FEF6F1] p-6">
                    <p className="text-sm font-bold text-[#8C3A27] mb-2">
                      Descripción
                    </p>
                    <p className="text-[#4D403D]">
                      {description || "Sin descripción"}
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl border border-[#E5D1C6] bg-[#FEF6F1] p-6">
                      <p className="text-sm font-bold text-[#8C3A27] mb-2">
                        Dirección
                      </p>
                      <p className="text-[#4D403D]">
                        {address || "No especificada"}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-[#E5D1C6] bg-[#FEF6F1] p-6">
                      <p className="text-sm font-bold text-[#8C3A27] mb-2">
                        Ciudad / Barrio
                      </p>
                      <p className="text-[#4D403D]">
                        {city || "No especificado"}
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl border border-[#E5D1C6] bg-[#FEF6F1] p-6">
                      <p className="text-sm font-bold text-[#8C3A27] mb-2">
                        Precio
                      </p>
                      <p className="text-[#4D403D]">
                        {price ? `$${price}` : "Sin precio"}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-[#E5D1C6] bg-[#FEF6F1] p-6">
                      <p className="text-sm font-bold text-[#8C3A27] mb-2">
                        Tipo de espacio
                      </p>
                      <p className="text-[#4D403D]">
                        {roomType || "No seleccionado"}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-[#E5D1C6] bg-[#FEF6F1] p-6">
                    <p className="text-sm font-bold text-[#8C3A27] mb-2">
                      Amenidades
                    </p>
                    <p className="text-[#4D403D]">
                      {selectedAmenities.length > 0
                        ? selectedAmenities.join(", ")
                        : "No seleccionadas"}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-[#E5D1C6] bg-[#FEF6F1] p-6">
                    <p className="text-sm font-bold text-[#8C3A27] mb-2">
                      Fotos
                    </p>
                    <p className="text-[#4D403D]">
                      {photos.length > 0
                        ? `${photos.length} fotos cargadas`
                        : "No hay fotos"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-6 rounded-[32px] bg-[#F4ECE8] p-8 shadow-sm border border-[#E8D7D0]">
            <div className="rounded-[28px] bg-white p-6 shadow-sm border border-[#E6D4C8]">
              <h3 className="text-lg font-bold text-[#3B241C] mb-4">
                Consejos para publicar
              </h3>
              <ul className="space-y-3 text-sm text-[#5C5C5C]">
                <li>1. Usa fotos luminosas y de ángulos amplios.</li>
                <li>2. Describe claramente los servicios incluidos.</li>
                <li>3. Indica si hay transporte y universidades cercanas.</li>
                <li>4. Menciona si el espacio está amoblado.</li>
              </ul>
            </div>
            <div className="rounded-[28px] bg-[#8C3A27] p-6 text-white shadow-sm">
              <p className="text-sm font-semibold mb-2">
                Revisa antes de publicar
              </p>
              <p className="text-xs leading-relaxed">
                Una buena publicación aumenta tus posibilidades de encontrar un
                buen roomie rápidamente.
              </p>
            </div>
          </aside>
        </main>

        <footer className="mt-12 flex flex-col gap-4 sm:flex-row items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="rounded-full border border-[#8C3A27] bg-white px-8 py-3 text-sm font-semibold text-[#8C3A27] hover:bg-[#F9F2EE] transition"
            disabled={step === 1}
          >
            Atrás
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={handleContinue}
              disabled={isSubmitting}
              className="rounded-full bg-[#8C3A27] px-8 py-3 text-sm font-semibold text-white hover:bg-[#702d1f] transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continuar
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-full bg-[#8C3A27] px-8 py-3 text-sm font-semibold text-white hover:bg-[#702d1f] transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Publicando..." : "Publicar Departamento"}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};
