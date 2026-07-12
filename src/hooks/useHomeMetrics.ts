import { useQuery } from "@tanstack/react-query";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import api from "../contexts/identity-profile/services/api";
import { useRoomie } from "../contexts/roomie/RoomieContext";
import { matchmakingService } from "../contexts/matchmaking/services/matchmaking.services";
import { getDepartmentMembers } from "../contexts/matchmaking/services/MembershipService";
import { listMyDepartments } from "../contexts/matchmaking/services/PublishService";
import { financesService } from "../contexts/finances/services/finances.service";
import type { Transaction } from "../contexts/finances/models/finance.types";

export interface HomeMetrics {
  matchesCount: number | null;
  messagesCount: number | null;
  daysRemaining: number;
  // Balance neto pendiente: te deben − debes (null hasta cargar finanzas)
  balance: number | null;
  latestTransactions: Transaction[];
  hasDepartment: boolean;
}

export function useHomeMetrics(): HomeMetrics {
  const { user } = useKindeAuth();
  const { ownerId, departmentId: publishedDepartmentId } = useRoomie();

  const profileQuery = useQuery({
    queryKey: ["identity", "me"],
    queryFn: async () => (await api.get("/api/v1/identity/me")).data?.data,
    staleTime: 60_000,
  });

  const userId: string = profileQuery.data?.id || ownerId || "";

  // Departamentos donde soy dueño o miembro (mismo criterio que Finanzas)
  const myDepartmentsQuery = useQuery({
    queryKey: ["my-departments", userId],
    queryFn: () => listMyDepartments(userId),
    enabled: Boolean(userId),
    staleTime: 60_000,
  });
  const myDepartments = myDepartmentsQuery.data ?? [];

  const departmentId: string =
    (myDepartments.some((d) => d.id === publishedDepartmentId)
      ? publishedDepartmentId
      : "") ||
    myDepartments[0]?.id ||
    profileQuery.data?.departmentId ||
    publishedDepartmentId ||
    "";

  const authIdentifier = user?.email || user?.id || "";
  const matchesQuery = useQuery({
    queryKey: ["matches", "count", authIdentifier],
    queryFn: async () => {
      const result = await matchmakingService.getMatches(authIdentifier, {});
      if (Array.isArray(result)) return result.length;
      return Array.isArray(result?.data) ? result.data.length : 0;
    },
    enabled: Boolean(authIdentifier),
    staleTime: 5 * 60_000,
  });

  const conversationsQuery = useQuery({
    queryKey: ["conversations", "count", ownerId],
    queryFn: async () => {
      const response = await api.get(
        `/api/v1/roomies/conversations/user/${ownerId}`,
      );
      return (response.data?.data || []).length as number;
    },
    enabled: Boolean(ownerId),
    staleTime: 60_000,
  });

  const membersQuery = useQuery({
    queryKey: ["department-members", departmentId],
    queryFn: () => getDepartmentMembers(departmentId),
    enabled: Boolean(departmentId),
    staleTime: 60_000,
  });

  const financeQuery = useQuery({
    queryKey: ["finance-dashboard", departmentId, userId],
    queryFn: () =>
      financesService.getDashboardData(
        departmentId,
        userId,
        (membersQuery.data?.members ?? []).map((member) => ({
          id: member.user_id,
          email: member.users?.email,
        })),
      ),
    enabled: Boolean(departmentId && userId && membersQuery.data),
    staleTime: 30_000,
  });

  const now = new Date();
  const lastDayOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();
  const daysRemaining = lastDayOfMonth - now.getDate();

  const balance = financeQuery.data
    ? financeQuery.data.summary.owedToYou - financeQuery.data.summary.youOwe
    : departmentId
      ? null
      : 0;

  return {
    matchesCount: matchesQuery.data ?? null,
    messagesCount: conversationsQuery.data ?? null,
    daysRemaining,
    balance,
    latestTransactions: financeQuery.data?.transactions.slice(0, 2) ?? [],
    hasDepartment: Boolean(departmentId),
  };
}
