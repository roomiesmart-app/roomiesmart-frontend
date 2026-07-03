import React, { useState, useEffect, useCallback } from 'react';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { Filter, Plus, X } from 'lucide-react';
import { TransactionItem } from '../components/TransactionItem';
import { RoommateDebtCard } from '../components/RoommateDebtCard';
import { financesService } from '../services/finances.service';
import api from '../../identity-profile/services/api';

export const FinanceDashboardPage: React.FC = () => {
  const { user } = useKindeAuth();
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

    } catch (err) {
      console.error("Error al recuperar el perfil del usuario:", err);
      setErrorInfo("Error de conexión al cargar tu perfil.");
      setLoading(false); // Para que no se quede girando
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
      alert("Hubo un error al guardar el gasto en la Base de Datos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔥 LÓGICA DE VISUALIZACIÓN DINÁMICA (Para que nunca se oculte el layout)
  const budgetDisplay = presupuestoMensual > 0 ? `$${presupuestoMensual.toFixed(2)}` : '---';
  const youOweDisplay = data ? `$${data.summary.youOwe.toFixed(2)}` : '---';
  const owedToYouDisplay = data ? `$${data.summary.owedToYou.toFixed(2)}` : '---';
  const availableDisplay = data && presupuestoMensual > 0 
    ? `$${(presupuestoMensual - data.summary.youOwe + data.summary.owedToYou).toFixed(2)}` 
    : '---';

  return (
    <div className="flex-1 flex flex-col p-8 bg-[#FDFBF9] relative h-full">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-extrabold text-gray-900">Mis Finanzas</h2>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 text-gray-600 font-medium px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Filter size={18} /> Filtrar
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            disabled={!data || loading} // Desactiva el botón si no hay red
            className="flex items-center gap-2 bg-[#8C3A27] text-white px-5 py-2.5 rounded-full font-bold shadow-sm hover:bg-[#7a3222] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} /> Añadir gasto
          </button>
        </div>
      </header>

      {/* TARJETAS SIEMPRE VISIBLES */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 lg:col-span-2 space-y-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 px-2">Transacciones recientes</h3>
            
            {/* LÓGICA DE ESTADOS DE CARGA/ERROR EN LA LISTA */}
            {loading ? (
              <div className="bg-white p-8 text-center rounded-3xl border border-dashed border-[#F2E3DB] text-gray-500 font-medium">
                Sincronizando caja con el backend... 🔄
              </div>
            ) : errorInfo ? (
              <div className="bg-red-50 p-8 text-center rounded-3xl border border-red-200 text-red-600 font-medium">
                ⚠️ Sin conexión: {errorInfo}
              </div>
            ) : data?.transactions?.length === 0 ? (
              <div className="bg-white p-8 text-center rounded-3xl border border-dashed border-[#F2E3DB] text-gray-500">
                Aún no hay gastos registrados en este departamento.
              </div>
            ) : (
              <div className="space-y-4">
                {data?.transactions.map((tx: any) => (
                  <TransactionItem key={tx.id} transaction={tx} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-1 space-y-8 relative">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 px-2">Compañeros de piso</h3>
            {loading || errorInfo || !data?.roommateDebts || data?.roommateDebts.length === 0 ? (
              <div className="bg-white p-8 text-center text-sm rounded-3xl border border-dashed border-[#F2E3DB] text-gray-400">
                La lógica de deudas aparecerá aquí cuando haya conexión.
              </div>
            ) : (
              <div className="space-y-4">
                {data.roommateDebts.map((roomie: any) => (
                  <RoommateDebtCard key={roomie.id} data={roomie} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-2xl font-bold text-[#8C3A27] mb-2">Nuevo Gasto</h3>
            <p className="text-sm text-gray-500 mb-6">Añade una factura o compra para dividirla automáticamente en la Base de Datos.</p>
            
            <form onSubmit={handleSubmitExpense} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Descripción de la compra</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Internet, Supermaxi..."
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8C3A27] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Monto Total ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8C3A27] transition-all"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#8C3A27] text-white font-bold py-4 rounded-xl hover:bg-[#7a3222] transition-colors mt-4 disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando en BD...' : 'Procesar y Dividir'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};