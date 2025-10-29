// La URL base de tu API
const API_BASE_URL = 'http://localhost:3000';

export const config = {
  urls: {
    // La URL base para la instancia de Axios
    base: API_BASE_URL,
    
    // Rutas relativas para cada endpoint
    persons: `${API_BASE_URL}/persons`,     login: `${API_BASE_URL}/auth/login`,  
    register: `${API_BASE_URL}/auth/register`,

    // La URL externa
    getFood: 'https://run.mocky.io/v3/0a5a1d85-ee02-455e-b53e-e3887acfbfaf'
  },
};