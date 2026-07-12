import { z } from "zod";
import {
  ONLY_LETTERS_REGEX,
  POSITIVE_INTEGER_REGEX,
} from "../validators/regexPatterns";

export const identityProfileSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  email: z.string().trim().min(1, "El correo es obligatorio"),
  age: z
    .number({ message: "La edad es obligatoria" })
    .min(16, "Ingresa una edad válida (16-99)")
    .max(99, "Ingresa una edad válida (16-99)"),
  gender: z.string().min(1, "Selecciona un género"),
  career: z
    .string()
    .trim()
    .min(1, "La carrera es obligatoria")
    .regex(ONLY_LETTERS_REGEX, "La carrera solo puede contener letras"),
  semester: z
    .string()
    .trim()
    .min(1, "El semestre es obligatorio")
    .regex(POSITIVE_INTEGER_REGEX, "Ingresa solo números enteros")
    .refine((v) => parseInt(v, 10) <= 12, "El semestre no puede ser mayor a 12"),
  birthCity: z
    .string()
    .trim()
    .min(1, "La ciudad de nacimiento es obligatoria")
    .regex(ONLY_LETTERS_REGEX, "La ciudad solo puede contener letras"),
});

export const lifestyleSchema = z
  .object({
    cleaningFrequency: z
      .string()
      .trim()
      .min(1, "Debes seleccionar una frecuencia de limpieza."),
    isEarlyBird: z.boolean(),
    useCommonAreasAtNight: z.boolean(),
    sharedTasks: z
      .array(z.string())
      .min(1, "Debes seleccionar al menos una tarea compartida."),
  })
  .superRefine((data, ctx) => {
    if (!data.isEarlyBird && !data.useCommonAreasAtNight) {
      ctx.addIssue({
        code: "custom",
        path: ["rhythm"],
        message: "Selecciona al menos un ritmo de vida universitario.",
      });
    }
  });

export const socialSchema = z.object({
  hobbies: z.array(z.string()).min(1, "Selecciona al menos un hobby"),
  musicGenres: z
    .array(z.string())
    .min(1, "Selecciona al menos un género musical"),
  petPreference: z.string().min(1, "Selecciona tu preferencia de mascotas"),
  smokingPreference: z.string().min(1, "Selecciona tu preferencia de humo"),
  socialLevel: z.string().min(1, "Selecciona tu nivel social"),
});

export const financialSchema = z.object({
  roomType: z.string().min(1, "Selecciona un tipo de habitación"),
  expenseManagement: z
    .string()
    .min(1, "Selecciona una forma de gestionar gastos"),
  sharedItems: z
    .array(z.string())
    .min(1, "Selecciona al menos un objeto compartido"),
});

export type IdentityProfileValues = z.infer<typeof identityProfileSchema>;
export type LifestyleValues = z.infer<typeof lifestyleSchema>;
export type SocialValues = z.infer<typeof socialSchema>;
export type FinancialValues = z.infer<typeof financialSchema>;

export function zodIssuesToErrorMap<T>(
  result: { success: boolean; error?: z.ZodError },
): T {
  const errors: Record<string, string> = {};
  if (!result.success && result.error) {
    for (const issue of result.error.issues) {
      const field = String(issue.path[0] ?? "form");
      if (!errors[field]) errors[field] = issue.message;
    }
  }
  return errors as T;
}
