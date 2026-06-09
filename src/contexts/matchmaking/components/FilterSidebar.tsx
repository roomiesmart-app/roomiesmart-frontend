import React, { useState } from 'react';

export const FilterSidebar: React.FC = () => {
  const [budget, setBudget] = useState<number>(150);
  const [habits, setHabits] = useState<string[]>(['Madrugador']);
  const [pets, setPets] = useState<string>('');

  const toggleHabit = (habit: string) => {
    setHabits(prev => prev.includes(habit) ? prev.filter(h => h !== habit) : [...prev, habit]);
  };

  const clearFilters = () => {
    setBudget(150);
    setHabits([]);
    setPets('');
  };

  return (
    <aside className="w-72 flex-shrink-0">
      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-3">Ubicación</h3>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="¿A dónde vas?" 
            className="w-full bg-[#FFF5F0] border border-[#F2E3DB] rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#8C3A27]"
          />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase">Presupuesto Máximo</h3>
          <span className="text-sm font-bold text-[#8C3A27]">${budget}</span>
        </div>
        <input 
          type="range" 
          min="100" 
          max="300" 
          step="10"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full h-1.5 bg-[#F2E3DB] rounded-lg appearance-none cursor-pointer accent-[#8C3A27]"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
          <span>$100</span>
          <span>$300</span>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-3">Universidad</h3>
        <div className="w-full bg-[#FFF5F0] border border-[#F2E3DB] rounded-full py-2.5 px-4 text-sm text-gray-600 flex items-center justify-between cursor-not-allowed opacity-80">
          <span className="truncate pr-2">Universidad Central del Ecuador</span>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-3">Hábitos</h3>
        <div className="flex flex-wrap gap-2">
          {['Madrugador', 'Noctámbulo', 'No fumador', 'Ordenado'].map(habit => (
            <button
              key={habit}
              onClick={() => toggleHabit(habit)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                habits.includes(habit) 
                  ? 'bg-[#8C3A27] text-white' 
                  : 'bg-[#FDF0EB] text-gray-600 hover:bg-[#F2E3DB]'
              }`}
            >
              {habit}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-3">Mascotas</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm text-gray-700 flex items-center gap-2 group-hover:text-[#8C3A27] transition">🐾 Acepta Perros</span>
            <input 
              type="radio" 
              name="pets" 
              value="perros"
              checked={pets === 'perros'}
              onChange={(e) => setPets(e.target.value)}
              className="w-4 h-4 accent-[#8C3A27]"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm text-gray-700 flex items-center gap-2 group-hover:text-[#8C3A27] transition">🐾 Acepta Gatos</span>
            <input 
              type="radio" 
              name="pets" 
              value="gatos"
              checked={pets === 'gatos'}
              onChange={(e) => setPets(e.target.value)}
              className="w-4 h-4 accent-[#8C3A27]"
            />
          </label>
        </div>
      </div>

      <button 
        onClick={clearFilters}
        className="w-full bg-[#C27C67] text-white py-3 rounded-full text-sm font-bold hover:bg-[#8C3A27] transition"
      >
        Limpiar filtros
      </button>
    </aside>
  );
};