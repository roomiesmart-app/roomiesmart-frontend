import { z } from "zod";

export const publishSpaceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "El título debe tener al menos 5 caracteres."),
  description: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres."),
  photos: z
    .array(z.instanceof(File))
    .min(5, "Debes subir al menos 5 fotos.")
    .max(5, "Máximo 5 fotos."),
  cityId: z.string().min(1, "Selecciona una ciudad."),
  address: z.string().trim().min(5, "La dirección es obligatoria."),
  neighborhood: z.string().trim().min(3, "El barrio/sector es obligatorio."),
  price: z
    .string()
    .min(1, "El precio es obligatorio.")
    .refine((value) => Number(value) > 0, "El precio debe ser mayor a cero."),
  roomType: z.string().min(1, "Selecciona el tipo de espacio."),
  commonAreas: z
    .array(z.string())
    .min(1, "Selecciona al menos un área común."),
  amenities: z.array(z.string()).min(1, "Selecciona al menos una amenidad."),
});

export type PublishSpaceFormValues = z.infer<typeof publishSpaceSchema>;

export const editSpaceSchema = publishSpaceSchema.omit({
  photos: true,
  cityId: true,
});

export type EditSpaceFormValues = z.infer<typeof editSpaceSchema>;

export const stepFields: Record<number, (keyof PublishSpaceFormValues)[]> = {
  1: ["title", "description", "photos"],
  2: [
    "cityId",
    "address",
    "neighborhood",
    "price",
    "roomType",
    "commonAreas",
    "amenities",
  ],
};
