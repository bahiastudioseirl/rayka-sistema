// Esquemas para las respuestas de la API de estudiantes

// Login de estudiante
export interface LoginEstudianteResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  usuario: {
    id: number;
    nombre: string;
    apellido: string;
    num_documento: string;
    rol: {
      id_rol: number;
      nombre: string;
      created_at: string;
      updated_at: string;
    };
  };
  capacitacion: {
    id: number;
    duracion_examen_min: number;
    max_intentos: number;
    estado: string;
    fecha_creacion: string;
    solicitante: {
      nombre: string;
      apellido: string;
      cargo: string;
      empresa: {
        nombre: string;
      };
    };
    cursos: Array<{
      id: number;
      titulo: string;
      contenido: string;
      tipo_contenido: string;
      fecha_creacion: string;
    }>;
  };
}

// Cursos de la capacitación
export interface CursosCapacitacionResponse {
  success: boolean;
  message: string;
  data: {
    capacitacion: {
      id_capacitacion: number;
      duracion_examen_min: number;
      max_intentos: number;
      estado: string;
      fecha_creacion: string;
      solicitante: {
        nombre: string;
        apellido: string;
        cargo: string;
      };
      empresa: {
        nombre: string;
      };
    };
    cursos: CursoEstudiante[];
    total_cursos: number;
  };
}

export interface CursoEstudiante {
  id_curso: number;
  titulo: string;
  descripcion: string;
  url_imagen: string;
  contenido: string;
  tipo_contenido: string;
  fecha_creacion: string;
  creado_por: {
    nombre: string;
    apellido: string;
  };
}

// Detalle de curso con examen
export interface CursoDetalleResponse {
  success: boolean;
  message: string;
  data: {
    id_curso: number;
    titulo: string;
    descripcion: string;
    url_imagen: string;
    contenido: string;
    tipo_contenido: string;
    activo: number;
    fecha_creacion: string;
    creado_por: {
      id_usuario: number;
      nombre: string;
      apellido: string;
    };
    examen: {
      id_examen: number;
      titulo: string;
      total_preguntas: number;
      preguntas: Pregunta[];
    };
  };
}

export interface Pregunta {
  id_pregunta: number;
  texto: string;
  respuestas: Respuesta[];
}

export interface Respuesta {
  id_respuesta: number;
  texto: string;
}
