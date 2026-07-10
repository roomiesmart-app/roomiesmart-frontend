import React from 'react';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { LayoutDashboard, Users, Receipt, Home, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/RoomieSmart.png';

interface Props {
  children: React.ReactNode;
}

export const MainLayout: React.FC<Props> = ({ children }) => {
  const { user, logout } = useKindeAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fullName = user ? `${user.givenName || ''} ${user.familyName || ''}`.trim() : 'Estudiante';
  const universityInfo = 'Universidad Central del Ecuador';

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="flex min-h-screen bg-[#FDFBF9] font-sans text-gray-800">
      <aside className="w-64 bg-[#FDFBF9] border-r border-[#F2E3DB] flex flex-col justify-between py-6 px-4 shrink-0">
        <div>
          <div className="flex items-center gap-3 px-2 mb-10">
            <img src={logo} alt="RoomieSmart Logo" className="w-10 h-10 object-contain" />
            <h1 className="text-[#8C3A27] text-xl font-extrabold tracking-tight">RoomieSmart</h1>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 mb-8 bg-[#FDF0EB] rounded-2xl">
            <img 
              src={user?.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full bg-white object-cover" 
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{fullName}</p>
              <p className="text-xs text-gray-500 truncate">{universityInfo}</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button onClick={() => navigate('/dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${isActive('/dashboard') ? 'bg-[#8C3A27] text-white shadow-md' : 'text-gray-500 hover:text-[#8C3A27] hover:bg-[#FDF0EB]'}`}>
              <LayoutDashboard size={20} /> Inicio
            </button>
            <button onClick={() => navigate('/matchmaking')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${isActive('/matchmaking') ? 'bg-[#8C3A27] text-white shadow-md' : 'text-gray-500 hover:text-[#8C3A27] hover:bg-[#FDF0EB]'}`}>
              <Users size={20} /> Matchmaking
            </button>
            <button onClick={() => navigate('/finanzas')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${isActive('/finanzas') ? 'bg-[#8C3A27] text-white shadow-md' : 'text-gray-500 hover:text-[#8C3A27] hover:bg-[#FDF0EB]'}`}>
              <Receipt size={20} /> Finanzas
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-[#8C3A27] hover:bg-[#FDF0EB] rounded-xl transition-colors font-medium">
              <Home size={20} /> Mi Espacio
            </button>
          </nav>
        </div>

        <div>
          <button className="w-full flex items-center justify-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-red-600 transition-colors" onClick={() => logout()}>
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};