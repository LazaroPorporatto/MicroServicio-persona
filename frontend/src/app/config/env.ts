// RUTA: src/app/config/env.ts
// --- CÓDIGO LISTO PARA COPIAR Y PEGAR ---

// La URL base de tu API
const API_BASE_URL = 'http://localhost:3000';

export const config = {
  urls: {
    // La URL base para la instancia de Axios
    base: API_BASE_URL,
    
    // Rutas relativas para cada endpoint
    persons: `${API_BASE_URL}/persons`, // Hecho explícito para claridad
    login: `${API_BASE_URL}/auth/login`,   // Hecho explícito para claridad
    
    // --- CAMBIO: AÑADIDA LA RUTA DE REGISTRO ---
    register: `${API_BASE_URL}/auth/register`,

    // La URL externa se queda completa
    getFood: 'https://run.mocky.io/v3/0a5a1d85-ee02-455e-b53e-e3887acfbfaf'
  },
};