import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import api from '../../contexts/identity-profile/services/api';

export const AuthDispatcher = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'checking' | 'error'>('checking');

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!isLoaded) return;
      
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const email = user.primaryEmailAddress?.emailAddress;
        const response = await api.get(`/api/v1/identity/check-status/${email}`);
        
        if (response.data.exists) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/onboarding/step-1', { replace: true });
        }
      } catch (err) {
        setStatus('error');
      }
    };

    checkUserStatus();
  }, [isLoaded, user, navigate]);

  if (status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Servidor no disponible</h1>
        <p className="text-gray-600 mb-6">No pudimos verificar tu estado en la base de datos. Por seguridad, el registro está bloqueado.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-all"
        >
          Reintentar conexión
        </button>
      </div>
    );
  }

  return null;
};