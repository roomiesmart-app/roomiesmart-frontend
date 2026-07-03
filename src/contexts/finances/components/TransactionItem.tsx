import React from 'react';
import { ShoppingCart, Zap, User } from 'lucide-react';
import type { Transaction } from '../models/finance.types';

interface Props {
  transaction: Transaction;
}

export const TransactionItem: React.FC<Props> = ({ transaction }) => {
  const getIcon = () => {
    switch (transaction.type) {
      case 'shopping': return <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center"><ShoppingCart size={24} /></div>;
      case 'utilities': return <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center"><Zap size={24} /></div>;
      case 'cleaning': return <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center"><User size={24} /></div>;
    }
  };

  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#F2E3DB] flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center gap-4">
        {getIcon()}
        <div>
          <h4 className="font-bold text-gray-900">{transaction.title}</h4>
          <p className="text-sm text-gray-500">Pagado por {transaction.paidBy} • Compartido con {transaction.sharedWithCount}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-extrabold text-gray-900">${transaction.totalAmount.toFixed(2)}</p>
        {transaction.yourShare && (
          <p className="text-sm font-bold text-[#DC2626]">Tu parte: ${transaction.yourShare.toFixed(2)}</p>
        )}
        {transaction.owedToYou && (
          <p className="text-sm font-bold text-[#059669]">Te deben: ${transaction.owedToYou.toFixed(2)}</p>
        )}
      </div>
    </div>
  );
};