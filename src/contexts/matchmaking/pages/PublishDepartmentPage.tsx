import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { PublishDepartmentStepIndicator } from "../components/PublishDepartmentStepIndicator";
import { useRoomie } from "../../../contexts/roomie/RoomieContext";
import {
  createSpace,
  uploadDepartmentPhotos,
} from "../services/PublishService";
import {
  fetchCities,
  fetchCommonAreas,
  fetchAmenities,
  CATALOG_QUERY_OPTIONS,
} from "../services/CatalogService";
import {
  publishSpaceSchema,
  stepFields,
  type PublishSpaceFormValues,
} from "../schemas/publishSpace.schema";
import { FieldError } from "../../../shared/components/ui/FieldError";

const roomTypes = [
  "Departamento completo",
  "Habitación privada",
  "Habitación compartida",
];

// Por ahora la publicación de espacios solo está disponible en Quito
const FIXED_CITY_NAME = "Quito";

const inputClass =
  "rounded-3xl border border-[#E5D1C6] bg-[#FDF8F6] p-4 focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30";

export const PublishDepartmentPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [submissionError, setSubmissionError] = useState("");
  const navigate = useNavigate();
  const { ownerId, setDepartmentId } = useRoomie();

  const { data: cities = [], isError: citiesError } = useQuery({
    queryKey: ["catalog", "cities"],
    queryFn: fetchCities,
    ...CATALOG_QUERY_OPTIONS,
  });
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
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PublishSpaceFormValues>({
    resolver: zodResolver(publishSpaceSchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      description: "",
      photos: [],
      cityId: "",
      address: "",
      neighborhood: "",
      price: "",
      roomType: "",
      commonAreas: [],
      amenities: [],
    },
  });

  const photos = watch("photos");
  const selectedAreas = watch("commonAreas");
  const selectedAmenities = watch("amenities");
  const watchedValues = watch();

  const fixedCity = cities.find(
    (city) => city.name.trim().toLowerCase() === FIXED_CITY_NAME.toLowerCase(),
  );

  // La ciudad está fija en Quito: se asigna sola cuando llega el catálogo
  useEffect(() => {
    if (fixedCity) {
      setValue("cityId", fixedCity.id, { shouldValidate: true });
    }
  }, [fixedCity, setValue]);

  const handlePhotos = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 5 - photos.length);
    setValue("photos", [...photos, ...newFiles], { shouldValidate: true });
  };

  const removePhoto = (index: number) => {
    setValue(
      "photos",
      photos.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  const toggleInList = (
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

  const handleContinue = async () => {
    setSubmissionError("");

    const isValid = await trigger(stepFields[step]);
    if (isValid && step < 3) setStep(step + 1);
  };

  const handleBack = () => {

    if (step === 1) {
      navigate(-1);
      return;
    }
    setStep(step - 1);
  };

  const onSubmit = async (values: PublishSpaceFormValues) => {
    if (!ownerId) {
      setSubmissionError(
        "No se encontró el usuario autenticado. Vuelve a iniciar sesión.",
      );
      return;
    }
    setSubmissionError("");

    try {
      const imageUrls = await uploadDepartmentPhotos(
        values.photos,
        `departments/${ownerId}`,
      );

      const created = await createSpace({
        ownerId,
        cityId: values.cityId,
        title: values.title,
        description: values.description,
        monthlyPrice: Number(values.price),
        locationAddress: values.address,
        neighborhood: values.neighborhood,
        spaceType: values.roomType,
        commonAreas: values.commonAreas,
        amenities: values.amenities,
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
        error?.response?.data?.message ||
          error?.message ||
          "Error al publicar el departamento.",
      );
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

        <form onSubmit={handleSubmit(onSubmit)}>
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
                        {...register("title")}
                        placeholder="Ej. Departamento amplio junto a la UCE"
                        className={inputClass}
                      />
                      <FieldError message={errors.title?.message} />
                    </label>

                    <label className="flex flex-col gap-2 text-sm text-[#5C5C5C]">
                      Descripción
                      <textarea
                        {...register("description")}
                        rows={6}
                        placeholder="Describe el departamento, las áreas comunes y qué tipo de roomie buscas..."
                        className="rounded-[28px] border border-[#E5D1C6] bg-[#FDF8F6] p-4 focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30"
                      />
                      <FieldError message={errors.description?.message} />
                    </label>

                    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                      <div className="flex flex-col gap-2 text-sm text-[#5C5C5C]">
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
                        <FieldError message={errors.photos?.message} />
                      </div>
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
                        {...register("address")}
                        placeholder="Calle, edificio, número"
                        className={inputClass}
                      />
                      <FieldError message={errors.address?.message} />
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-[#5C5C5C]">
                      Ciudad
                      <input
                        value={
                          cities.length === 0
                            ? "Cargando ciudades..."
                            : FIXED_CITY_NAME
                        }
                        disabled
                        readOnly
                        className={`${inputClass} cursor-not-allowed opacity-70`}
                      />
                      <span className="text-xs text-gray-400">
                        Por ahora solo publicamos espacios en {FIXED_CITY_NAME}.
                      </span>
                      <FieldError message={errors.cityId?.message} />
                      {cities.length > 0 && !fixedCity && (
                        <FieldError
                          message={`La ciudad ${FIXED_CITY_NAME} no está disponible en el catálogo. Contacta al administrador.`}
                        />
                      )}
                      {citiesError && (
                        <FieldError message="No se pudieron cargar las ciudades. Recarga la página." />
                      )}
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-[#5C5C5C]">
                      Barrio / Sector
                      <input
                        {...register("neighborhood")}
                        placeholder="La Carolina, El Girón"
                        className={inputClass}
                      />
                      <FieldError message={errors.neighborhood?.message} />
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-[#5C5C5C]">
                      Precio por mes
                      <input
                        type="number"
                        {...register("price")}
                        placeholder="USD 250"
                        className={inputClass}
                      />
                      <FieldError message={errors.price?.message} />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="flex flex-col gap-2 text-sm text-[#5C5C5C]">
                        Tipo de espacio
                        <select {...register("roomType")} className={inputClass}>
                          <option value="">
                            Selecciona tipo de habitación
                          </option>
                          {roomTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        <FieldError message={errors.roomType?.message} />
                      </label>

                      <div className="flex flex-col gap-2 text-sm text-[#5C5C5C]">
                        Áreas comunes
                        <div className="grid gap-2 rounded-3xl border border-[#E5D1C6] bg-[#FDF8F6] p-4">
                          {commonAreaOptions.map((area) => (
                            <button
                              key={area.id}
                              type="button"
                              onClick={() =>
                                toggleInList(
                                  "commonAreas",
                                  selectedAreas,
                                  area.name,
                                )
                              }
                              className={`rounded-2xl px-4 py-2 text-left text-sm transition ${selectedAreas.includes(area.name) ? "bg-[#8C3A27] text-white" : "bg-white text-[#5C5C5C] border border-[#E5D1C6]"}`}
                            >
                              {area.name}
                            </button>
                          ))}
                        </div>
                        <FieldError message={errors.commonAreas?.message} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 text-sm text-[#5C5C5C]">
                      Amenidades
                      <div className="grid gap-2 rounded-3xl border border-[#E5D1C6] bg-[#FDF8F6] p-4">
                        {amenityOptions.map((amenity) => (
                          <button
                            key={amenity.id}
                            type="button"
                            onClick={() =>
                              toggleInList(
                                "amenities",
                                selectedAmenities,
                                amenity.name,
                              )
                            }
                            className={`rounded-2xl px-4 py-2 text-left text-sm transition ${selectedAmenities.includes(amenity.name) ? "bg-[#8C3A27] text-white" : "bg-white text-[#5C5C5C] border border-[#E5D1C6]"}`}
                          >
                            {amenity.name}
                          </button>
                        ))}
                      </div>
                      <FieldError message={errors.amenities?.message} />
                    </div>
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
                      <p className="text-[#4D403D]">
                        {watchedValues.title || "Sin título"}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-[#E5D1C6] bg-[#FEF6F1] p-6">
                      <p className="text-sm font-bold text-[#8C3A27] mb-2">
                        Descripción
                      </p>
                      <p className="text-[#4D403D]">
                        {watchedValues.description || "Sin descripción"}
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-3xl border border-[#E5D1C6] bg-[#FEF6F1] p-6">
                        <p className="text-sm font-bold text-[#8C3A27] mb-2">
                          Dirección
                        </p>
                        <p className="text-[#4D403D]">
                          {watchedValues.address || "No especificada"}
                        </p>
                      </div>
                      <div className="rounded-3xl border border-[#E5D1C6] bg-[#FEF6F1] p-6">
                        <p className="text-sm font-bold text-[#8C3A27] mb-2">
                          Ciudad / Barrio
                        </p>
                        <p className="text-[#4D403D]">
                          {[
                            cities.find((c) => c.id === watchedValues.cityId)
                              ?.name,
                            watchedValues.neighborhood,
                          ]
                            .filter(Boolean)
                            .join(" / ") || "No especificado"}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-3xl border border-[#E5D1C6] bg-[#FEF6F1] p-6">
                        <p className="text-sm font-bold text-[#8C3A27] mb-2">
                          Precio
                        </p>
                        <p className="text-[#4D403D]">
                          {watchedValues.price
                            ? `$${watchedValues.price}`
                            : "Sin precio"}
                        </p>
                      </div>
                      <div className="rounded-3xl border border-[#E5D1C6] bg-[#FEF6F1] p-6">
                        <p className="text-sm font-bold text-[#8C3A27] mb-2">
                          Tipo de espacio
                        </p>
                        <p className="text-[#4D403D]">
                          {watchedValues.roomType || "No seleccionado"}
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
                  Una buena publicación aumenta tus posibilidades de encontrar
                  un buen roomie rápidamente.
                </p>
              </div>
            </aside>
          </main>

          <footer className="mt-12 flex flex-col gap-4 sm:flex-row items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-full border border-[#8C3A27] bg-white px-8 py-3 text-sm font-semibold text-[#8C3A27] hover:bg-[#F9F2EE] transition"
            >
              {step === 1 ? "Volver" : "Atrás"}
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
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-[#8C3A27] px-8 py-3 text-sm font-semibold text-white hover:bg-[#702d1f] transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Publicando..." : "Publicar Departamento"}
              </button>
            )}
          </footer>
        </form>
      </div>
    </div>
  );
};
