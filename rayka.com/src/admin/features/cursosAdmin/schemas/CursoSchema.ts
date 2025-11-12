export type TipoContenido = 'link' | 'carga_archivo';

export interface Creador {
  id_usuario: number;
  nombre: string;
  apellido: string;
  num_documento: string;
  correo: string;
  activo: boolean;
  id_rol: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface Curso {
  id_curso: number;
  titulo: string;
  descripcion: string;
  url_imagen: string;
  tipo_contenido: TipoContenido;
  contenido: string;
  activo: boolean;
  fecha_creacion: string;
  creado_por: number;
  creador: Creador;
}

export interface CrearCursoRequest {
  titulo: string;
  descripcion: string;
  url_imagen?: File; // Al crear, enviamos un File
  tipo_contenido: TipoContenido;
  contenido?: string; 
  archivo?: File; 
}

export interface ActualizarCursoRequest {
  titulo: string;
  tipo_contenido: TipoContenido;
  contenido?: string; 
  archivo?: File; 
  url_imagen?: File;
  descripcion?: string;
}

export interface CrearCursoResponse {
  success: boolean;
  message: string;
  data: {
    curso: Curso;
  };
}

export interface ObtenerCursosResponse {
  message: string;
  data: Curso[];
}
