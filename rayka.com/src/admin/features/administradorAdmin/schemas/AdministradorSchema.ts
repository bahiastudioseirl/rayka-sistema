export interface Rol {
  id_rol: number;
  nombre: string;
  created_at: string;
  updated_at: string;
}

export interface Administrador {
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

export interface CrearAdministradorRequest {
  nombre: string;
  apellido: string;
  num_documento: string;
  correo: string;
  contrasenia: string;
  id_rol: number;
  activo?: boolean;
}

export interface CrearAdministradorResponse {
  message: string;
  data: Administrador;
}

export interface ObtenerAdministradoresResponse {
  message: string;
  data: Administrador[];
}

export type ActualizarAdministradorRequest = Partial<{
  nombre: string;
  apellido: string;
  num_documento: string;
  correo: string | null;
  activo: boolean;
  id_rol: number;
}>;

export interface ActualizarAdministradorResponse {
  message: string;
  data: Administrador;
}

export interface CambiarContraseniaRequest {
  contrasenia_actual: string;
  contrasenia_nueva: string;
}

export interface CambiarContraseniaResponse {
  message: string;
  data: Administrador;
}
