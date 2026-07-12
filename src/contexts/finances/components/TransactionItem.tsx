import React from 'react';
import { Receipt, ShoppingCart, Zap } from 'lucide-react';
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
          <h4 className="font-bold text-gray-900">{transaction.title}</h4>
          <p className="text-xs text-gray-500 font-medium">Pagado por {transaction.paidBy}</p>
        </div>
      </div>

      <div className="text-right">
        <p className="font-bold text-gray-900">${transaction.totalAmount.toFixed(2)}</p>
        {transaction.yourShare && (
          <p className="text-xs text-red-500 font-bold">Tu parte: ${transaction.yourShare.toFixed(2)}</p>
        )}
      </div>
    </div>
  );
};