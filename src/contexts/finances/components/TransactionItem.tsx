import React from 'react';
import { Receipt, ShoppingCart, Zap, CheckCircle2 } from 'lucide-react';
import type { Transaction } from '../models/finance.types';

interface Props {
  transaction: Transaction;
}

export const TransactionItem: React.FC<Props> = ({ transaction }) => {
  const getIcon = () => {
    switch (transaction.type) {
      case 'utilities': return <Zap className="text-yellow-600" />;
      case 'cleaning': return <Receipt className="text-blue-600" />;
      default: return <ShoppingCart className="text-[#8C3A27]" />;
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#F2E3DB] flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gray-50 rounded-full">
          {getIcon()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-gray-900">{transaction.title}</h4>
            {transaction.isPaid ? (
              <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-bold text-green-700">
                <CheckCircle2 size={12} /> Pagado
              </span>
            ) : transaction.paidDebtors > 0 ? (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                {transaction.paidDebtors}/{transaction.totalDebtors} pagado
              </span>
            ) : null}
          </div>
          <p className="text-xs text-gray-500 font-medium">Pagado por {transaction.paidBy}</p>
        </div>
      </div>

      <div className="text-right">
        <p className="font-bold text-gray-900">${transaction.totalAmount.toFixed(2)}</p>
        {transaction.yourShare !== undefined && (
          transaction.yourSharePaid ? (
            <p className="text-xs text-green-600 font-bold">
              Tu parte: ${transaction.yourShare.toFixed(2)} ✓ pagada
            </p>
          ) : (
            <p className="text-xs text-red-500 font-bold">
              Tu parte: ${transaction.yourShare.toFixed(2)}
            </p>
          )
        )}
      </div>
    </div>
  );
};
