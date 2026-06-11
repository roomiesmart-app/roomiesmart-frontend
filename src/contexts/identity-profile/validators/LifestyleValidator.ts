import type { OnboardingProfile } from "../models/Profile";
import type { LifestyleValidationErrors } from "../models/ValidationErrors";

export const validateLifestyle = (lifestyle: OnboardingProfile['lifestyle']): LifestyleValidationErrors => {
  const errors: LifestyleValidationErrors = {};

  if (!lifestyle.cleaningFrequency) {
    errors.cleaningFrequency = 'Selecciona una frecuencia de limpieza';
  }

  return errors;
};