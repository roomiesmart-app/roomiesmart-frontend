import type { LifestyleValidationErrors } from "../models/ValidationErrors";
import {
  lifestyleSchema,
  zodIssuesToErrorMap,
  type LifestyleValues,
} from "../schemas/onboarding.schema";

export type LifestyleData = LifestyleValues;

export const validateLifestyle = (
  lifestyle: LifestyleData,
): LifestyleValidationErrors =>
  zodIssuesToErrorMap<LifestyleValidationErrors>(
    lifestyleSchema.safeParse(lifestyle),
  );
