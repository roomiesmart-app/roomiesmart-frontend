import type { OnboardingProfile } from "../models/Profile";
import type { IdentityProfileErrors } from "../models/ValidationErrors";
import { ONLY_LETTERS_REGEX, UCE_EMAIL_REGEX, POSITIVE_INTEGER_REGEX } from "./regexPatterns";

export const validateIdentityProfile = (formData: OnboardingProfile): IdentityProfileErrors => {
  const errors: IdentityProfileErrors = {};

  if (!formData.name.trim()) {
    errors.name = 'El nombre es obligatorio';
  } else if (!ONLY_LETTERS_REGEX.test(formData.name)) {
    errors.name = 'El nombre solo puede contener letras';
  }

  if (!formData.email.trim()) {
    errors.email = 'El correo es obligatorio';
  } else if (!UCE_EMAIL_REGEX.test(formData.email)) {
    errors.email = 'Debe ser un correo válido de la UCE';
  }

  const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  
  if (!formData.password) {
    errors.password = 'La contraseña es obligatoria';
  } else if (!passwordRegex.test(formData.password)) {
    errors.password = 'Debe tener al menos 8 caracteres y un símbolo especial';
  }
  localStorage
  if (!formData.age || formData.age <= 0) {
    errors.age = 'La edad es obligatoria';
  } else if (formData.age < 16 || formData.age > 99) {
    errors.age = 'Ingresa una edad válida (16-99)';
  }

  if (!formData.gender) {
    errors.gender = 'Selecciona un género';
  }

  if (!formData.career.trim()) {
    errors.career = 'La carrera es obligatoria';
  } else if (!ONLY_LETTERS_REGEX.test(formData.career)) {
    errors.career = 'La carrera solo puede contener letras';
  }

  if (!formData.semester.trim()) {
    errors.semester = 'El semestre es obligatorio';
  } else if (!POSITIVE_INTEGER_REGEX.test(formData.semester)) {
    errors.semester = 'Ingresa solo números enteros';
  } else if (parseInt(formData.semester, 10) > 12) {
    errors.semester = 'El semestre no puede ser mayor a 12';
  }

  if (!formData.birthCity.trim()) {
    errors.birthCity = 'La ciudad de nacimiento es obligatoria';
  } else if (!ONLY_LETTERS_REGEX.test(formData.birthCity)) {
    errors.birthCity = 'La ciudad solo puede contener letras';
  }

  return errors;
};