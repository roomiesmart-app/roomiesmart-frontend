import type { LifestyleValidationErrors } from '../models/ValidationErrors';

export interface LifestyleData {
  cleaningFrequency: string;
  isEarlyBird: boolean;
  useCommonAreasAtNight: boolean;
  sharedTasks: string[];
}

export const validateLifestyle = (lifestyle: LifestyleData): LifestyleValidationErrors => {
  const errors: LifestyleValidationErrors = {};

  if (!lifestyle.cleaningFrequency || lifestyle.cleaningFrequency.trim() === '') {
    errors.cleaningFrequency = 'Debes seleccionar una frecuencia de limpieza.';
  }

  if (!lifestyle.isEarlyBird && !lifestyle.useCommonAreasAtNight) {
    errors.rhythm = 'Selecciona al menos un ritmo de vida universitario.';
  }

  if (!lifestyle.sharedTasks || lifestyle.sharedTasks.length === 0) {
    errors.sharedTasks = 'Debes seleccionar al menos una tarea compartida.';
  }

  return errors;
};