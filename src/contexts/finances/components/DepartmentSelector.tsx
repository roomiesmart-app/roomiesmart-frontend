import React from 'react';
import { Building2 } from 'lucide-react';
import type { MyDepartment } from '../../matchmaking/services/PublishService';

interface DepartmentSelectorProps {
  spaces: MyDepartment[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
  spaces,
  selectedId,
  onSelect,
}) => (
  <aside className="bg-white rounded-[2rem] shadow-sm border border-[#F2E3DB] p-6 h-fit">
    <h3 className="flex items-center gap-2 text-sm font-extrabold text-gray-900 uppercase tracking-wider mb-4">
      <Building2 size={16} className="text-[#8C3A27]" /> Mis departamentos
    </h3>
    <div className="space-y-2">
      {spaces.map((space) => {
        const isSelected = space.id === selectedId;
        const isOwner = space.membership_role === 'owner';
        return (
          <button
            key={space.id}
            onClick={() => onSelect(space.id)}
            className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition-colors ${
              isSelected
                ? 'bg-[#8C3A27] text-white shadow-sm'
                : 'bg-[#FDF8F6] text-gray-700 border border-[#F2E3DB] hover:bg-[#F9F2EE]'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold line-clamp-1">{space.title}</p>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : isOwner
                      ? 'bg-[#FDF0EB] text-[#8C3A27]'
                      : 'bg-[#E0E7FF] text-[#4338CA]'
                }`}
              >
                {isOwner ? 'Dueño' : 'Miembro'}
              </span>
            </div>
            <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
              {space.neighborhood || space.location_address}
            </p>
          </button>
        );
      })}
    </div>
    <p className="mt-4 text-xs text-gray-400">
      Selecciona un departamento para ver sus gastos, finanzas y miembros.
    </p>
  </aside>
);
