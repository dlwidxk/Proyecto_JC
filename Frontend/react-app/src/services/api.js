const developmentApiUrl = 'http://localhost:2323/api';

export const API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '' : developmentApiUrl);

export function apiUrl(path) {
  if (!API_URL) {
    throw new Error('El servicio todavía no está configurado. Inténtalo más tarde.');
  }

  return `${API_URL}${path}`;
}
