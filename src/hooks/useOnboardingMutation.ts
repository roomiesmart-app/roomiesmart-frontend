import { useMutation } from '@tanstack/react-query';
import { OnboardingService } from '../contexts/identity-profile/services/OnboardingService';

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: any) => OnboardingService.loginTenant(credentials),
  });
};