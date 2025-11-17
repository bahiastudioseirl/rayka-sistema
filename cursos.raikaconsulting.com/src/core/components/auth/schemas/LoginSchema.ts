export interface LoginRequest {
  correo: string;
  contrasenia: string;
}

export interface UserRole {
  id_rol: number;
  nombre: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: UserRole;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  usuario: User;
}
