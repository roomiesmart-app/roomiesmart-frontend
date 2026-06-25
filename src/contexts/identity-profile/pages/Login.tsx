import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import logo from "../../../assets/RoomieSmart.png";

export const Login = () => {
    const { login, isLoading } = useKindeAuth();

    const handleSignInWithMicrosoft = async () => {
        if (isLoading) return;

        try {
            await login({
                connectionId: "conn_microsoft",
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#f8f9fa] overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-tertiary rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
            <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-tertiary rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>

            <div className="relative z-10 w-full max-w-md px-10 py-14 mx-4 bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.05)]">
                <div className="text-center mb-12 flex flex-col items-center">
                    <img src={logo} alt="RoomieSmart Logo" className="w-48 h-auto mb-6 drop-shadow-md hover:scale-105 transition-transform duration-300" />
                    <h1 className="text-4xl font-extrabold tracking-tight text-secondary mb-2">
                        Roomie<span className="text-primary">Smart</span>
                    </h1>
                    <p className="text-neutral font-medium text-sm">Tu vida universitaria, compartida.</p>
                </div>

                <div className="space-y-8">
                    <button 
                        onClick={handleSignInWithMicrosoft}
                        className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all shadow-xl shadow-secondary/20 hover:shadow-secondary/40 hover:-translate-y-1"
                    >
                        <div className="relative flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 23 23">
                                <path fill="#f3f3f3" d="M0 0h11v11H0z"/>
                                <path fill="#f3f3f3" d="M12 0h11v11H12z"/>
                                <path fill="#f3f3f3" d="M0 12h11v11H0z"/>
                                <path fill="#f3f3f3" d="M12 12h11v11H12z"/>
                            </svg>
                            <span className="tracking-wide">Ingresar con tu correo UCE</span>
                        </div>
                    </button>

                    <div className="text-center">
                        <p className="text-xs text-neutral/70 font-medium">
                            Acceso exclusivo para estudiantes de la<br/>Universidad Central del Ecuador
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;