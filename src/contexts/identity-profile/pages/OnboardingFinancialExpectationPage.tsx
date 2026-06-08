import { useOnboarding } from '../context/OnboardingContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ONBOARDING_ROUTES } from '../../../app/routes/constant';
import { validateFinancial } from '../validators/FinancialValidator';
import type { FinancialValidationErrors } from '../models/ValidationErrors';
import { hasErrors } from '../../../shared/utils/validationHelper';
import { useRegister } from '../../../hooks/useOnboardingMutation'; 

export default function FinancialExpectationsOnboarding() {
  const { formData, updateFormData } = useOnboarding();
  const { financial } = formData;
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FinancialValidationErrors>({});
  
  // Hook de mutación para el registro final
  const { mutate: register, isPending } = useRegister();

  useEffect(() => {
    console.log("Final Full Data to be sent to Backend:", formData);
  }, [formData]);

  const sharedItemsOptions = [
    'Nevera', 'Cafetera', 'Televisión', 'Productos limpieza', 
    'Lavadora', 'Microondas', 'Vajilla', 'Consola de juegos'
  ];

  const expenseManagementOptions = [
    { title: 'Fondo Común', desc: 'Aportamos una cantidad fija cada mes para todo el departamento.' },
    { title: 'División Digital', desc: 'Cada uno paga lo suyo y ajustamos cuentas en la app.' },
    { title: 'Todo Individual', desc: 'Cada roomie se encarga de sus propias compras exclusivamente.' }
  ];

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value, 10);
    updateFormData({
      financial: {
        ...financial,
        budgetRange: { min: 150, max: newMax }
      }
    });
  };

  const toggleSharedItem = (item: string) => {
    setErrors((prev: FinancialValidationErrors) => ({ ...prev, sharedItems: undefined }));
    const updated = financial.sharedItems.includes(item)
      ? financial.sharedItems.filter((i) => i !== item)
      : [...financial.sharedItems, item];
    updateFormData({ financial: { ...financial, sharedItems: updated } });
  };

  const handleFinish = () => {
    const validationErrors = validateFinancial(financial);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    register(formData, {
      onSuccess: () => {
        console.log("Registro exitoso!");
        navigate('/login');
      },
      onError: (err: any) => {
        console.error("Error al registrar usuario:", err);
        console.log("Motivo del rechazo del backend:", err.response?.data);
}
    });
  };

  return (
    <div className="min-h-screen bg-[#FDF9F8] p-4 sm:p-8 font-manrope">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <span className="font-bold text-primary">RoomieSmart</span>
        <div className="text-sm font-bold">Guardar borrador | Paso 4 de 4</div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <h2 className="font-bold mb-6">Presupuesto Mensual ($150 - $300)</h2>
            <input 
              type="range" 
              min="150" 
              max="300" 
              step="10" 
              value={financial.budgetRange.max} 
              onChange={handleBudgetChange} 
              className="w-full h-2 bg-gray-200 rounded-lg accent-[#A3513D]" 
            />
            <div className="flex justify-between mt-2 font-bold text-[#A3513D]">
              <span>$150</span>
              <span>Hasta ${financial.budgetRange.max}</span>
              <span>$300</span>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <h2 className="font-bold mb-6">Gestión de Gastos</h2>
            {expenseManagementOptions.map((item) => (
              <button 
                key={item.title} 
                onClick={() => updateFormData({ financial: { ...financial, expenseManagement: item.title } })} 
                className={`w-full p-4 border rounded-2xl mb-3 text-left ${financial.expenseManagement === item.title ? 'border-[#A3513D] bg-[#FFF5F3]' : 'border-gray-100'}`}
              >
                <p className="font-bold">{item.title}</p>
                <p className="text-xs text-neutral">{item.desc}</p>
              </button>
            ))}
            <h3 className="font-bold mt-6 mb-4">Objetos compartidos</h3>
            <div className="flex flex-wrap gap-2">
              {sharedItemsOptions.map((obj) => (
                <button 
                  key={obj} 
                  onClick={() => toggleSharedItem(obj)} 
                  className={`px-4 py-2 rounded-full border ${financial.sharedItems.includes(obj) ? 'bg-[#A3513D] text-white' : 'bg-white border-gray-200'}`}
                >
                  {obj}
                </button>
              ))}
            </div>
            {errors.sharedItems && <p className="text-red-500 text-xs font-bold mt-2">{errors.sharedItems}</p>}
          </section>
        </div>

        <section className="space-y-8">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <h2 className="font-bold mb-6">Preferencia de Habitación</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Privada', 'Compartida'].map((type) => (
                <button 
                  key={type} 
                  onClick={() => updateFormData({ financial: { ...financial, roomType: type } })} 
                  className={`p-6 rounded-2xl border ${financial.roomType === type ? 'border-[#A3513D] bg-[#FFF5F3]' : 'border-gray-100'}`}
                >
                  <p className="font-bold">{type}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="relative h-64 bg-[#A3513D] rounded-[32px] p-8 text-white overflow-hidden">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Roomies" />
            <div className="relative z-10">
              <p className="font-bold mb-2">¿Sabías que...?</p>
              <p className="text-sm">"Los compañeros que acuerdan sus finanzas el primer mes tienen un 40% menos de conflictos en el futuro."</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto mt-12 flex justify-between items-center py-6 border-t border-gray-200">
        <Link to={ONBOARDING_ROUTES.SOCIAL} className="font-bold">← Atrás</Link>
        <div className="flex flex-col items-end">
          {hasErrors(errors) && (
            <span className="text-red-500 text-xs font-bold mb-2 mr-2">⚠️ {Object.values(errors)[0]}</span>
          )}
          <button 
            onClick={handleFinish} 
            disabled={isPending}
            className="bg-[#A3513D] text-white px-10 py-3 rounded-full font-bold shadow-lg disabled:opacity-50"
          >
            {isPending ? 'Finalizando...' : 'Finalizar Perfil 🚀'}
          </button>
        </div>
      </footer>
    </div>
  );
}