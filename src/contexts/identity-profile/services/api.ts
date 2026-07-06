import axios from 'axios';

// En producción (AWS) VITE_API_BASE_URL debe apuntar al backend real,
// p. ej. https://api.roomiesmart.lat — se inyecta en el build de Vite.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
});

export default api;
