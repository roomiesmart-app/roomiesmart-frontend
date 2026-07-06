import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Receipt, DollarSign } from 'lucide-react';
import api from '../../identity-profile/services/api';
import { useRoomie } from '../../roomie/RoomieContext';
import { financesService } from '../services/finances.service';
import { TransactionItem } from '../components/TransactionItem';
import { RoommateDebtCard } from '../components/RoommateDebtCard';
import type { Transaction, RoommateDebt } from '../models/finance.types';

interface DashboardData {
  summary: { houseTotal: number; youOwe: number; owedToYou: number };
  transactions: Transaction[];
  roommateDebts: RoommateDebt[];
}

export const FinanceDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { departmentId: publishedDepartmentId } = useRoomie();
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [departmentId, setDepartmentId] = useState('');
  const [dbUserId, setDbUserId] = useState('');
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await api.get('/api/v1/identity/me');
      const userProfile = response.data.data;
      setMonthlyBudget(userProfile.monthlyBudget ?? 0);
      setDbUserId(userProfile.id);
      // Prioridad: 1) departamento publicado en esta sesión (RoomieContext),
      // 2) departamento real que devuelve /me (puede ser null si no tiene).
      setDepartmentId(publishedDepartmentId || userProfile.departmentId || '');
      setProfileLoaded(true);
    } catch (err) {
      console.error('Error al recuperar el perfil:', err);
      setError('No pudimos cargar tu perfil. Intenta de nuevo más tarde.');
      setLoading(false);
    }
  }, [publishedDepartmentId]);

  const loadDashboard = useCallback(async () => {
    if (!dbUserId) return;
    if (!departmentId) {
      // Perfil cargado pero sin departamento: no hay nada que sincronizar
      if (profileLoaded) setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await financesService.getDashboardData(departmentId, dbUserId);
      setData(result);
    } catch (err) {
      console.error(err);
      setError('No pudimos cargar tus gastos. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  }, [departmentId, dbUserId, profileLoaded]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const closeAddExpense = () => {
    setShowAddExpense(false);
    setExpenseTitle('');
    setExpenseAmount('');
    setFormError(null);
  };

  const handleAddExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!departmentId) {
      setFormError('No tienes un departamento vinculado todavía.');
      return;
    }

    const amount = Number(expenseAmount);
    if (!expenseTitle.trim()) {
      setFormError('Ponle un título al gasto.');
      return;
    }
    if (!amount || amount <= 0) {
      setFormError('El valor debe ser un número mayor a cero.');
      return;
    }

    setSubmitting(true);
    try {
      await financesService.addExpense(departmentId, dbUserId, amount, expenseTitle.trim());
      closeAddExpense();
      await loadDashboard();
    } catch (err) {
      console.error(err);
      setFormError('No se pudo registrar el gasto. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const youOwe = data?.summary.youOwe ?? 0;
  const owedToYou = data?.summary.owedToYou ?? 0;
  const available = monthlyBudget - youOwe + owedToYou;

  const budgetDisplay = monthlyBudget > 0 ? `$${monthlyBudget.toFixed(2)}` : '---';
  const youOweDisplay = data ? `$${youOwe.toFixed(2)}` : '---';
  const owedToYouDisplay = data ? `$${owedToYou.toFixed(2)}` : '---';
  const availableDisplay = data && monthlyBudget > 0 ? `$${available.toFixed(2)}` : '---';

  return (
    <div className="flex-1 flex flex-col p-8 bg-[#FDFBF9] relative h-full overflow-y-auto">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Mis Finanzas</h2>
        <button
          onClick={() => setShowAddExpense(true)}
          disabled={!departmentId}
          className="flex items-center gap-2 bg-[#8C3A27] text-white px-5 py-2.5 rounded-full font-bold shadow-sm hover:bg-[#7a3222] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} /> Añadir gasto
        </button>
      </header>

      {showAddExpense && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={closeAddExpense}
        >
          <div
            className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeAddExpense}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-extrabold text-gray-900 mb-1">Nuevo gasto</h3>
            <p className="text-gray-500 text-sm mb-6">Regístralo para dividirlo entre todos.</p>

            <form onSubmit={handleAddExpense} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Receipt size={14} /> ¿Qué fue?
                </label>
                <input
                  type="text"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  placeholder="Internet, limpieza, mercado..."
                  autoFocus
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30 focus:border-[#8C3A27] transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <DollarSign size={14} /> ¿Cuánto costó?
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full border border-gray-200 rounded-2xl pl-8 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30 focus:border-[#8C3A27] transition-all"
                  />
                </div>
              </div>

              {formError && (
                <div className="rounded-xl bg-[#FFF5F3] px-4 py-2.5 text-xs font-bold text-[#A3513D] border border-[#F2E3DB]">
                  {formError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeAddExpense}
                  className="flex-1 py-3 rounded-full font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-full font-bold text-white bg-[#8C3A27] hover:bg-[#7a3222] disabled:opacity-50 transition-colors"
                >
                  {submitting ? 'Guardando...' : 'Registrar gasto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#F2E3DB] flex flex-col justify-center">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Presupuesto</p>
          <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{budgetDisplay}</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#F2E3DB] flex flex-col justify-center">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Debes</p>
          <h3 className="text-3xl font-extrabold text-[#DC2626] mb-1">{youOweDisplay}</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#F2E3DB] flex flex-col justify-center">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Te deben</p>
          <h3 className="text-3xl font-extrabold text-[#059669] mb-1">{owedToYouDisplay}</h3>
        </div>
        <div className="bg-[#8C3A27] p-6 rounded-[2rem] shadow-md flex flex-col justify-center">
          <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">Disponible Real</p>
          <h3 className="text-4xl font-extrabold text-white mb-1">{availableDisplay}</h3>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-[#FFF5F3] px-4 py-3 text-sm font-bold text-[#A3513D] border border-[#F2E3DB]">
          ⚠️ {error}
        </div>
      )}

      {loading && !data && <div className="text-center text-gray-500 mb-6">Sincronizando...</div>}

      {profileLoaded && !departmentId && !loading && (
        <div className="bg-white rounded-[2rem] border border-[#F2E3DB] p-10 text-center mb-10">
          <h3 className="text-xl font-extrabold text-gray-900 mb-2">
            Aún no tienes un departamento vinculado
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Publica tu espacio para activar las finanzas compartidas con tus roomies.
          </p>
          <button
            onClick={() => navigate('/publish-department')}
            className="bg-[#8C3A27] text-white px-8 py-3 rounded-full font-bold hover:bg-[#7a3222] transition-colors"
          >
            Publicar mi departamento
          </button>
        </div>
      )}

      {data && data.roommateDebts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {data.roommateDebts.map((debt) => (
            <RoommateDebtCard key={debt.id} data={debt} />
          ))}
        </div>
      )}

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Gastos del departamento</h3>
        {data && data.transactions.length === 0 && (
          <p className="text-gray-500 text-sm">Todavía no hay gastos registrados.</p>
        )}
        <div className="space-y-3">
          {data?.transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>
    </div>
  );
};
