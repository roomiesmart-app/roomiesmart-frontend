import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ONBOARDING_ROUTES } from '../../../app/routes/constant';
import { useLogin } from '../../../hooks/useOnboardingMutation';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(formData, {
      onSuccess: (data) => {
        if (data.token) localStorage.setItem('jwt', data.token);
        navigate('/dashboard');
      },
      onError: (err) => console.error("Error al loguear:", err)
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-[#E6EEF9] via-white to-[#FDECE8] p-4 font-manrope">
      <div className="w-full max-w-[420px] rounded-[32px] bg-white px-8 py-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 h-12 w-12 bg-gray-200"></div>
          <h1 className="text-xl font-bold text-secondary">RoomieSmart</h1>
          <p className="mt-2 text-sm text-neutral">
            Tu próximo hogar compartido<br />comienza aquí.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-neutral">
              Correo electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                required
                placeholder="eflarrea@uce.edu.ec"
                className="w-full rounded-2xl border border-gray-200 bg-transparent py-3.5 pl-11 pr-4 text-sm text-secondary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral">
                Contraseña
              </label>
              <a href="#" className="text-xs font-semibold text-primary hover:underline">
                Recuperar contraseña
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-2xl border border-gray-200 bg-transparent py-3.5 pl-11 pr-4 text-sm text-secondary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center pt-1">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral">
              <input type="checkbox" className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary" />
              Recordarme
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full rounded-2xl bg-primary py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-[#a3513d] active:scale-[0.98] disabled:opacity-50"
          >
            {isPending ? 'Cargando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-neutral">
          ¿No tienes una cuenta?{' '}
          <Link to={ONBOARDING_ROUTES.IDENTITY} className="font-bold text-primary hover:underline">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
}