import { Link } from 'react-router-dom';

export default function RegisterStep3() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#FCF7F6] to-[#FDECE8] p-8">
      
      {/* Header Progreso */}
      <div className="max-w-6xl mx-auto w-full mb-8">
        <p className="text-sm text-neutral mb-2">Estilo de vida</p>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-secondary">Paso 3 de 5: Encontrando tu ritmo social.</h1>
          <span className="text-sm font-bold text-primary">75% Completado</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div className="w-[75%] h-2 bg-primary rounded-full"></div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Formulario de Estilo de Vida */}
        <section className="space-y-8">
          
          {/* Hobbies */}
          <div>
            <label className="text-sm font-bold text-secondary mb-4 block">✨ Hobbies</label>
            <div className="flex flex-wrap gap-3">
              {['Cocina', 'Gaming', 'Ejercicio', 'Fotografía', 'Lectura', 'Viajar', 'Yoga', 'Arte', 'Senderismo'].map(h => (
                <button key={h} className="px-5 py-2.5 rounded-full border border-primary/20 bg-white text-sm text-secondary hover:bg-primary/10 transition-all">{h}</button>
              ))}
            </div>
          </div>

          {/* Música */}
          <div>
            <label className="text-sm font-bold text-secondary mb-4 block">🎵 Música</label>
            <div className="grid grid-cols-4 gap-4">
              {['Rap', 'Rock', 'Electronic', 'Reggaeton'].map(m => (
                <div key={m} className="flex flex-col items-center justify-center p-4 bg-white rounded-3xl border border-primary/10 aspect-square text-center">
                  <span className="text-xs font-semibold text-secondary">{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mascotas y Humo */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="text-sm font-bold text-secondary mb-4 block">🐾 Mascotas</label>
              <div className="space-y-3">
                {['Tengo mascotas', 'No me molestan las mascotas', 'No tengo mascotas'].map(op => (
                  <label key={op} className="flex items-center gap-3 text-sm text-neutral cursor-pointer">
                    <input type="radio" name="mascotas" className="accent-primary" /> {op}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-secondary mb-4 block">🚬 Humo y vaper</label>
              <div className="space-y-3">
                {['Me gusta fumar tabaco/vape', 'No fumo dentro del departamento', 'No tolero el humo/vape'].map(op => (
                  <label key={op} className="flex items-center gap-3 text-sm text-neutral cursor-pointer">
                    <input type="radio" name="fumar" className="accent-primary" /> {op}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Slider Social */}
          <div>
            <label className="text-sm font-bold text-secondary mb-4 block">👥 Preferencias sociales</label>
            <input type="range" className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            <div className="flex justify-between text-xs text-neutral mt-2">
              <span>No soy social</span>
              <span>Sociable dependiendo de que evento hay</span>
              <span>Soy muy sociable</span>
            </div>
          </div>
        </section>

        {/* Card IA */}
        <section className="bg-white rounded-[40px] p-8 shadow-xl">
          <div className="h-64 bg-primary/20 rounded-[32px] mb-6"></div>
          <h3 className="text-lg font-bold text-secondary mb-2">Tu medidor de Compatibilidad Social</h3>
          <p className="text-sm text-neutral mb-6">Usamos estos indicadores de tu estilo de vida, para emparejarte con personas que comparten tus mismos gustos.</p>
          <div className="flex gap-3">
            <button className="bg-[#008779] text-white px-4 py-2 rounded-full text-xs font-bold">✓ Enfoque Comunitario</button>
            <button className="bg-gray-100 text-secondary px-4 py-2 rounded-full text-xs font-bold">🔒 Privacidad Primero</button>
          </div>
        </section>
      </main>

    <footer className="max-w-6xl mx-auto w-full mt-12 flex justify-between items-center">
            <Link to="/register/step-2" className="text-sm font-semibold text-neutral hover:text-secondary">
            ← Regresar
            </Link>
            
            {/* Envolvemos el botón en un Link para que funcione como navegador */}
            <Link 
            to="/register/step-4" 
            className="bg-primary px-8 py-3 rounded-full text-sm font-bold text-white hover:bg-[#a3513d] transition-all"
            >
            Continuar al Paso 4
            </Link>
        </footer>
    </div>
  );
}