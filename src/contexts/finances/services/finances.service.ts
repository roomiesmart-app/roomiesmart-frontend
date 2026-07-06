import api from '../../identity-profile/services/api';

interface BackendExpense {
  id: string;
  departmentId: string;
  payerId: string;
  amount: number;
  description: string;
  expenseDate: string;
  payerDetails: {
    id: string;
    email: string;
  };
}

export const financesService = {
  getDashboardData: async (
    departmentId: string,
    currentUserId: string,
    totalRoomies: number = 4,
  ) => {
    try {
      const response = await api.get(`/api/expenses/${departmentId}`);

      const rawData: BackendExpense[] = response.data?.data || [];

      let houseTotal = 0;
      let youOwe = 0;
      let owedToYou = 0;

      
      const TOTAL_ROOMIES = Math.max(totalRoomies, 1);

      const transactions = rawData.map((expense) => {
        houseTotal += expense.amount;
        
        const splitAmount = expense.amount / TOTAL_ROOMIES;
        const isMe = expense.payerId === currentUserId;
        
        if (isMe) {
          owedToYou += (expense.amount - splitAmount);
        } else {
          youOwe += splitAmount;
        }

        const descLower = expense.description.toLowerCase();
        let type: 'shopping' | 'utilities' | 'cleaning' = 'shopping';
        
        if (descLower.includes('luz') || descLower.includes('agua') || descLower.includes('internet')) type = 'utilities';
        if (descLower.includes('limpieza')) type = 'cleaning';

        return {
          id: expense.id,
          title: expense.description,
          paidBy: isMe ? 'Ti' : expense.payerDetails?.email?.split('@')[0] || 'Roomie',
          sharedWithCount: TOTAL_ROOMIES,
          totalAmount: expense.amount,
          yourShare: isMe ? undefined : splitAmount,
          owedToYou: isMe ? (expense.amount - splitAmount) : undefined,
          type
        };
      });

      return {
        summary: { houseTotal, youOwe, owedToYou },
        transactions,
        roommateDebts: []
      };

    } catch (error) {
      throw error;
    }
  },

  addExpense: async (departmentId: string, payerId: string, amount: number, description: string) => {
    try {
      const payload = {
        departmentId,
        payerId,
        amount,
        description
      };

      const response = await api.post('/api/expenses', payload);
      return response.data;
      
    } catch (error) {
      throw error;
    }
  }
};