import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

// Inicialización perezosa: si faltan las variables en el build,
// la app sigue funcionando y el error solo aparece al usar Supabase.
export function getSupabase(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Faltan VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en el build. " +
        "Configúralas en el entorno de despliegue.",
    );
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}
