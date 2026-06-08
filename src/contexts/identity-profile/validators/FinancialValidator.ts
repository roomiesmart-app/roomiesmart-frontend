import type { OnboardingProfile } from "../models/Profile";
import type { FinancialValidationErrors } from "../models/ValidationErrors";

export const validateFinancial = (financial: OnboardingProfile['financial']): FinancialValidationErrors => {
  const errors: FinancialValidationErrors = {}; 

  if (!financial.roomType) {
    errors.roomType = 'Selecciona un tipo de habitación';
  }
  if (!financial.expenseManagement) {
    errors.expenseManagement = 'Selecciona una forma de gestionar gastos';
  }
  if (financial.sharedItems.length === 0) {
    errors.sharedItems = 'Selecciona al menos un objeto compartido';
  }

  return errors; 
};