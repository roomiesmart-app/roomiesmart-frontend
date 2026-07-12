import api from '../../../contexts/identity-profile/services/api';
import type { MatchmakingFilters } from '../types/matchmaking.types';

export const matchmakingService = {

  getMatches: async (userIdOrEmail: string, filters: MatchmakingFilters = {}) => {
    const { data } = await api.post(`/api/v1/identity/matchmaking-profiles`, {
      userId: userIdOrEmail,
      filters
    });
    return data;
  }
};