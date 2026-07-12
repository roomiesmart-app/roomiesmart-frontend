export interface Transaction {
  id: string;
  title: string;
  paidBy: string;
  sharedWithCount: number;
  totalAmount: number;
  yourShare?: number;
  yourSharePaid?: boolean;
  owedToYou?: number;
  // Estado de pago del gasto completo
  isPaid: boolean;
  paidDebtors: number;
  totalDebtors: number;
  type: 'shopping' | 'utilities' | 'cleaning';
}

export interface DebtBreakdownItem {
  expenseId: string;
  title: string;
  amount: number;
  // 'they_owe' = ese roomie me debe esta parte; 'i_owe' = yo le debo esta parte
  kind: 'they_owe' | 'i_owe';
}

export interface RoommateDebt {
  id: string;
  name: string;
  avatarSeed: string;
  amount: number;
  type: 'owes_you' | 'you_owe';
  breakdown: DebtBreakdownItem[];
}
