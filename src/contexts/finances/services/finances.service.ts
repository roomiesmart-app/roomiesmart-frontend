import api from '../../identity-profile/services/api';
import { computeFinanceSummary } from '../../../wasm/financesWasm';
import type {
  DebtBreakdownItem,
  RoommateDebt,
  Transaction,
} from '../models/finance.types';

interface BackendPayment {
  userId: string;
  amount: number | null;
  paidAt: string;
}

interface BackendExpense {
  id: string;
  departmentId: string;
  payerId: string;
  amount: number;
  description: string;
  participants?: string[] | null;
  payments?: BackendPayment[];
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

    const paidSetOf = (expense: BackendExpense): Set<string> =>
      new Set((expense.payments ?? []).map((p) => p.userId));

    const { youOwe, owedToYou, houseTotal, myShareTotal, shares } =
      await computeFinanceSummary(
        rawData.map((expense) => {
          const participants = participantsOf(expense);
          const paidSet = paidSetOf(expense);
          return {
            amount: expense.amount,
            paidByMe: expense.payerId === currentUserId,
            participantCount: participants.length,
            iParticipate: participants.includes(currentUserId),
            iHavePaid: paidSet.has(currentUserId),
            unpaidOthersCount: participants.filter(
              (id) => id !== expense.payerId && !paidSet.has(id),
            ).length,
          };
        }),
      );

    // Balance neto (solo partes NO pagadas) con cada roomie: positivo = me debe
    const netByRoomie = new Map<
      string,
      { net: number; items: DebtBreakdownItem[] }
    >();
    const emailById = new Map<string, string | undefined>(
      members.map((m) => [m.id, m.email]),
    );

    const entryFor = (roomieId: string) => {
      let entry = netByRoomie.get(roomieId);
      if (!entry) {
        entry = { net: 0, items: [] };
        netByRoomie.set(roomieId, entry);
      }
      return entry;
    };

    const transactions: Transaction[] = rawData.map((expense, index) => {
      const participants = participantsOf(expense);
      const paidSet = paidSetOf(expense);
      const share = shares[index];
      const isMe = expense.payerId === currentUserId;
      const iParticipate = participants.includes(currentUserId);
      const iHavePaid = paidSet.has(currentUserId);

      const debtors = participants.filter((id) => id !== expense.payerId);
      const paidDebtors = debtors.filter((id) => paidSet.has(id)).length;
      const isPaid = paidDebtors === debtors.length;

      if (isMe) {
        for (const participantId of debtors) {
          if (paidSet.has(participantId)) continue;
          const entry = entryFor(participantId);
          entry.net += share;
          entry.items.push({
            expenseId: expense.id,
            title: expense.description,
            amount: share,
            kind: 'they_owe',
          });
        }
      } else if (iParticipate && !iHavePaid) {
        const entry = entryFor(expense.payerId);
        entry.net -= share;
        entry.items.push({
          expenseId: expense.id,
          title: expense.description,
          amount: share,
          kind: 'i_owe',
        });
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
        yourSharePaid: !isMe && iParticipate ? iHavePaid : undefined,
        owedToYou: isMe
          ? share * debtors.filter((id) => !paidSet.has(id)).length
          : undefined,
        isPaid,
        paidDebtors,
        totalDebtors: debtors.length,
        type: detectType(expense.description),
      };
    });

    const roommateDebts: RoommateDebt[] = [...netByRoomie.entries()]
      .filter(([, entry]) => Math.abs(entry.net) > 0.005)
      .map(([roomieId, entry]) => ({
        id: roomieId,
        name: nameFromEmail(emailById.get(roomieId)),
        avatarSeed: emailById.get(roomieId) || roomieId,
        amount: Math.abs(entry.net),
        type: entry.net > 0 ? ('owes_you' as const) : ('you_owe' as const),
        breakdown: entry.items,
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

  payShare: async (expenseId: string, userId: string) => {
    const response = await api.post(`/api/expenses/${expenseId}/payments`, {
      userId,
    });
    return response.data;
  },

  sendReminder: async (payload: {
    debtorId: string;
    creditorName: string;
    amount: number;
    items?: string[];
  }) => {
    const response = await api.post('/api/expenses/reminders', payload);
    return response.data;
  },
};
