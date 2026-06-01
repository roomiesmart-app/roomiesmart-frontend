import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Libera la red para el contenedor de Ricardo
    port: 3000, // Mantenemos el 3000 para estandarizar con el backend
  }
})