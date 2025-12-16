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
  },

  getMediaUrl: (path: string) => {
    // Si la ruta ya tiene http/https, devolverla tal cual
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // Si no, concatenar con la base URL
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const fullUrl = `${API_CONFIG.API_URL}${cleanPath}`;
    
    // Codificar correctamente solo los espacios y caracteres especiales
    // pero mantener la estructura de la URL
    const urlParts = fullUrl.split('/');
    const encodedParts = urlParts.map((part, index) => {
      // No codificar el protocolo y el dominio (primeras 3 partes: https, '', domain)
      if (index < 3) return part;
      // Codificar solo el nombre del archivo (última parte si contiene extensión)
      if (index === urlParts.length - 1 && part.includes('.')) {
        return encodeURIComponent(part);
      }
      return part;
    });
    
    return encodedParts.join('/');
  }
};
