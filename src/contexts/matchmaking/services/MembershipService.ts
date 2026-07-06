import api from "../../identity-profile/services/api";

export interface JoinRequest {
  id: string;
  space_id: string;
  requester_id: string;
  message: string | null;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  created_at: string;
  spaces?: { id: string; title: string; owner_id: string };
  users?: { id: string; email: string };
}

export interface DepartmentMember {
  id: string;
  department_id: string;
  user_id: string;
  role: "owner" | "member";
  joined_at: string;
  users?: { id: string; email: string };
}

export interface DepartmentMembersInfo {
  members: DepartmentMember[];
  count: number;
  sharedFinancesEnabled: boolean;
}

export async function requestToJoin(
  spaceId: string,
  requesterId: string,
  message?: string,
): Promise<JoinRequest> {
  const response = await api.post(`/api/v1/roomies/spaces/${spaceId}/requests`, {
    requesterId,
    message,
  });
  return response.data;
}

export async function getPendingRequests(
  ownerId: string,
): Promise<JoinRequest[]> {
  const response = await api.get(
    `/api/v1/roomies/requests?ownerId=${encodeURIComponent(ownerId)}`,
  );
  return response.data?.data || [];
}

export async function resolveRequest(
  requestId: string,
  resolverId: string,
  action: "accept" | "reject",
): Promise<JoinRequest> {
  const response = await api.patch(`/api/v1/roomies/requests/${requestId}`, {
    resolverId,
    action,
  });
  return response.data;
}

export async function getDepartmentMembers(
  departmentId: string,
): Promise<DepartmentMembersInfo> {
  const response = await api.get(
    `/api/v1/roomies/departments/${departmentId}/members`,
  );
  return response.data;
}
