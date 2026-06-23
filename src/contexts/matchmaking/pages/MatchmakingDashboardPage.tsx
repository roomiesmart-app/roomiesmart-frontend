import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProfileCard, type ProfileData } from '../components/ProfileCard';
import { matchmakingService } from '../services/matchmaking.services';

export const MatchmakingDashboardPage: React.FC = () => {
  const { user } = useUser();
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const data = await matchmakingService.getMatches(user.id);
        
        // Log estratégico para verificar la data cruda del backend
        console.log("Datos crudos recibidos del backend:", data);
        
        // Transformamos la respuesta
        const formattedProfiles: ProfileData[] = data.map((match) => ({
          id: match.candidate.id,
          name: match.candidate.fullName,
          subtitle: match.candidate.roomType,
          affinityScore: match.compatibilityScore,
          habits: [
            match.candidate.habits.isEarlyBird ? 'Madrugador' : 'Noctámbulo',
            match.candidate.habits.smokingPreference === 'No' ? 'No fumador' : 'Fumador'
          ],
          bio: match.aiExplanation,
          budget: match.candidate.budget.min,
          imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + match.candidate.fullName
        }));
        
        setProfiles(formattedProfiles);
        console.log("Profiles mapeados listos para renderizar:", formattedProfiles);
        
      } catch (error) {
        console.error("Error al cargar matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user]);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div className="font-bold text-xl text-[#8C3A27]">RoomieSmart</div>
          <nav className="flex gap-6 text-sm font-medium text-gray-600">
            <span className="text-[#8C3A27]">Buscar Roomies</span>
            <span className="opacity-50 cursor-not-allowed">Publicar Espacio</span>
            <span className="opacity-50 cursor-not-allowed">Finanzas</span>
          </nav>
        </div>
        <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
          <img src={user?.imageUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"} alt="Avatar" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8 flex gap-12">
        <FilterSidebar />
        
        <section className="flex-1">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Encuentra tu match ideal</h1>
              <p className="text-gray-500 text-sm">
                {loading ? "Cargando roomies..." : `${profiles.length} roomies potenciales cerca de ti`}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-600 flex items-center gap-2 hover:bg-gray-50">
                ≡ Ordenar: Compatibilidad
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {profiles.map(profile => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MatchmakingDashboardPage;