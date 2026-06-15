import { useMutation } from '@tanstack/react-query';
import { OnboardingService } from '../contexts/identity-profile/services/OnboardingService.js';

export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: any) => {
      return await OnboardingService.registerTenant(userData);
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: any) => {
      return await OnboardingService.loginTenant(credentials);
    },
  });
};