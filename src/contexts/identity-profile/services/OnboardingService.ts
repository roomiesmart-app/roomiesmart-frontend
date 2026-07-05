import api from './api';
import type{ OnboardingProfile } from '../models/Profile';

export const saveOnboardingProfile = async (profileData: OnboardingProfile) => {
  const response = await api.post('/api/v1/identity/onboarding', profileData);
  return response.data;
};

export const OnboardingService = {
  registerTenant: async (userData: any) => {
    const response = await api.post('/api/v1/identity/register', userData);
    return response.data;
  },

  loginTenant: async (credentials: any) => {
    const response = await api.post('/api/v1/identity/login', credentials);
    return response.data;
  },

  saveOnboardingProfile,
};

export default OnboardingService;