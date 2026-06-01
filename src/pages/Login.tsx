import { Link } from 'react-router-dom';

export default function Login() {
  return (
    // Fondo: Por ahora le pongo un degradado suave similar a la imagen de fondo de tu Figma
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-[#E6EEF9] via-white to-[#FDECE8] p-4">
      
      {/* Tarjeta Blanca Principal */}
      <div className="w-full max-w-[420px] rounded-[32px] bg-white px-8 py-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        
        {/* Logo y Encabezado */}
        <div className="mb-8 text-center">
          {/* Aquí luego reemplazarás este div por la etiqueta <img src={logo} /> */}
          <div className="mx-auto mb-3 h-12 w-12 bg-gray-200"></div> 
          <h1 className="text-xl font-bold text-secondary">RoomieSmart</h1>
          <p className="mt-2 text-sm text-neutral">
            Tu próximo hogar compartido<br/>comienza aquí.
          </p>
        </div>

        {/* Formulario */}
        <form className="space-y-5">
          {/* Campo Correo */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-neutral">
              Correo electrónico
            </label>
            <div className="relative">
              {/* Ícono de sobre (Placeholder SVGs) */}
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                placeholder="alex@universidad.edu"
                className="w-full rounded-2xl border border-gray-200 bg-transparent py-3.5 pl-11 pr-4 text-sm text-secondary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Campo Contraseña */}
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
              {/* Ícono de candado (Placeholder SVGs) */}
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-2xl border border-gray-200 bg-transparent py-3.5 pl-11 pr-4 text-sm text-secondary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-center pt-1">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral">
              <input 
                type="checkbox" 
                className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary" 
              />
              Recordarme
            </label>
          </div>

          {/* Botón Principal */}
          <button
            type="button"
            className="mt-2 w-full rounded-2xl bg-primary py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-[#a3513d] active:scale-[0.98]"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Separador */}
        <div className="my-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-100"></div>
          <span className="text-xs font-medium text-gray-400">O continúa con</span>
          <div className="h-px flex-1 bg-gray-100"></div>
        </div>

        {/* Botones Sociales */}
        <div className="flex gap-4">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-secondary transition-all hover:bg-gray-50">
            <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-secondary transition-all hover:bg-gray-50">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.58-.79 2.12-.04 3.44.88 4.32 2.2-3.81 2.02-3.04 6.74.74 8.04-.77 1.83-2.18 3.53-3.72 2.72zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
            Apple
          </button>
        </div>

        {/* Link al Registro */}
        <p className="mt-8 text-center text-sm font-medium text-neutral">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="font-bold text-primary hover:underline">
            Regístrate gratis
          </Link>
        </p>

      </div>
    </div>
  );
}