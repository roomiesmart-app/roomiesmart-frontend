import React from 'react';
import type { RoommateDebt } from '../models/finance.types';

interface Props {
  data: RoommateDebt;
  onRemind?: () => void;
  onDetails?: () => void;
  remindBusy?: boolean;
}

export const RoommateDebtCard: React.FC<Props> = ({
  data,
  onRemind,
  onDetails,
  remindBusy = false,
}) => {
  const isOwed = data.type === 'owes_you';

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#F2E3DB]">
      <div className="flex items-center gap-4 mb-4">
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.avatarSeed}`} alt={data.name} className="w-14 h-14 rounded-full bg-gray-100" />
        <div>
          <h4 className="font-bold text-gray-900">{data.name}</h4>
          <p className={`text-sm font-bold ${isOwed ? 'text-[#059669]' : 'text-[#DC2626]'}`}>
            {isOwed ? `Te debe $${data.amount.toFixed(2)}` : `Debes $${data.amount.toFixed(2)}`}
          </p>
        </div>
      </div>

      {isOwed ? (
        <div className="flex gap-2">
          <button
            onClick={onRemind}
            disabled={remindBusy}
            className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {remindBusy ? 'Enviando...' : 'Recordar'}
          </button>
          <button
            onClick={onDetails}
            className="flex-1 bg-[#E0E7FF] text-[#4338CA] py-2 rounded-full text-sm font-bold hover:bg-[#C7D2FE] transition-colors"
          >
            Detalles
          </button>
        </div>
      ) : (
        <button
          onClick={onDetails}
          className="w-full bg-[#8C3A27] text-white py-2 rounded-full text-sm font-bold hover:bg-[#7a3222] transition-colors"
        >
          Liquidar deuda
        </button>
      )}
    </div>
  );
};
