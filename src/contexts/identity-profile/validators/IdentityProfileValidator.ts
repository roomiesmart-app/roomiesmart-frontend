import type { OnboardingProfile } from "../models/Profile";
import type { IdentityProfileErrors } from "../models/ValidationErrors";
import {
  identityProfileSchema,
  zodIssuesToErrorMap,
} from "../schemas/onboarding.schema";

export const validateIdentityProfile = (
  formData: OnboardingProfile,
): IdentityProfileErrors =>
  zodIssuesToErrorMap<IdentityProfileErrors>(
    identityProfileSchema.safeParse(formData),
  );
