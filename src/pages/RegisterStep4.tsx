import { Link } from 'react-router-dom';

export default function FinancialExpectationsOnboarding() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#FCF7F6] to-[#FDECE8] p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto w-full flex justify-between items-center mb-10">
        <span className="font-bold text-primary">RoomieSmart</span>
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold text-neutral">Guardar borrador</span>
          <span className="text-sm font-bold text-primary">Paso 4 de 4</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full flex flex-col items-center">
        {/* Título */}
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 mb-3 text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 rounded-full">
            Finalizando tu perfil
          </div>
          <h1 className="text-2xl font-bold text-secondary">Cuentas Claras, Convivencia Feliz</h1>
          <p className="text-neutral text-sm mt-2">Define tus expectativas financieras y cómo te gustaría gestionar el espacio compartido.</p>
        </div>

        {/* Contenido Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          
          {/* Columna Izquierda: Presupuesto y Gastos */}
          <div className="space-y-6">
            <section className="bg-white p-8 rounded-[32px] shadow-sm border border-primary/5">
              <h2 className="text-sm font-bold text-secondary mb-6 flex items-center gap-2">💰 Presupuesto Mensual</h2>
              <input type="range" className="w-full h-2 bg-gray-200 rounded-lg accent-primary mb-2" />
              <div className="flex justify-between text-xs text-neutral font-bold mb-8">
                <span>$150</span><span>$300</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[{l: 'Económico', v: '$100-$150'}, {l: 'Medio', v: '$150-$200'}, {l: 'Premium', v: '$200+' }].map((item) => (
                  <div key={item.l} className="p-3 bg-[#FFF9F8] rounded-2xl border border-primary/10">
                    <p className="text-[10px] text-neutral">{item.l}</p>
                    <p className="text-xs font-bold text-secondary">{item.v}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white p-8 rounded-[32px] shadow-sm border border-primary/5">
              <h2 className="text-sm font-bold text-secondary mb-6">📑 Gastos y Compras Comunes</h2>
              <div className="space-y-4 mb-8">
                {[
                  { title: 'Fondo Común', desc: 'Aportamos una cantidad fija cada mes para todo.' },
                  { title: 'División Digital', desc: 'Cada uno paga lo suyo y ajustamos cuentas al final.' },
                  { title: 'Todo Individual', desc: 'Cada roomie se encarga de sus propias compras.' }
                ].map((item) => (
                  <label key={item.title} className="flex items-start gap-4 p-4 border border-gray-100 rounded-2xl hover:bg-primary/5 transition-all cursor-pointer">
                    <input type="radio" name="gastos" className="accent-primary mt-1 w-4 h-4" />
                    <div>
                      <p className="text-sm font-bold text-secondary">{item.title}</p>
                      <p className="text-xs text-neutral mt-0.5">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <h3 className="text-sm font-bold text-secondary mb-4">¿Qué objetos compartes sin problema?</h3>
              <div className="flex flex-wrap gap-3">
                {['Nevera', 'Cafetera', 'Televisión', 'Productos limpieza', 'Lavadora'].map((obj, i) => (
                  <button 
                    key={obj} 
                    className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                      i === 1 || i === 3 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-white text-secondary border-primary/20 hover:bg-primary/10'
                    }`}
                  >
                    {obj}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Columna Derecha: Habitación y Sabías que */}
          <div className="space-y-6">
            <section className="bg-white p-8 rounded-[32px] shadow-sm border border-primary/5">
              <h2 className="text-sm font-bold text-secondary mb-6">🏠 Compartir Habitación</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-5 border-2 border-primary rounded-2xl text-center shadow-sm">
                  <p className="text-xs font-bold text-secondary">Privada</p>
                </button>
                <button className="p-5 border border-gray-200 rounded-2xl text-center hover:bg-gray-50">
                  <p className="text-xs font-bold text-neutral">Compartida</p>
                </button>
              </div>
            </section>

            {/* Bloque con espacio para imagen */}
            <section className="bg-primary/90 p-6 rounded-[32px] text-white flex flex-col gap-4">
              <div className="w-full h-32 bg-white/20 rounded-2xl flex items-center justify-center border border-white/10">
                <span className="text-xs opacity-60">Foto del consejo</span>
              </div>
              <div>
                <p className="text-sm font-bold mb-2">¿Sabías que...?</p>
                <p className="text-xs opacity-90 leading-relaxed">
                  Los compañeros que acuerdan sus finanzas el primer mes tienen un 40% menos de conflictos en el futuro.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer Nav */}
    <footer className="max-w-6xl mx-auto w-full mt-12 flex justify-between items-center">
            {/* Regresar al paso 3 */}
            <Link to="/register/step-3" className="text-sm font-semibold text-neutral hover:text-secondary">
            ← Atrás
            </Link>
            
            {/* Enlace para finalizar y redirigir al login */}
            <Link 
            to="/login" 
            className="bg-primary px-10 py-3 rounded-full text-sm font-bold text-white hover:bg-[#a3513d] shadow-lg shadow-primary/30 active:scale-[0.98] transition-all"
            >
            Finalizar Perfil 🚀
            </Link>
        </footer>
    </div>
  );
}