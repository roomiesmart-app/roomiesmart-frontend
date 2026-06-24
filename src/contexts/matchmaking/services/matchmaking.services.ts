import api from '../../../contexts/identity-profile/services/api';
import type{ MatchmakingResponse } from '../types/matchmaking.types';

export const matchmakingService = {
  getMatches: async (userId: string): Promise<MatchmakingResponse[]> => {
    const { data } = await api.get(`/api/v1/identity/matchmaking-profiles?userId=${userId}`);
    return data;
  }
};