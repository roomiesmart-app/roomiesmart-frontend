import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { ModalShell } from '../../../shared/components/ui/ModalShell';
import type { RoommateDebt } from '../models/finance.types';

interface DebtDetailModalProps {
  debt: RoommateDebt;
  onClose: () => void;

  // Marca como pagada mi parte de un gasto (solo aplica a items 'i_owe')
  onPayItem?: (expenseId: string) => void;
  payingExpenseId?: string | null;
}

export const DebtDetailModal: React.FC<DebtDetailModalProps> = ({
  debt,
  onClose,
  onPayItem,
  payingExpenseId,
}) => {
  const isOwed = debt.type === 'owes_you';

  return (
    <ModalShell onClose={onClose}>
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors"
      >
        <X size={20} />
      </button>

      <div className="flex items-center gap-4 mb-6">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(debt.avatarSeed)}`}
          alt={debt.name}
          className="w-14 h-14 rounded-full bg-gray-100"
        />
        <div>
          <h3 className="text-xl font-extrabold text-gray-900">{debt.name}</h3>
          <p
            className={`text-sm font-bold ${isOwed ? 'text-[#059669]' : 'text-[#DC2626]'}`}
          >
            {isOwed
              ? `Te debe $${debt.amount.toFixed(2)} en total`
              : `Le debes $${debt.amount.toFixed(2)} en total`}
          </p>
        </div>
      </div>

      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
        Desglose de la deuda
      </p>
      <div className="max-h-72 overflow-y-auto space-y-2">
        {debt.breakdown.map((item) => {
          const iOwe = item.kind === 'i_owe';
          return (
            <div
              key={`${item.expenseId}-${item.kind}`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-[#F2E3DB] bg-[#FDF8F6] px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">
                  {item.title}
                </p>
                <p
                  className={`text-xs font-bold ${iOwe ? 'text-[#DC2626]' : 'text-[#059669]'}`}
                >
                  {iOwe ? 'Le debes' : 'Te debe'} ${item.amount.toFixed(2)}
                </p>
              </div>
              {iOwe && onPayItem && (
                <button
                  onClick={() => onPayItem(item.expenseId)}
                  disabled={payingExpenseId === item.expenseId}
                  className="shrink-0 flex items-center gap-1.5 rounded-full bg-[#8C3A27] px-4 py-2 text-xs font-bold text-white hover:bg-[#7a3222] transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 size={14} />
                  {payingExpenseId === item.expenseId
                    ? 'Registrando...'
                    : 'Marcar como pagado'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {isOwed && (
        <p className="mt-4 text-xs text-gray-400">
          Cuando {debt.name} marque sus partes como pagadas, esta deuda se
          actualizará automáticamente.
        </p>
      )}
    </ModalShell>
  );
};
