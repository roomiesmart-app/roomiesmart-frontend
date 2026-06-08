import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOnboarding } from '../context/OnboardingContext';
import { validateIdentityProfile } from '../validators/IdentityProfileValidator';
import type { IdentityProfileErrors } from '../models/ValidationErrors';
import { TextField } from '../../../shared/components/ui/TextField';
import { SelectField } from '../../../shared/components/ui/SelectField';
import { ONBOARDING_ROUTES } from '../../../app/routes/constant';
import { hasErrors } from '../../../shared/utils/validationHelper';

export default function OnboardingIdentityPage() {
  const { formData, updateFormData } = useOnboarding();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<IdentityProfileErrors>({});

  const handleContinue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateIdentityProfile(formData);

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    navigate(ONBOARDING_ROUTES.LIFESTYLE);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#FCF7F6] to-[#FDECE8] p-4 sm:p-8 font-manrope">
      <div className="max-w-6xl mx-auto w-full mb-8 mt-4 sm:mt-0">
        <p className="text-sm text-neutral mb-2">Identidad</p>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-secondary">Paso 1 de 4: Crea tu perfil base.</h1>
          <span className="text-sm font-bold text-primary">Paso 1</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="w-1/4 h-full bg-primary rounded-full transition-all duration-500"></div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto w-full">
        <section className="bg-white rounded-[40px] p-6 sm:p-10 shadow-xl border border-primary/5">
          <form onSubmit={handleContinue} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <TextField
              label="Nombre completo"
              placeholder="Ej. Carlos Mendoza"
              value={formData.name}
              error={errors.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ name: e.target.value })}
            />

            <TextField
              label="Correo Institucional"
              type="email"
              placeholder="usuario@uce.edu.ec"
              value={formData.email}
              error={errors.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ email: e.target.value.toLowerCase() })}
            />

            <TextField
              label="Contraseña Segura"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              error={errors.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ password: e.target.value })}
            />

            <TextField
              label="Edad"
              type="number"
              placeholder="Ej. 21"
              value={formData.age || ''}
              error={errors.age}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ age: parseInt(e.target.value) || 0 })}
            />

            <SelectField
              label="Género"
              value={formData.gender}
              error={errors.gender}
              options={[
                { value: 'Masculino', label: 'Masculino' },
                { value: 'Femenino', label: 'Femenino' },
                { value: 'Otro', label: 'Otro / Prefiero no decirlo' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData({ gender: e.target.value })}
            />

            <TextField
              label="Ciudad de Nacimiento"
              placeholder="Ej. Quito"
              value={formData.birthCity}
              error={errors.birthCity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ birthCity: e.target.value })}
            />

            <TextField
              label="Carrera en la UCE"
              placeholder="Ej. Ingeniería en Sistemas"
              value={formData.career}
              error={errors.career}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ career: e.target.value })}
            />

            <TextField
              label="Semestre Actual"
              placeholder="Ej. 7"
              value={formData.semester}
              error={errors.semester}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ semester: e.target.value })}
            />

            <div className="md:col-span-2 flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
              <Link to="/login" className="text-sm font-bold text-neutral hover:text-secondary p-2">
                ← Volver al Login
              </Link>
              <button
                type="submit"
                className="bg-primary px-8 py-3 rounded-full text-sm font-bold text-white hover:bg-[#a3513d] transition-all shadow-lg shadow-primary/20 active:scale-95"
              >
                Continuar al Paso 2
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}