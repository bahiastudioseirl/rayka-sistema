import type { User } from '../schemas/LoginSchema';

const USER_STORAGE_KEY = 'currentUser';
const TOKEN_KEY = 'authToken';

export class AuthStore {
  
  static setUser(user: User): void {
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  static getUser(): User | null {
    const userData = sessionStorage.getItem(USER_STORAGE_KEY);
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  static clearUser(): void {
    sessionStorage.removeItem(USER_STORAGE_KEY);
  }

  static getUserRole(): string | null {
    const user = this.getUser();
    return user?.rol?.nombre || null;
  }

  static isAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
  }
  
  static clearAll(): void {
 
    sessionStorage.clear();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('authToken');
    localStorage.removeItem('admin_auth_token');
    localStorage.removeItem('userSession');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('estudiante_token');
    localStorage.removeItem('estudiante_data');
    localStorage.removeItem('capacitacion_data');

    const keysToRemove = Object.keys(localStorage).filter(key => key.startsWith('progreso_curso_'));
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
}
