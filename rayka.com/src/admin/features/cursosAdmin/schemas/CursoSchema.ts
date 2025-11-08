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
  tipo_contenido: TipoContenido;
  contenido: string;
  activo: boolean;
  fecha_creacion: string;
  creado_por: number;
  creador: Creador;
}

export interface CrearCursoRequest {
  titulo: string;
  tipo_contenido: TipoContenido;
  contenido?: string; // Para link
  archivo?: File; // Para carga_archivo
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
