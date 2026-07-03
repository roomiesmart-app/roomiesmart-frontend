import React, { useState, useEffect, useCallback } from 'react';
import { Filter, Plus, X } from 'lucide-react';
import { TransactionItem } from '../components/TransactionItem';
import { RoommateDebtCard } from '../components/RoommateDebtCard';
import { financesService } from '../services/finances.service';
import api from '../../identity-profile/services/api';

export const FinanceDashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ title: '', amount: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [presupuestoMensual, setPresupuestoMensual] = useState<number>(0);
  const [departmentId, setDepartmentId] = useState<string>("");
  const [dbUserId, setDbUserId] = useState<string>("");

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await api.get('/api/v1/identity/me'); 
      const userProfile = response.data.data;

      setPresupuestoMensual(userProfile.monthlyBudget || 0); 
      setDbUserId(userProfile.id); 
      setDepartmentId(userProfile.departmentId); 
    } catch (err: any) {
      console.error("Error al recuperar el perfil:", err);
      setErrorInfo("Error de conexión al cargar tu perfil.");
      setLoading(false);
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    if (!departmentId || !dbUserId) return;
    
    setLoading(true);
    setErrorInfo(null);
    try {
      const result = await financesService.getDashboardData(departmentId, dbUserId);
      setData(result);
    } catch (error: any) {
      setErrorInfo(error.message || "Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }, [dbUserId, departmentId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (departmentId && dbUserId) {
      loadDashboard();
    }
  }, [departmentId, dbUserId, loadDashboard]);

  const handleSubmitExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount || !dbUserId || !departmentId) return;

    setIsSubmitting(true);
    try {
      await financesService.addExpense(
        departmentId, 
        dbUserId, 
        parseFloat(newExpense.amount), 
        newExpense.title
      );
      
      setIsModalOpen(false);
      setNewExpense({ title: '', amount: '' });
      loadDashboard();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al guardar el gasto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const budgetDisplay = presupuestoMensual > 0 ? `$${presupuestoMensual.toFixed(2)}` : '---';
  const youOweDisplay = data ? `$${data.summary.youOwe.toFixed(2)}` : '---';
  const owedToYouDisplay = data ? `$${data.summary.owedToYou.toFixed(2)}` : '---';
  const availableDisplay = data && presupuestoMensual > 0 
    ? `$${(presupuestoMensual - data.summary.youOwe + data.summary.owedToYou).toFixed(2)}` 
    : '---';

  return (
    <div className="flex-1 flex flex-col p-8 bg-[#FDFBF9] relative h-full">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Mis Finanzas</h2>
        <button 
            onClick={() => setIsModalOpen(true)}
            disabled={!data || loading}
            className="flex items-center gap-2 bg-[#8C3A27] text-white px-5 py-2.5 rounded-full font-bold shadow-sm hover:bg-[#7a3222] transition-colors disabled:opacity-50"
          >
            <Plus size={18} /> Añadir gasto
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#F2E3DB] flex flex-col justify-center">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Presupuesto</p>
          <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{budgetDisplay}</h3>
          <p className="text-gray-400 text-xs">Mensual</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#F2E3DB] flex flex-col justify-center">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Debes</p>
          <h3 className="text-3xl font-extrabold text-[#DC2626] mb-1">{youOweDisplay}</h3>
          <p className="text-gray-400 text-xs">A tus roomies</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#F2E3DB] flex flex-col justify-center">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Te deben</p>
          <h3 className="text-3xl font-extrabold text-[#059669] mb-1">{owedToYouDisplay}</h3>
          <p className="text-gray-400 text-xs">Deudas pendientes</p>
        </div>
        <div className="bg-[#8C3A27] p-6 rounded-[2rem] shadow-md relative overflow-hidden flex flex-col justify-center">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white rounded-full opacity-10"></div>
          <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1 relative z-10">Disponible Real</p>
          <h3 className="text-4xl font-extrabold text-white mb-1 relative z-10">{availableDisplay}</h3>
          <p className="text-white/70 text-xs relative z-10">Para el resto del mes</p>
        </div>
      </div>
      
      {/* ...resto del JSX igual... */}
    </div>
  );
};