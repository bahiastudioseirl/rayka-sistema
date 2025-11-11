export interface UserLoginRequest {
  num_documento: string;
}

export interface Student {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  num_documento: string;
  estado: string;
  fecha_creacion: string;
}

export interface UserLoginResponse {
  success: boolean;
  message: string;
  data: {
    usuario: Student;
    capacitaciones_asignadas?: any[];
  };
}

export interface UserSession {
  isAuthenticated: boolean;
  usuario?: Student;
  loginTime?: Date;
}