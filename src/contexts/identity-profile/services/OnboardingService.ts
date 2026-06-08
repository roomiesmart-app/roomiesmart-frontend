import api from './api';

export const OnboardingService = {
  loginTenant: async (credentials: any) => {
    const { data } = await api.post('/identity/login', credentials);
    return data;
  },

  registerTenant: async (payload: any) => {
    const { data } = await api.post('/identity/register', payload);
    return data;
  }
};