import type { OnboardingProfile } from "../models/Profile";
import type { SocialValidationErrors } from "../models/ValidationErrors";

export const validateSocial = (social: OnboardingProfile['social']): SocialValidationErrors => {
  const errors: SocialValidationErrors = {};

  if (social.hobbies.length === 0) errors.hobbies = "Selecciona al menos un hobby";
  if (social.musicGenres.length === 0) errors.musicGenres = "Selecciona al menos un género musical";
  if (!social.petPreference) errors.petPreference = "Selecciona tu preferencia de mascotas";
  if (!social.smokingPreference) errors.smokingPreference = "Selecciona tu preferencia de humo";
  if (!social.socialLevel) errors.socialLevel = "Selecciona tu nivel social";

  return errors;
};