import React, { useState } from 'react';
import type { MatchmakingFilters } from '../types/matchmaking.types';

interface FilterSidebarProps {
  onFiltersChange: (filters: MatchmakingFilters) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFiltersChange }) => {
  const [budget, setBudget] = useState<number>(200);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [musicGenres, setMusicGenres] = useState<string[]>([]);
  const [smoking, setSmoking] = useState<string>('');
  const [cleaning, setCleaning] = useState<string>('');

  const hobbiesOptions = ['Cocina', 'Gaming', 'Ejercicio', 'Fotografía', 'Lectura', 'Viajar', 'Yoga', 'Arte', 'Senderismo'];
  const musicOptions = ['Rap', 'Rock', 'Electronic', 'Reggaeton', 'Indie', 'Salsa', 'K-Pop', 'Jazz', 'Clásica'];

  // CORRECCIÓN: Se eliminó el parámetro 'list' que no se usaba
  const toggleSelection = (item: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const getFilters = (): MatchmakingFilters => ({
    maxBudget: budget,
    hobbies,
    musicGenres,
    smokingPreference: smoking as any,
    cleaningFrequency: cleaning as any
  });

  React.useEffect(() => {
    onFiltersChange(getFilters());
  }, [budget, hobbies, musicGenres, smoking, cleaning]);

  return (
    <aside className="w-full space-y-6 bg-white p-6 border border-gray-100 rounded-2xl shadow-sm">
      <div>
        <label className="text-xs font-bold uppercase text-gray-500">Presupuesto: ${budget}</label>
        <input type="range" min="100" max="500" step="50" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full accent-[#8C3A27]" />
      </div>
      <div>
        <label className="text-xs font-bold uppercase text-gray-500">Tabaco / Vape</label>
        <select onChange={(e) => setSmoking(e.target.value)} className="w-full p-2 border rounded-lg text-sm">
          <option value="">Selecciona...</option>
          <option value="fumo">Fumador</option>
          <option value="no-fumo">No fuma dentro</option>
          <option value="no-tolero">No tolero el humo</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-bold uppercase text-gray-500">Limpieza</label>
        <select onChange={(e) => setCleaning(e.target.value)} className="w-full p-2 border rounded-lg text-sm">
          <option value="">Selecciona...</option>
          <option value="diaria">Diaria</option>
          <option value="2-3 veces">2-3 veces por semana</option>
          <option value="semanal">Semanal</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-bold uppercase text-gray-500">Hobbies</label>
        <div className="flex flex-wrap gap-1">
          {hobbiesOptions.map(h => (
            {/* CORRECCIÓN: Ahora solo envía 'h' y el 'setHobbies' */}
            <button key={h} onClick={() => toggleSelection(h, setHobbies)} className={`px-2 py-1 rounded text-[10px] ${hobbies.includes(h) ? 'bg-[#8C3A27] text-white' : 'bg-gray-100'}`}>{h}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs font-bold uppercase text-gray-500">Géneros Musicales</label>
        <div className="flex flex-wrap gap-1">
          {musicOptions.map(m => (
            {/* CORRECCIÓN: Ahora solo envía 'm' y el 'setMusicGenres' */}
            <button key={m} onClick={() => toggleSelection(m, setMusicGenres)} className={`px-2 py-1 rounded text-[10px] ${musicGenres.includes(m) ? 'bg-[#8C3A27] text-white' : 'bg-gray-100'}`}>{m}</button>
          ))}
        </div>
      </div >
    </aside >
  );
};