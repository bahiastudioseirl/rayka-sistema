// Configuración centralizada de la API
export const API_CONFIG = {
  API_URL: import.meta.env.VITE_API_URL,
 
  getFullUrl: (path: string) => {
    // Si la ruta ya tiene http/https, devolverla tal cual
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // Si no, concatenar con la base URL
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_CONFIG.API_URL}${cleanPath}`;
  }
};
