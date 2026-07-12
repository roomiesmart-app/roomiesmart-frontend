import type { OnboardingProfile } from "../models/Profile";
import type { FinancialValidationErrors } from "../models/ValidationErrors";
import {
  financialSchema,
  zodIssuesToErrorMap,
} from "../schemas/onboarding.schema";

export const validateFinancial = (
  financial: OnboardingProfile["financial"],
): FinancialValidationErrors =>
  zodIssuesToErrorMap<FinancialValidationErrors>(
    financialSchema.safeParse(financial),
  );
