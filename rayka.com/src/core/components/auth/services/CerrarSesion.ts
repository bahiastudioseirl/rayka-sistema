import { AuthStore } from './AuthStore';

export const cerrarSesion = (): void => {
  // Limpiar TODO: sessionStorage y localStorage
  AuthStore.clearAll();
  
  // Redirigir al login
  window.location.href = '/admin';
};
