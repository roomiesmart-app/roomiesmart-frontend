import api from '../../identity-profile/services/api';
import { computeFinanceSummary } from '../../../wasm/financesWasm';
import type { RoommateDebt, Transaction } from '../models/finance.types';

interface BackendExpense {
  id: string;
  departmentId: string;
  payerId: string;
  amount: number;
  description: string;
  participants?: string[] | null;
  expenseDate: string;
  payerDetails: {
    id: string;
    email: string;
  };
}

export interface DashboardMember {
  id: string;
  email?: string;
}

export interface FinanceDashboardData {
  summary: {
    houseTotal: number;
    youOwe: number;
    owedToYou: number;
    myShareTotal: number;
  };
  transactions: Transaction[];
  roommateDebts: RoommateDebt[];
}

const detectType = (description: string): Transaction['type'] => {
  const desc = description.toLowerCase();
  if (desc.includes('luz') || desc.includes('agua') || desc.includes('internet'))
    return 'utilities';
  if (desc.includes('limpieza')) return 'cleaning';
  return 'shopping';
};

const nameFromEmail = (email?: string) => email?.split('@')[0] || 'Roomie';

export const financesService = {
  getDashboardData: async (
    departmentId: string,
    currentUserId: string,
    members: DashboardMember[],
  ): Promise<FinanceDashboardData> => {
    const response = await api.get(`/api/expenses/${departmentId}`);
    const rawData: BackendExpense[] = response.data?.data || [];

    const allMemberIds = members.map((m) => m.id);

    // Gastos antiguos sin participantes registrados se dividen entre todos
    const participantsOf = (expense: BackendExpense): string[] =>
      expense.participants?.length
        ? expense.participants
        : allMemberIds.length > 0
          ? allMemberIds
          : [expense.payerId];

    const { youOwe, owedToYou, houseTotal, myShareTotal, shares } =
      await computeFinanceSummary(
        rawData.map((expense) => {
          const participants = participantsOf(expense);
          return {
            amount: expense.amount,
            paidByMe: expense.payerId === currentUserId,
            participantCount: participants.length,
            iParticipate: participants.includes(currentUserId),
          };
        }),
      );

    // Balance neto con cada roomie: positivo = me debe, negativo = le debo
    const netByRoomie = new Map<string, number>();
    const emailById = new Map<string, string | undefined>(
      members.map((m) => [m.id, m.email]),
    );

    const transactions: Transaction[] = rawData.map((expense, index) => {
      const participants = participantsOf(expense);
      const share = shares[index];
      const isMe = expense.payerId === currentUserId;
      const iParticipate = participants.includes(currentUserId);

      if (isMe) {
        for (const participantId of participants) {
          if (participantId === currentUserId) continue;
          netByRoomie.set(
            participantId,
            (netByRoomie.get(participantId) ?? 0) + share,
          );
        }
      } else if (iParticipate) {
        netByRoomie.set(
          expense.payerId,
          (netByRoomie.get(expense.payerId) ?? 0) - share,
        );
        if (!emailById.has(expense.payerId)) {
          emailById.set(expense.payerId, expense.payerDetails?.email);
        }
      }

      return {
        id: expense.id,
        title: expense.description,
        paidBy: isMe ? 'Ti' : nameFromEmail(expense.payerDetails?.email),
        sharedWithCount: participants.length,
        totalAmount: expense.amount,
        yourShare: !isMe && iParticipate ? share : undefined,
        owedToYou: isMe
          ? expense.amount - (iParticipate ? share : 0)
          : undefined,
        type: detectType(expense.description),
      };
    });

    const roommateDebts: RoommateDebt[] = [...netByRoomie.entries()]
      .filter(([, net]) => Math.abs(net) > 0.005)
      .map(([roomieId, net]) => ({
        id: roomieId,
        name: nameFromEmail(emailById.get(roomieId)),
        avatarSeed: emailById.get(roomieId) || roomieId,
        amount: Math.abs(net),
        type: net > 0 ? ('owes_you' as const) : ('you_owe' as const),
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      summary: { houseTotal, youOwe, owedToYou, myShareTotal },
      transactions,
      roommateDebts,
    };
  },

  addExpense: async (
    departmentId: string,
    payerId: string,
    amount: number,
    description: string,
    participants: string[],
  ) => {
    const response = await api.post('/api/expenses', {
      departmentId,
      payerId,
      amount,
      description,
      participants,
    });
    return response.data;
  },
};
