import type { OnboardingProfile } from "../models/Profile";
import type { SocialValidationErrors } from "../models/ValidationErrors";
import {
  socialSchema,
  zodIssuesToErrorMap,
} from "../schemas/onboarding.schema";

export const validateSocial = (
  social: OnboardingProfile["social"],
): SocialValidationErrors =>
  zodIssuesToErrorMap<SocialValidationErrors>(socialSchema.safeParse(social));
