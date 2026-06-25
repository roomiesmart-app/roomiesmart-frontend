import { useEffect, type ReactNode } from 'react';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import api from '../../contexts/identity-profile/services/api';

export const AxiosInterceptor = ({ children }: { children: ReactNode }) => {
  const { getToken } = useKindeAuth();

  useEffect(() => {
    const interceptor = api.interceptors.request.use(
      async (config) => {
        const token = await getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [getToken]);

  return <>{children}</>;
};