import React from "react";
import { useNavigate } from "react-router-dom";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Header } from "../../../shared/components/Header";

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useKindeAuth();

  const firstName = user?.givenName || "Roomie";
  const lastName = user?.familyName || "";

  const handleLogout = () => {

    window.localStorage.removeItem("roomieSmartState");
    logout();
  };

  const metrics = [
    { label: "MATCHES", value: "12" },
    { label: "MENSAJES", value: "3" },
    { label: "DÍAS RESTANTES", value: "08" },
    { label: "BALANCE", value: "+$1.2k", isPositive: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F0] to-[#FDF0EB] px-8 py-10 font-sans">
      <Header
        userName={`${firstName} ${lastName}`.trim()}
        userSubtitle="Universidad Central"
        avatarUrl={user?.picture || undefined}
        onLogout={handleLogout}
      />

      <div className="mb-10 max-w-2xl">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Bienvenido de nuevo,{" "}
          <span className="text-[#8C3A27]">{firstName}.</span>
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Tu ecosistema para una vida compartida sin fricciones. Gestiona tu
          espacio, tus roomies y tus finanzas en un solo lugar.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6 mb-10">
        <div className="col-span-8 bg-[#FFF8F5] rounded-[2rem] p-10 shadow-sm relative overflow-hidden">
          <div className="relative z-10 w-2/3">
            <span className="text-xs font-bold text-[#8C3A27] tracking-wider uppercase mb-4 block">
              Matchmaking Engine
            </span>
            <h2 className="text-3xl font-bold mb-4">Buscar Roomie</h2>
            <p className="text-gray-600 mb-8">
              Explora perfiles compatibles según hábitos y presupuesto. Nuestro
              algoritmo encuentra la mejor convivencia para ti.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/matchmaking")}
                className="bg-[#8C3A27] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#702d1f] transition"
              >
                Explorar Matches
              </button>
              <button className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition">
                Ver Favoritos
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-4 row-span-2 bg-white rounded-[2rem] p-10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-teal-100 rounded-full mb-6 flex items-center justify-center">
              <span className="text-teal-600 text-xl font-bold">💳</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">
              Gestionar
              <br />
              Finanzas
            </h2>
            <p className="text-gray-600 text-sm mb-8">
              Divide gastos, controla pagos y organiza cuentas compartidas con
              transparencia total.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
              <span className="text-sm font-semibold">Alquiler Mayo</span>
              <span className="text-teal-600 font-bold">$450.00</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
              <span className="text-sm font-semibold">Servicios</span>
              <span className="text-red-500 font-bold">-$12.40</span>
            </div>

            <button
              onClick={() => navigate("/finanzas")}
              className="w-full bg-[#8C3A27] text-white py-4 rounded-2xl font-semibold mt-4 hover:bg-[#702d1f] transition-colors"
            >
              Ir a Finanzas
            </button>
          </div>
        </div>

        <div className="col-span-8 bg-white rounded-[2rem] p-10 shadow-sm flex items-center gap-8">
          <div className="flex-1">
            <span className="text-xs font-bold text-[#8C3A27] tracking-wider uppercase mb-4 block">
              Shared Spaces
            </span>
            <h2 className="text-3xl font-bold mb-4">Publicar Departamento</h2>
            <p className="text-gray-600 mb-8 text-sm">
              Publica habitaciones o departamentos disponibles. Llega a miles de
              estudiantes y profesionales verificados buscando su próximo hogar.
            </p>
            <button
              onClick={() => navigate("/publish-department")}
              className="bg-[#8C3A27] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#702d1f] transition"
            >
              Publicar ahora
            </button>
          </div>
          <div className="w-64 h-40 bg-gray-200 rounded-3xl overflow-hidden shrink-0">
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400"
              alt="Sala"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center bg-[#FFF8F5] rounded-3xl p-6 px-12 mb-8">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="text-center flex-1 border-r last:border-0 border-orange-100"
          >
            <p className="text-xs font-bold text-gray-500 mb-2">
              {metric.label}
            </p>
            <p
              className={`text-2xl font-bold ${metric.isPositive ? "text-teal-600" : "text-[#8C3A27]"}`}
            >
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomePage;
