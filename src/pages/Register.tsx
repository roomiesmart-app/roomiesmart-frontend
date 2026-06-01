
import { Link } from 'react-router-dom';
import { useRegister } from '../context/RegisterContext';
import IconInput from '../components/ui/IconImput';


export default function Register() {
    const { formData, updateFormData } = useRegister();

    console.log(formData);
  const MailIcon = <svg className="h-4 w-4 text-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
  const LockIcon = <svg className="h-4 w-4 text-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
  const UserIcon = <svg className="h-4 w-4 text-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
  const CalendarIcon = <svg className="h-4 w-4 text-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
  const BookIcon = <svg className="h-4 w-4 text-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>;
  const LocationIcon = <svg className="h-4 w-4 text-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
  const GenderIcon = <svg className="h-4 w-4 text-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#FCF7F6] to-[#FDECE8]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="h-6 w-10 rounded bg-gray-300"></div>
          <span className="font-bold text-primary">RoomieSmart</span>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
          <span>Paso 1 de 4</span>
          <div className="flex gap-1">
            <div className="h-1.5 w-8 rounded-full bg-primary"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-primary/30"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-primary/30"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-primary/30"></div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <div className="mb-8 pl-4">
          <h1 className="text-xl font-bold text-secondary">Comencemos con lo básico</h1>
          <p className="mt-1 text-sm text-neutral">
            Cuéntanos un poco sobre ti para ayudarte a encontrar el compañero de piso ideal.
          </p>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="mb-6 flex items-start gap-3 rounded-2xl bg-[#bd6049] p-4 text-white">
            <svg className="mt-0.5 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium leading-relaxed">
              Esta aplicación es exclusiva para estudiantes de la Universidad Central del Ecuador. Regístrate con tu correo institucional.
            </p>
          </div>

          <form className="space-y-4">
                 <IconInput
                    label="Correo electrónico"
                    type="email"
                    placeholder="usuario@uce.edu.ec"
                    icon={MailIcon}
                    value={formData.email}
                    onChange={(e) =>
                        updateFormData({
                        email: e.target.value,
                        })
                    }
                    />        
                    <IconInput
                        label="Contraseña"
                        type="password"
                        placeholder="••••••••"
                        icon={LockIcon}
                        value={formData.password}
                        onChange={(e) =>
                            updateFormData({
                            password: e.target.value,
                            })
                        }
                        />
                    <IconInput
                        label="Nombre Completo"
                        type="text"
                        placeholder="Ej. Alex Chen"
                        icon={UserIcon}
                        value={formData.name}
                        onChange={(e) =>
                            updateFormData({
                            name: e.target.value,
                            })
                        }
                        />

            <div className="flex gap-4">
              <div className="w-1/2">
                    <IconInput
                        label="Edad"
                        type="number"
                        placeholder="21"
                        icon={CalendarIcon}
                        value={formData.age.toString()}
                        onChange={(e) =>
                            updateFormData({
                            age: Number(e.target.value),
                            })
                        }
                        />
              </div>
              <div className="w-1/2">
                <label className="mb-1.5 block text-xs font-semibold text-neutral">Género</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">{GenderIcon}</div>
               <select
                    value={formData.gender}
                    onChange={(e) =>
                        updateFormData({
                        gender: e.target.value,
                        })
                    }
                    className="w-full appearance-none rounded-full border border-primary/20 bg-[#FFF9F8] py-3 pl-10 pr-4 text-sm text-secondary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                    <option value="">Seleccionar</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                        <IconInput
                        label="Semestre actual"
                        type="text"
                        placeholder="Ej. 5"
                        icon={CalendarIcon}
                        value={formData.semester}
                        onChange={(e) =>
                            updateFormData({
                            semester: e.target.value,
                            })
                        }
                        />
              </div>
              <div className="w-1/2">
                            <IconInput
                                label="Carrera"
                                type="text"
                                placeholder="Ej. Arquitectura"
                                icon={BookIcon}
                                value={formData.career}
                                onChange={(e) =>
                                    updateFormData({
                                    career: e.target.value,
                                    })
                                }
                                />
              </div>
            </div>

                        <IconInput
                                label="Ciudad de nacimiento"
                                type="text"
                                placeholder="Ej. Quito"
                                icon={LocationIcon}
                                value={formData.birthCity}
                                onChange={(e) =>
                                    updateFormData({
                                    birthCity: e.target.value,
                                    })
                                }
                                />

            <div className="mt-8 flex items-center justify-between pt-4">
              <p className="text-xs text-neutral">
                Tus datos están protegidos bajo nuestra <a href="#" className="text-primary hover:underline">Política de Privacidad.</a>
              </p>
              <Link 
                to="/register/step-2" 
                className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-[#a3513d] active:scale-[0.98]"
              >
                Continuar
              </Link>
            </div>
          </form>
        </div>
      </main>

      <footer className="w-full bg-[#FFF5F3] px-8 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-xs text-neutral">
          <div>
            <p className="font-bold text-primary">RoomieSmart</p>
            <p className="mt-1">© 2026 RoomieSmart. Cultivando una mejor convivencia.</p>
          </div>
          <div className="flex gap-6 font-medium">
            <a href="#" className="hover:text-primary">Community</a>
            <a href="#" className="hover:text-primary">Safety</a>
            <a href="#" className="hover:text-primary">Legal</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}