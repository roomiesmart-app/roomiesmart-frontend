import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilterSidebar } from "../components/FilterSidebar";
import { ProfileCard, type ProfileData } from "../components/ProfileCard";
export const MatchmakingDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [mockProfiles] = useState<ProfileData[]>([
    {
      id: "1",
      name: "Sarah Jenkins",
      subtitle: "Séptimo Semestre • Ingeniería en Sistemas",
      affinityScore: 95,
      habits: ["Madrugadora", "No fumadora", "Silencio tras 10 PM"],
      bio: "Busco un espacio tranquilo y organizado para concentrarme en mis finales. Me gusta mantener las áreas comunes impecables.",
      budget: 180,
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    },
    {
      id: "2",
      name: "Michael Chen",
      subtitle: "Quinto Semestre • Arquitectura",
      affinityScore: 88,
      habits: ["Noctámbulo", "Acepta Perros", "Gamer"],
      bio: "Suelo hacer maquetas hasta tarde, pero uso auriculares. Tengo un Golden Retriever muy amigable que duerme casi todo el día.",
      budget: 220,
      imageUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    },
    {
      id: "3",
      name: "Elena Rodríguez",
      subtitle: "Tercer Semestre • Diseño Gráfico",
      affinityScore: 82,
      habits: ["Artística", "Social", "Le gusta cocinar"],
      bio: "Alma creativa buscando un roommate que disfrute de cenas compartidas los fines de semana. Pinto en mi tiempo libre.",
      budget: 150,
      imageUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    },
    {
      id: "4",
      name: "David Miller",
      subtitle: "Octavo Semestre • Medicina",
      affinityScore: 75,
      habits: ["No fumador", "Estudioso", "Minimalista"],
      bio: "Paso la mayor parte del tiempo en el hospital o estudiando. Busco alguien responsable con los pagos y la limpieza.",
      budget: 250,
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    },
  ]);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div className="font-bold text-xl text-[#8C3A27]">RoomieSmart</div>
          <nav className="flex gap-6 text-sm font-medium text-gray-600">
            <button
              type="button"
              onClick={() => navigate("/matchmaking")}
              className="text-[#8C3A27] hover:text-[#6d2417]"
            >
              Buscar Roomies
            </button>
            <button
              type="button"
              onClick={() => navigate("/publish-department")}
              className="hover:text-[#8C3A27]"
            >
              Publicar Espacio
            </button>
            <span className="opacity-50 cursor-not-allowed">Finanzas</span>
          </nav>
        </div>
        <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jonathan"
            alt="Avatar"
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8 flex gap-12">
        <FilterSidebar />

        <section className="flex-1">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                Encuentra tu match ideal
              </h1>
              <p className="text-gray-500 text-sm">
                {mockProfiles.length} roomies potenciales cerca de Universidad
                Central del Ecuador
              </p>
            </div>
            <div className="flex gap-2">
              <button className="border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-600 flex items-center gap-2 hover:bg-gray-50">
                ≡ Ordenar: Compatibilidad
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {mockProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>

          <div className="text-center">
            <button className="border-2 border-[#8C3A27] text-[#8C3A27] px-8 py-3 rounded-full text-sm font-bold hover:bg-[#FFF5F0] transition mb-4">
              Cargar más roomies
            </button>
            <p className="text-xs text-gray-400 font-medium">
              Mostrando 4 de 128 resultados
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};
