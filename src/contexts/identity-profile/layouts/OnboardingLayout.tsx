import { useLocation, Outlet } from 'react-router-dom';
import logoRoomie from '../../../assets/RoomieSmart.png';

export default function OnboardingLayout() {
  const location = useLocation();

  let step = 1;
  if (location.pathname.includes('step-2')) step = 2;
  else if (location.pathname.includes('step-3')) step = 3;
  else if (location.pathname.includes('step-4')) step = 4;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#FCF7F6] to-[#FDECE8] p-4 sm:p-8 font-manrope">
      <header className="max-w-6xl mx-auto w-full flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <img src={logoRoomie} alt="Logo RoomieSmart" className="h-8 w-auto object-contain" />
          <span className="font-bold text-xl text-primary">RoomieSmart</span>
        </div>
        <div className="text-sm font-bold text-neutral">Paso {step} de 4</div>
      </header>

      <Outlet />
    </div>
  );
}