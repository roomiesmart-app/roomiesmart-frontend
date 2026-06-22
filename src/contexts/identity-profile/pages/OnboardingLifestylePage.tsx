import { useOnboarding } from '../context/OnboardingContext';
import { Link, useNavigate } from 'react-router-dom';
import { ONBOARDING_ROUTES } from '../../../app/routes/constant';
import { validateLifestyle } from '../validators/LifestyleValidator';
import type { LifestyleValidationErrors } from '../models/ValidationErrors';
import { hasErrors } from '../../../shared/utils/validationHelper';
import { useState, useEffect } from 'react';

export default function OnboardingLifestylePage() {
  const { formData, updateFormData } = useOnboarding();
  const { lifestyle } = formData;
  const navigate = useNavigate();
  const [errors, setErrors] = useState<LifestyleValidationErrors>({});

  useEffect(() => {
    console.log("Current Full Form Data (Persisting Step 1 + Step 2):", formData);
  }, [formData]);

  const toggleSharedTask = (tarea: string) => {
    const currentTasks = lifestyle.sharedTasks;
    const newTasks = currentTasks.includes(tarea)
      ? currentTasks.filter((t: string) => t !== tarea)
      : [...currentTasks, tarea];

    updateFormData({
      lifestyle: { ...lifestyle, sharedTasks: newTasks },
    });
  };

  const handleContinue = () => {
    const validationErrors = validateLifestyle(lifestyle);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }
    navigate(ONBOARDING_ROUTES.SOCIAL);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto w-full mb-8 mt-4 sm:mt-0">
        <p className="text-sm text-neutral mb-2">Hábitos y Limpieza</p>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-secondary">Cultivando la armonía</h1>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="w-2/4 h-full bg-primary rounded-full transition-all duration-500"></div>
        </div>
        <p className="text-neutral mt-6 text-sm sm:text-base">
          La convivencia empieza por los acuerdos. Cuéntanos cómo prefieres gestionar el espacio compartido para encontrar a tu roomie ideal.
        </p>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <section className="bg-white rounded-[40px] p-6 sm:p-10 shadow-xl border border-primary/5">
          <div className="space-y-10">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-secondary mb-4">
                🧹 Frecuencia de limpieza
              </label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {['Diaria', '2-3 veces/semana', 'Semanal'].map((frecuencia) => (
                  <button
                    key={frecuencia}
                    type="button"
                    onClick={() => {
                      setErrors({});
                      updateFormData({
                        lifestyle: { ...lifestyle, cleaningFrequency: frecuencia },
                      });
                    }}
                    className={`flex-1 rounded-2xl border py-4 px-2 text-sm font-medium transition-all ${
                      lifestyle.cleaningFrequency === frecuencia
                        ? 'bg-primary text-white border-primary shadow-md transform scale-[1.02]'
                        : 'bg-white text-secondary border-primary/20 hover:bg-primary/5 hover:border-primary/50'
                    }`}
                  >
                    {frecuencia}
                  </button>
                ))}
              </div>
              {errors.cleaningFrequency && (
                <p className="text-red-500 text-xs font-bold mt-2">{errors.cleaningFrequency}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-secondary mb-4">
                🕒 Ritmo de Vida Universitario
              </label>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() =>
                    updateFormData({
                      lifestyle: { ...lifestyle, isEarlyBird: !lifestyle.isEarlyBird },
                    })
                  }
                  className={`w-full flex items-start sm:items-center justify-between p-5 rounded-2xl border transition-all text-left ${
                    lifestyle.isEarlyBird
                      ? 'bg-[#EAF4F4] border-[#81B29A] shadow-sm' 
                      : 'bg-white border-primary/10 hover:border-primary/30'
                  }`}
                >
                  <div className="pr-4">
                    <p className={`text-base font-bold ${lifestyle.isEarlyBird ? 'text-[#1D3557]' : 'text-secondary'}`}>
                      ☀️ Team Madrugador
                    </p>
                    <p className="text-xs text-neutral mt-1">
                      Ideal si tienes clases a las 7 AM y prefieres que la casa esté activa desde temprano.
                    </p>
                  </div>
                  <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    lifestyle.isEarlyBird ? 'border-[#81B29A] bg-[#81B29A]' : 'border-gray-300'
                  }`}>
                    {lifestyle.isEarlyBird && <span className="text-white text-xs">✓</span>}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateFormData({
                      lifestyle: { ...lifestyle, useCommonAreasAtNight: !lifestyle.useCommonAreasAtNight },
                    })
                  }
                  className={`w-full flex items-start sm:items-center justify-between p-5 rounded-2xl border transition-all text-left ${
                    lifestyle.useCommonAreasAtNight
                      ? 'bg-[#1D3557] border-[#1D3557] shadow-sm' 
                      : 'bg-white border-primary/10 hover:border-primary/30'
                  }`}
                >
                  <div className="pr-4">
                    <p className={`text-base font-bold ${lifestyle.useCommonAreasAtNight ? 'text-white' : 'text-secondary'}`}>
                      🦉 Búho Nocturno
                    </p>
                    <p className={`text-xs mt-1 ${lifestyle.useCommonAreasAtNight ? 'text-gray-300' : 'text-neutral'}`}>
                      Suelo usar la cocina o la sala para amanecidas de proyectos y estudio hasta tarde.
                    </p>
                  </div>
                  <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    lifestyle.useCommonAreasAtNight ? 'border-white bg-white' : 'border-gray-300'
                  }`}>
                    {lifestyle.useCommonAreasAtNight && <span className="text-[#1D3557] text-xs font-bold">✓</span>}
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-secondary mb-4">
                👥 Tareas compartidas
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {['Compras conjuntas', 'Turnos de basura', 'Cocina por turnos', 'Lavandería organizada'].map(
                  (tarea) => (
                    <button
                      key={tarea}
                      type="button"
                      onClick={() => toggleSharedTask(tarea)}
                      className={`px-4 py-2.5 rounded-full border text-xs sm:text-sm transition-all ${
                        lifestyle.sharedTasks.includes(tarea)
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-white text-secondary border-primary/20 hover:bg-primary/10'
                      }`}
                    >
                      {tarea}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary/5 rounded-[40px] p-6 sm:p-8 flex flex-col items-center justify-center text-center mt-8 lg:mt-0 cursor-default select-none border border-primary/10">
          <div className="w-full bg-white rounded-[24px] p-6 shadow-sm border border-primary/10 pointer-events-none">
            <div className="h-32 sm:h-40 bg-orange-50 rounded-xl mb-6 flex items-center justify-center">
               <span className="text-4xl">🪴</span>
            </div>
            <p className="text-base font-bold text-primary mb-2">Sincronización de Hábitos</p>
            <p className="text-xs sm:text-sm text-neutral mb-6">
              Tus selecciones se guardan en tiempo real para encontrar el match perfecto.
            </p>
            <div className="w-full bg-gray-100 h-2 rounded-full mb-3 overflow-hidden">
              <div className="w-full bg-[#81B29A] h-full rounded-full transition-all duration-500"></div>
            </div>
            <p className="text-xs text-secondary font-semibold">Perfil de convivencia listo.</p>
          </div>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-6xl mt-8 mb-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-200 pt-6">
        <Link
          to={ONBOARDING_ROUTES.IDENTITY}
          className="text-sm font-bold text-neutral hover:text-secondary transition-all px-4 py-2"
        >
          ← Volver al Paso 1
        </Link>
        <div className="flex flex-col items-end">
          {Object.keys(errors).length > 0 && (
            <span className="text-red-500 text-xs font-bold mb-2 mr-2">
              ⚠️ {Object.values(errors)[0]}
            </span>
          )}
          <button
            type="button"
            onClick={handleContinue}
            className="bg-primary px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-sm font-bold text-white hover:bg-[#a3513d] transition-all shadow-lg shadow-primary/20 active:scale-95"
          >
            Continuar al Paso 3
          </button>
        </div>
      </footer>
    </>
  );
}