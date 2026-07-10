export interface Transaction {
  id: string;
  title: string;
  paidBy: string;
  sharedWithCount: number;
  totalAmount: number;
  yourShare?: number; 
  owedToYou?: number; 
  type: 'shopping' | 'utilities' | 'cleaning';
}

export interface RoommateDebt {
  id: string;
  name: string;
  avatarSeed: string;
  amount: number;
  type: 'owes_you' | 'you_owe';
}