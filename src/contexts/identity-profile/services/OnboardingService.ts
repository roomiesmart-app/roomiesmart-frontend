import api from './api';

export const OnboardingService = {
  registerTenant: async (userData: any) => {
    const response = await api.post('/api/v1/identity/register', userData);
    return response.data;
  },

  loginTenant: async (credentials: any) => {
    const response = await api.post('/api/v1/identity/login', credentials);
    return response.data;
  }
};