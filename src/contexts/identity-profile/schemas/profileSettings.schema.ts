import { z } from "zod";

export const profileSettingsSchema = z
  .object({
    isEarlyBird: z.boolean(),
    minBudget: z
      .string()
      .refine(
        (v) => v === "" || Number(v) >= 50,
        "El presupuesto mínimo no puede ser menor a $50.",
      ),
    maxBudget: z
      .string()
      .refine(
        (v) => v === "" || (Number(v) > 0 && Number(v) <= 2000),
        "El presupuesto máximo no puede superar los $2000.",
      ),
  })
  .superRefine((data, ctx) => {
    if (
      data.minBudget !== "" &&
      data.maxBudget !== "" &&
      Number(data.minBudget) > Number(data.maxBudget)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["maxBudget"],
        message: "El presupuesto mínimo no puede ser mayor al máximo.",
      });
    }
  });

export type ProfileSettingsValues = z.infer<typeof profileSettingsSchema>;
