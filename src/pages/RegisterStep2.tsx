import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function RegisterStep2() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#FCF7F6] to-[#FDECE8]">
      
      {/* Header con Progreso */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">RoomieSmart</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-500">Hábitos y Limpieza | Paso 2 de 5</span>
          <Link to="#" className="text-sm font-semibold text-secondary hover:underline">Guardar y Salir</Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Lado Izquierdo: Formulario */}
        <section>
          <h1 className="text-3xl font-bold text-secondary mb-2">Cultivando la armonía</h1>
          <p className="text-neutral mb-8">La convivencia empieza por los acuerdos. Cuéntanos cómo prefieres gestionar el espacio compartido para encontrar a tu roomie ideal.</p>

          <div className="space-y-8">
            {/* Frecuencia de limpieza */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-secondary mb-4">
                🧹 Frecuencia de limpieza
              </label>
              <div className="flex gap-4">
                {['Diaria', '2-3 veces/semana', 'Semanal'].map((frecuencia) => (
                  <button key={frecuencia} className="flex-1 rounded-2xl border border-primary/20 bg-white py-4 text-sm font-medium text-secondary hover:bg-primary/5 transition-all">
                    {frecuencia}
                  </button>
                ))}
              </div>
            </div>

            {/* Horarios */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-secondary mb-4">
                🕒 Horarios de actividad
              </label>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-primary/10">
                  <div>
                    <p className="text-sm font-semibold text-secondary">Soy madrugador(a)</p>
                    <p className="text-xs text-neutral">Prefiero hacer mis actividades por la mañana.</p>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-primary/10">
                  <div>
                    <p className="text-sm font-semibold text-secondary">Uso de áreas comunes de noche</p>
                    <p className="text-xs text-neutral">Suelo cocinar o estudiar tarde en la noche.</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
              </div>
            </div>

            {/* Tareas compartidas */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-secondary mb-4">
                👥 Tareas compartidas
              </label>
              <div className="flex flex-wrap gap-3">
                {['Compras conjuntas', 'Turnos de basura', 'Cocina por turnos', 'Lavandería organizada'].map((tarea) => (
                  <button key={tarea} className="px-4 py-2 rounded-full border border-primary/20 bg-white text-xs text-secondary hover:bg-primary/10">
                    {tarea}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Lado Derecho: Card de IA */}
        <section className="bg-primary/10 rounded-[32px] p-8 flex flex-col items-center justify-center text-center">
            <div className="w-full bg-white rounded-[24px] p-6 shadow-sm">
                <div className="h-40 bg-orange-100 rounded-xl mb-4"></div>
                <p className="text-sm font-bold text-primary mb-1">Algoritmo RoomieSmart</p>
                <p className="text-xs text-neutral mb-4">Ajustando compatibilidad...</p>
                <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
                    <div className="w-[85%] bg-primary h-2 rounded-full"></div>
                </div>
                <p className="text-xs text-secondary font-semibold">Compatibilidad de Orden: 85%</p>
                <p className="text-[10px] text-neutral mt-2">"Tus hábitos de limpieza semanal coinciden con 6 perfiles registrados en RoomieSmart."</p>
            </div>
        </section>
      </main>

      {/* Footer Navigation */}
    <footer className="mx-auto w-full max-w-6xl p-6 flex justify-between items-center">
            {/* Enlace para volver al paso 1 */}
            <Link 
            to="/register" 
            className="text-sm font-semibold text-neutral hover:text-secondary transition-all"
            >
            ← Anterior
            </Link>

            {/* Link para avanzar al paso 3 */}
            <Link 
            to="/register/step-3" 
            className="bg-primary px-8 py-3 rounded-full text-sm font-bold text-white hover:bg-[#a3513d] transition-all shadow-lg shadow-primary/20"
            >
            Continuar: Perfil Social
            </Link>
        </footer>
    </div>
  );
}