import React from 'react';

export interface ProfileData {
  id: string;
  name: string;
  subtitle: string;
  affinityScore: number;
  habits: string[];
  bio: string;
  budget: number;
  imageUrl: string;
}

interface ProfileCardProps {
  profile: ProfileData;
  onMessage?: (profile: ProfileData) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onMessage,
}) => {
  return (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-[#F2E3DB] flex flex-col">
      <div className="relative h-48">
        <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-bold text-gray-800 shadow-md">
          {profile.affinityScore}%
        </div>
        <div className="absolute bottom-4 left-6 right-4 text-white">
          <h3 className="text-xl font-bold">{profile.name}</h3>
          <p className="text-xs opacity-90 truncate">{profile.subtitle}</p>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.habits.map((habit, idx) => (
            <span key={idx} className="bg-[#FDF0EB] text-[#8C3A27] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {habit}
            </span>
          ))}
        </div>
        <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
          {profile.bio}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[#8C3A27] font-bold text-sm flex items-center gap-2">
            💵 ${profile.budget}/mes
          </span>
          <button
            type="button"
            onClick={() => onMessage?.(profile)}
            className="bg-[#8C3A27] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#702d1f] transition"
          >
            Mensaje
          </button>
        </div>
      </div>
    </div>
  );
};