import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Plus, X, Receipt, DollarSign, Users } from 'lucide-react';
import api from '../../identity-profile/services/api';
import { useRoomie } from '../../roomie/RoomieContext';
import {
  financesService,
  type FinanceDashboardData,
} from '../services/finances.service';
import { expenseSchema, type ExpenseFormValues } from '../schemas/expense.schema';
import {
  getDepartmentMembers,
  type DepartmentMembersInfo,
} from '../../matchmaking/services/MembershipService';
import { listMyDepartments } from '../../matchmaking/services/PublishService';
import { TransactionItem } from '../components/TransactionItem';
import { RoommateDebtCard } from '../components/RoommateDebtCard';
import { DepartmentSelector } from '../components/DepartmentSelector';
import { DebtDetailModal } from '../components/DebtDetailModal';
import { StatCard } from '../../../shared/components/ui/StatCard';
import { ModalShell } from '../../../shared/components/ui/ModalShell';
import { AlertBanner } from '../../../shared/components/ui/AlertBanner';
import { Toast } from '../../../shared/components/ui/Toast';
import { useToast } from '../../../hooks/useToast';
import type { RoommateDebt } from '../models/finance.types';

const memberName = (email?: string) => email?.split('@')[0] || 'Roomie';

export const FinanceDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { departmentId: publishedDepartmentId } = useRoomie();
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [profileDepartmentId, setProfileDepartmentId] = useState('');
  const [dbUserId, setDbUserId] = useState('');
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [membersInfo, setMembersInfo] = useState<DepartmentMembersInfo | null>(null);

  const [data, setData] = useState<FinanceDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [detailRoomieId, setDetailRoomieId] = useState<string | null>(null);
  const [remindingId, setRemindingId] = useState<string | null>(null);
  const [payingExpenseId, setPayingExpenseId] = useState<string | null>(null);
  const { toast, showToast } = useToast();

  const {
    register: registerExpense,
    handleSubmit: handleExpenseSubmit,
    reset: resetExpenseForm,
    watch: watchExpense,
    formState: { errors: expenseErrors, isSubmitting: submittingExpense },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    mode: 'onTouched',
    defaultValues: { title: '', amount: '', participantIds: [] },
  });

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await api.get('/api/v1/identity/me');
      const userProfile = response.data.data;
      setMonthlyBudget(userProfile.monthlyBudget ?? 0);
      setDbUserId(userProfile.id);
      setProfileDepartmentId(userProfile.departmentId || '');
      setProfileLoaded(true);
    } catch (err) {
      console.error('Error al recuperar el perfil:', err);
      setError('No pudimos cargar tu perfil. Intenta de nuevo más tarde.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Departamentos donde el usuario es dueño O miembro (para el selector)
  const { data: myDepartments = [] } = useQuery({
    queryKey: ['my-departments', dbUserId],
    queryFn: () => listMyDepartments(dbUserId),
    staleTime: 60_000,
    enabled: Boolean(dbUserId),
  });

  useEffect(() => {
    if (!profileLoaded) return;
    setSelectedDepartmentId((current) => {
      const isValid =
        current &&
        (myDepartments.some((s) => s.id === current) ||
          current === profileDepartmentId);
      if (isValid) return current;
      if (myDepartments.some((s) => s.id === publishedDepartmentId))
        return publishedDepartmentId;
      if (myDepartments.length > 0) return myDepartments[0].id;
      return profileDepartmentId || publishedDepartmentId || '';
    });
  }, [profileLoaded, myDepartments, profileDepartmentId, publishedDepartmentId]);

  useEffect(() => {
    if (!selectedDepartmentId) {
      setMembersInfo(null);
      return;
    }
    let cancelled = false;
    setMembersInfo(null);
    setData(null);
    setLoading(true);
    getDepartmentMembers(selectedDepartmentId)
      .then((info) => {
        if (!cancelled) setMembersInfo(info);
      })
      .catch((err) => {
        console.error('No se pudieron cargar los miembros:', err);
        if (!cancelled) {
          setError('No pudimos cargar los miembros del departamento.');
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDepartmentId]);

  const sharedFinancesEnabled = membersInfo?.sharedFinancesEnabled ?? true;

  const loadDashboard = useCallback(async () => {
    if (!dbUserId) return;
    if (!selectedDepartmentId) {
      if (profileLoaded) setLoading(false);
      return;
    }
    if (!membersInfo) return;
    if (!membersInfo.sharedFinancesEnabled) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await financesService.getDashboardData(
        selectedDepartmentId,
        dbUserId,
        membersInfo.members.map((member) => ({
          id: member.user_id,
          email: member.users?.email,
        })),
      );
      setData(result);
    } catch (err) {
      console.error(err);
      setError('No pudimos cargar tus gastos. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  }, [selectedDepartmentId, dbUserId, profileLoaded, membersInfo]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const openAddExpense = () => {
    resetExpenseForm({
      title: '',
      amount: '',
      participantIds: membersInfo?.members.map((m) => m.user_id) ?? [],
    });
    setFormError(null);
    setShowAddExpense(true);
  };

  const closeAddExpense = () => {
    setShowAddExpense(false);
    resetExpenseForm();
    setFormError(null);
  };

  const onAddExpense = async (values: ExpenseFormValues) => {
    setFormError(null);

    if (!selectedDepartmentId) {
      setFormError('No tienes un departamento vinculado todavía.');
      return;
    }

    try {
      await financesService.addExpense(
        selectedDepartmentId,
        dbUserId,
        Number(values.amount),
        values.title.trim(),
        values.participantIds,
      );
      closeAddExpense();
      await loadDashboard();
    } catch (err) {
      console.error(err);
      setFormError('No se pudo registrar el gasto. Intenta de nuevo.');
    }
  };

  const activeDebt =
    data?.roommateDebts.find((debt) => debt.id === detailRoomieId) ?? null;

  const myName = memberName(
    membersInfo?.members.find((m) => m.user_id === dbUserId)?.users?.email,
  );

  const handleRemind = async (debt: RoommateDebt) => {
    setRemindingId(debt.id);
    try {
      await financesService.sendReminder({
        debtorId: debt.id,
        creditorName: myName,
        amount: debt.amount,
        items: debt.breakdown
          .filter((item) => item.kind === 'they_owe')
          .map((item) => `${item.title}: $${item.amount.toFixed(2)}`),
      });
      showToast(`Recordatorio enviado a ${debt.name} ✓`);
    } catch (err) {
      console.error(err);
      showToast('No se pudo enviar el recordatorio.', 'error');
    } finally {
      setRemindingId(null);
    }
  };

  const handlePayItem = async (expenseId: string) => {
    setPayingExpenseId(expenseId);
    try {
      await financesService.payShare(expenseId, dbUserId);
      showToast('Pago registrado ✓ Tu deuda se actualizó.');
      await loadDashboard();
    } catch (err) {
      console.error(err);
      showToast('No se pudo registrar el pago.', 'error');
    } finally {
      setPayingExpenseId(null);
    }
  };

  const watchedAmount = Number(watchExpense('amount')) || 0;
  const watchedParticipants = watchExpense('participantIds') || [];
  const previewShare =
    watchedAmount > 0 && watchedParticipants.length > 0
      ? watchedAmount / watchedParticipants.length
      : 0;

  const youOwe = data?.summary.youOwe ?? 0;
  const owedToYou = data?.summary.owedToYou ?? 0;
  const myShareTotal = data?.summary.myShareTotal ?? 0;

  // Disponible real = presupuesto menos la parte que me corresponde de los gastos
  const available = monthlyBudget - myShareTotal;

  const budgetDisplay = monthlyBudget > 0 ? `$${monthlyBudget.toFixed(2)}` : '---';
  const youOweDisplay = data ? `$${youOwe.toFixed(2)}` : '---';
  const owedToYouDisplay = data ? `$${owedToYou.toFixed(2)}` : '---';
  const availableDisplay =
    data && monthlyBudget > 0 ? `$${available.toFixed(2)}` : '---';

  const showSelector = myDepartments.length > 1;

  return (
    <div className="flex-1 flex flex-col p-8 bg-[#FDFBF9] relative h-full overflow-y-auto">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Mis Finanzas</h2>
        <button
          onClick={openAddExpense}
          disabled={!selectedDepartmentId || !sharedFinancesEnabled || !membersInfo}
          className="flex items-center gap-2 bg-[#8C3A27] text-white px-5 py-2.5 rounded-full font-bold shadow-sm hover:bg-[#7a3222] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} /> Añadir gasto
        </button>
      </header>

      {showAddExpense && (
        <ModalShell onClose={closeAddExpense}>
          <button
            onClick={closeAddExpense}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>

          <h3 className="text-xl font-extrabold text-gray-900 mb-1">Nuevo gasto</h3>
          <p className="text-gray-500 text-sm mb-6">
            Regístralo y elige entre quiénes se divide.
          </p>

          <form onSubmit={handleExpenseSubmit(onAddExpense)} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Receipt size={14} /> ¿Qué fue?
              </label>
              <input
                type="text"
                {...registerExpense('title')}
                placeholder="Internet, limpieza, mercado..."
                autoFocus
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30 focus:border-[#8C3A27] transition-all"
              />
              {expenseErrors.title && (
                <p className="mt-1 text-xs text-red-600">{expenseErrors.title.message}</p>
              )}
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
                  {...registerExpense('amount')}
                  placeholder="0.00"
                  className="w-full border border-gray-200 rounded-2xl pl-8 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#8C3A27]/30 focus:border-[#8C3A27] transition-all"
                />
              </div>
              {expenseErrors.amount && (
                <p className="mt-1 text-xs text-red-600">{expenseErrors.amount.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users size={14} /> ¿Quiénes están involucrados?
              </label>
              <div className="max-h-44 overflow-y-auto space-y-1.5 rounded-2xl border border-gray-200 p-3">
                {membersInfo?.members.map((member) => {
                  const isMe = member.user_id === dbUserId;
                  return (
                    <label
                      key={member.user_id}
                      className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={member.user_id}
                        {...registerExpense('participantIds')}
                        className="h-4 w-4 accent-[#8C3A27]"
                      />
                      <span className="flex-1">
                        {memberName(member.users?.email)}
                        {isMe && <span className="text-gray-400"> (tú)</span>}
                      </span>
                      {member.role === 'owner' && (
                        <span className="rounded-full bg-[#FDF0EB] px-2 py-0.5 text-[10px] font-bold text-[#8C3A27]">
                          Dueño
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
              <p className="mt-1 text-[11px] text-gray-400">
                Puedes desmarcarte a ti mismo si compraste algo solo para otros.
              </p>
              {expenseErrors.participantIds && (
                <p className="mt-1 text-xs text-red-600">
                  {expenseErrors.participantIds.message}
                </p>
              )}
              {previewShare > 0 && (
                <p className="mt-2 text-xs font-bold text-[#8C3A27]">
                  ${watchedAmount.toFixed(2)} ÷ {watchedParticipants.length}{' '}
                  {watchedParticipants.length === 1 ? 'persona' : 'personas'} = $
                  {previewShare.toFixed(2)} c/u
                </p>
              )}
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
                disabled={submittingExpense}
                className="flex-1 py-3 rounded-full font-bold text-white bg-[#8C3A27] hover:bg-[#7a3222] disabled:opacity-50 transition-colors"
              >
                {submittingExpense ? 'Guardando...' : 'Registrar gasto'}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      <div className={showSelector ? 'grid gap-6 lg:grid-cols-[1fr_300px]' : ''}>
        <div className="min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            <StatCard label="Presupuesto" value={budgetDisplay} />
            <StatCard label="Debes" value={youOweDisplay} tone="danger" />
            <StatCard label="Te deben" value={owedToYouDisplay} tone="success" />
            <StatCard label="Disponible Real" value={availableDisplay} tone="brand" />
          </div>

          {error && <AlertBanner>⚠️ {error}</AlertBanner>}

          {loading && !data && (
            <div className="text-center text-gray-500 mb-6">Sincronizando...</div>
          )}

          {selectedDepartmentId && membersInfo && !membersInfo.sharedFinancesEnabled && (
            <div className="bg-[#FFF8F0] border border-amber-200 rounded-[2rem] p-8 text-center mb-10">
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                Las finanzas compartidas aún no aplican
              </h3>
              <p className="text-gray-600 text-sm">
                Tu departamento tiene {membersInfo.count} miembro. La división de
                gastos se activa automáticamente cuando aceptes al menos un roomie
                (2+ miembros). Revisa tus{' '}
                <span className="font-bold text-[#8C3A27]">solicitudes de unión</span>{' '}
                para hacer crecer tu hogar.
              </p>
            </div>
          )}

          {profileLoaded && !selectedDepartmentId && !loading && (
            <div className="bg-white rounded-[2rem] border border-[#F2E3DB] p-10 text-center mb-10">
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                Aún no tienes un departamento vinculado
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Publica tu espacio o únete a un departamento para activar las
                finanzas compartidas con tus roomies.
              </p>
              <button
                onClick={() => navigate('/publish-department')}
                className="bg-[#8C3A27] text-white px-8 py-3 rounded-full font-bold hover:bg-[#7a3222] transition-colors"
              >
                Publicar mi departamento
              </button>
            </div>
          )}

          {membersInfo && membersInfo.members.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Miembros del departamento
              </h3>
              <div className="flex flex-wrap gap-2">
                {membersInfo.members.map((member) => (
                  <span
                    key={member.user_id}
                    className="rounded-full bg-white border border-[#F2E3DB] px-4 py-1.5 text-sm font-semibold text-gray-700"
                  >
                    {memberName(member.users?.email)}
                    {member.user_id === dbUserId && (
                      <span className="text-gray-400"> (tú)</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data && data.roommateDebts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {data.roommateDebts.map((debt) => (
                <RoommateDebtCard
                  key={debt.id}
                  data={debt}
                  remindBusy={remindingId === debt.id}
                  onRemind={() => handleRemind(debt)}
                  onDetails={() => setDetailRoomieId(debt.id)}
                />
              ))}
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Gastos del departamento
            </h3>
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

        {showSelector && (
          <DepartmentSelector
            spaces={myDepartments}
            selectedId={selectedDepartmentId}
            onSelect={setSelectedDepartmentId}
          />
        )}
      </div>

      {activeDebt && (
        <DebtDetailModal
          debt={activeDebt}
          onClose={() => setDetailRoomieId(null)}
          onPayItem={handlePayItem}
          payingExpenseId={payingExpenseId}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
};
