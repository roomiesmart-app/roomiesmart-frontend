import { z } from "zod";

export const expenseSchema = z.object({
  title: z.string().trim().min(1, "Ponle un título al gasto."),
  amount: z
    .string()
    .min(1, "El valor es obligatorio.")
    .refine(
      (v) => Number(v) > 0,
      "El valor debe ser un número mayor a cero.",
    ),
  participantIds: z
    .array(z.string())
    .min(1, "Selecciona al menos una persona involucrada en el gasto."),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
