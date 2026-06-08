import { useOnboarding } from '../context/OnboardingContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ONBOARDING_ROUTES } from '../../../app/routes/constant';
import { validateSocial } from '../validators/SocialValidator';
import type { SocialValidationErrors } from '../models/ValidationErrors';
import { hasErrors } from '../../../shared/utils/validationHelper';

export default function OnboardingSocialProfilePage() {
  const { formData, updateFormData } = useOnboarding();
  const { social } = formData;
  const navigate = useNavigate();
  const [errors, setErrors] = useState<SocialValidationErrors>({});

  const hobbiesOptions = ['Cocina', 'Gaming', 'Ejercicio', 'Fotografía', 'Lectura', 'Viajar', 'Yoga', 'Arte', 'Senderismo'];
  const musicOptions = ['Rap', 'Rock', 'Electronic', 'Reggaeton', 'Indie', 'Salsa', 'K-Pop', 'Jazz', 'Clásica'];
  const socialLevels = ['No soy social', 'Sociable dependiendo de que evento hay', 'Soy muy sociable'];

  const toggleHobby = (hobby: string) => {
    setErrors((prev: SocialValidationErrors) => ({ ...prev, hobbies: undefined }));
    const updated = social.hobbies.includes(hobby)
      ? social.hobbies.filter(h => h !== hobby)
      : [...social.hobbies, hobby];
    updateFormData({ social: { ...social, hobbies: updated } });
  };

  const toggleMusic = (genre: string) => {
    setErrors((prev: SocialValidationErrors) => ({ ...prev, musicGenres: undefined }));
    const updated = social.musicGenres.includes(genre)
      ? social.musicGenres.filter(g => g !== genre)
      : [...social.musicGenres, genre];
    updateFormData({ social: { ...social, musicGenres: updated } });
  };

  const handleContinue = () => {
    const validationErrors: SocialValidationErrors = validateSocial(social);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }
    navigate(ONBOARDING_ROUTES.FINANCIAL);
  };

  return (
    <div className="min-h-screen bg-[#FDF9F8] p-4 sm:p-8 font-manrope">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-10">
          <div>
            <p className="text-sm text-neutral mb-2">Estilo de vida</p>
            <h1 className="text-2xl font-bold text-secondary mb-4">Paso 3 de 4: Encontrando tu ritmo social.</h1>
            <div className="w-full h-2 bg-gray-200 rounded-full"><div className="w-[75%] h-full bg-[#A3513D] rounded-full"></div></div>
          </div>

          <section className="space-y-8">
            <h2 className="font-bold flex items-center gap-2">✨ Hobbies</h2>
            <div className="flex flex-wrap gap-2">
              {hobbiesOptions.map(h => (
                <button key={h} onClick={() => toggleHobby(h)} className={`px-5 py-2 rounded-full border transition-all ${social.hobbies.includes(h) ? 'bg-[#A3513D] text-white' : 'bg-white hover:border-[#A3513D]'}`}>{h}</button>
              ))}
            </div>

            <h2 className="font-bold">🎵 Música (Puedes seleccionar varios)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {musicOptions.map(m => (
                <button key={m} onClick={() => toggleMusic(m)} className={`p-4 rounded-2xl border transition-all ${social.musicGenres.includes(m) ? 'bg-[#A3513D] text-white border-[#A3513D]' : 'bg-white border-primary/10'}`}>{m}</button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h2 className="font-bold mb-4">🐾 Mascotas</h2>
                {['Tengo mascotas', 'No me molestan', 'No tengo mascotas'].map(op => (
                  <button key={op} onClick={() => updateFormData({ social: { ...social, petPreference: op } })} className="flex items-center gap-3 mb-3"><div className={`w-5 h-5 rounded-full border-2 ${social.petPreference === op ? 'border-[#A3513D] bg-[#A3513D]' : 'border-gray-300'}`} /> {op}</button>
                ))}
              </div>
              <div>
                <h2 className="font-bold mb-4">🚬 Humo y vaper</h2>
                {['Me gusta fumar tabaco/vape', 'No fumo dentro del departamento', 'No tolero el humo/vape'].map(op => (
                  <button key={op} onClick={() => updateFormData({ social: { ...social, smokingPreference: op } })} className="flex items-center gap-3 mb-3"><div className={`w-5 h-5 rounded-full border-2 ${social.smokingPreference === op ? 'border-[#A3513D] bg-[#A3513D]' : 'border-gray-300'}`} /> {op}</button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-bold mb-4">👥 Preferencias sociales</h2>
              <input type="range" min="0" max="2" value={socialLevels.indexOf(social.socialLevel) === -1 ? 1 : socialLevels.indexOf(social.socialLevel)} onChange={(e) => updateFormData({ social: { ...social, socialLevel: socialLevels[parseInt(e.target.value)] } })} className="w-full accent-[#A3513D]" />
              <div className="flex justify-between text-xs mt-2 text-neutral"><span>No soy social</span><span>Equilibrado</span><span>Soy muy sociable</span></div>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4 lg:sticky lg:top-8">
          <div className="bg-white p-6 rounded-[32px] shadow-lg border border-gray-100">
            <div className="h-64 bg-gray-200 rounded-3xl mb-6 overflow-hidden">
               <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Social" />
            </div>
            <h3 className="font-bold text-lg mb-2">Tu medidor de Compatibilidad Social</h3>
            <p className="text-sm text-neutral mb-6">Usamos estos indicadores para emparejarte con personas que comparten tus mismos gustos.</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-emerald-700 text-white rounded-full text-xs font-bold">✅ Enfoque Comunitario</span>
              <span className="px-3 py-1 bg-gray-200 text-secondary rounded-full text-xs font-bold">🔒 Privacidad Primero</span>
            </div>
          </div>
        </aside>
      </div>

      <footer className="max-w-6xl mx-auto mt-12 flex justify-between items-center py-6 border-t border-gray-200">
        <Link to={ONBOARDING_ROUTES.LIFESTYLE} className="font-bold">← Regresar</Link>
        <div className="flex flex-col items-end">
          {Object.keys(errors).length > 0 && (
            <span className="text-red-500 text-xs font-bold mb-2 mr-2">
              ⚠️ {Object.values(errors)[0]}
            </span>
          )}
          <button onClick={handleContinue} className="bg-[#A3513D] text-white px-10 py-3 rounded-full font-bold shadow-lg shadow-primary/20">Continuar al Paso 4</button>
        </div>
      </footer>
    </div>
  );
}