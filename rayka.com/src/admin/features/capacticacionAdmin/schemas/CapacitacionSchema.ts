import type { Solicitante } from '../../solicitanteAdmin/schemas/SolicitanteSchema';

export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  num_documento: string;
  estado: string;
}

export interface Curso {
  id_curso: number;
  titulo: string;
  contenido: string;
  tipo_contenido: string;
  activo: boolean;
  fecha_creacion: string;
}

export interface Capacitacion {
  id_capacitacion: number;
  duracion_examen_min: number;
  max_intentos: number;
  link_login_unico: string;
  fecha_creacion: string;
  estado: string;
  id_solicitante: number;
  solicitante?: Solicitante;
  usuarios_estudiantes?: Usuario[];
  cursos?: Curso[];
}

export interface CrearCapacitacionRequest {
  duracion_examen_min: number;
  max_intentos: number;
  id_solicitante: number;
  usuarios_estudiantes: number[];
  cursos: number[];
}

export interface CrearCapacitacionResponse {
  success: boolean;
  message: string;
  data: {
    capacitacion: Capacitacion;
    usuarios_asignados: Usuario[];
    cursos_asignados: Curso[];
    solicitante: Solicitante;
    resumen: {
      total_estudiantes: number;
      total_cursos: number;
      link_acceso_completo: string;
      codigo_unico: string;
      fecha_creacion: string;
      estado: string;
    };
  };
}

export interface CapacitacionConDetalles {
  capacitacion: {
    id_capacitacion: number;
    duracion_examen_min: number;
    max_intentos: number;
    link_login_unico: string;
    fecha_creacion: string;
    estado: string;
    id_solicitante: number;
  };
  resumen: {
    total_estudiantes: number;
    total_cursos: number;
    codigo_unico: string;
    fecha_creacion: string;
    estado: string;
  };
  solicitante: Solicitante;
}

export interface ObtenerCapacitacionesResponse {
  success: boolean;
  data: CapacitacionConDetalles[];
}

export interface ObtenerUsuariosResponse {
  success: boolean;
  message: string;
  data: Usuario[];
}

export interface ObtenerCursosResponse {
  success: boolean;
  message: string;
  data: Curso[];
}
