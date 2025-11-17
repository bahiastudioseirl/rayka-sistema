import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { UserLoginRequest, UserLoginResponse } from '../schemas/UserLoginSchema';

export const iniciarSesionUsuario = async (credentials: UserLoginRequest): Promise<UserLoginResponse> => {
  const response = await axiosWithoutMultipart.post<UserLoginResponse>('auth/login-usuario', credentials);
  return response.data;
};

// Store para usuarios (similar al AuthStore pero para estudiantes)
export class UserStore {
  private static readonly USER_KEY = 'userData';
  private static readonly TOKEN_KEY = 'userToken';

  static setUser(user: any): void {
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static getUser(): any | null {
    const userData = sessionStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static setToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  }

  static clearAll(): void {
    sessionStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  static logout(): void {
    this.clearAll();
    window.location.href = '/login';
  }
}