export interface Rol {
  id_rol: number;
  nombre: string;
  created_at: string;
  updated_at: string;
}

export interface Estudiante {
  id_usuario: number;
  nombre: string;
  apellido: string;
  num_documento: string;
  correo: string | null;
  activo: boolean;
  id_rol: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  rol?: Rol | null;
}

export interface CrearEstudianteRequest {
  nombre: string;
  apellido: string;
  num_documento: string;
  id_rol: number;
  activo?: boolean;
}

export interface CrearEstudianteResponse {
  message: string;
  data: Estudiante;
}

export interface ObtenerEstudiantesResponse {
  message: string;
  data: Estudiante[];
}

export type ActualizarEstudianteRequest = Partial<{
  nombre: string;
  apellido: string;
  num_documento: string;
  correo: string | null;
  activo: boolean;
  id_rol: number;
}>;

export interface ActualizarEstudianteResponse {
  message: string;
  data: Estudiante;
}
