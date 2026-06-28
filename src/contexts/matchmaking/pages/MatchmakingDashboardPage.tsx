import React, { useState, useEffect } from 'react';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProfileCard, type ProfileData } from '../components/ProfileCard';
import { matchmakingService } from '../services/matchmaking.services';
import type { MatchmakingFilters } from '../types/matchmaking.types';

export const MatchmakingDashboardPage: React.FC = () => {
  const { user } = useKindeAuth();
  const [naturalProfiles, setNaturalProfiles] = useState<ProfileData[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<ProfileData[]>([]);
  const [loadingNatural, setLoadingNatural] = useState<boolean>(true);
  const [loadingFiltered, setLoadingFiltered] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [currentFilters, setCurrentFilters] = useState<MatchmakingFilters>({});

  const formatProfiles = (data: any[]): ProfileData[] => {
    if (!Array.isArray(data)) return [];

    return data.map((match: any) => {
      const c = match?.candidate;
      return {
        id: c?.id || Math.random().toString(),
        name: c?.fullName || 'Estudiante UCE',
        subtitle: c?.roomType || 'Privada',
        affinityScore: Number(match?.compatibilityScore ?? 50),
        habits: [
          c?.habits?.isEarlyBird ? 'Madrugador' : 'Noctámbulo',
          c?.habits?.smokingPreference || 'No fumo'
        ],
        bio: match?.aiExplanation || 'Afinidad calculada por IA',
        budget: c?.budget?.min || 150,
        imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${c?.fullName || 'default'}`
      };
    });
  };

  const loadNaturalMatches = async () => {
    if (!user?.email && !user?.id) return;
    setLoadingNatural(true);
    try {
      const authIdentifier = user?.email || user?.id || "";
      const data = await matchmakingService.getMatches(authIdentifier, {});
      setNaturalProfiles(formatProfiles(data));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNatural(false);
    }
  };

  const handleManualSearch = async () => {
    if (!user?.email && !user?.id) return;
    setLoadingFiltered(true);
    setHasSearched(true);
    try {
      const authIdentifier = user?.email || user?.id || "";
      const data = await matchmakingService.getMatches(authIdentifier, currentFilters);
      setFilteredProfiles(formatProfiles(data));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFiltered(false);
    }
  };

  useEffect(() => {
    if (user?.email || user?.id) loadNaturalMatches();
  }, [user?.email, user?.id]);

  return (
    <main className="max-w-7xl mx-auto px-8 py-8 flex flex-col md:flex-row gap-12">
      <aside className="w-full md:w-72 border-r border-gray-200 pr-8">
        <FilterSidebar onFiltersChange={setCurrentFilters} />
        <button onClick={handleManualSearch} className="w-full mt-6 bg-[#8C3A27] text-white py-3 rounded-lg font-bold hover:bg-[#7a3222] transition">
          Buscar Roomies
        </button>
      </aside>

      <section className="flex-1 space-y-16">
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900">Matchmaking Ideal</h1>
            <p className="text-sm text-gray-500">Afinidad calculada por IA basada 100% en tu test de registro</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loadingNatural ? <p>Analizando personalidades con IA...</p> : naturalProfiles.map(p => <ProfileCard key={`nat-${p.id}`} profile={p} />)}
          </div>
        </div>

        {hasSearched && (
          <div className="pt-8 border-t-2 border-dashed border-gray-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#8C3A27]">Búsqueda por Filtros</h2>
              <p className="text-sm text-gray-500">Candidatos que encajan estrictamente con tus parámetros manuales</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {loadingFiltered ? <p>Filtrando...</p> : filteredProfiles.length === 0 ? (
                <p className="text-gray-400 font-medium">Ningún roomie cumple con el 100% de esos filtros.</p>
              ) : filteredProfiles.map(p => <ProfileCard key={`filt-${p.id}`} profile={p} />)}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};