
export interface Respuesta {
  id_respuesta: number;
  texto: string;
  es_correcta: boolean;
}

export interface Pregunta {
  id_pregunta: number;
  texto: string;
  respuestas: Respuesta[];
}

export interface CursoResumen {
  id_curso: number;
  titulo: string;
}

export interface Examen {
  id_examen: number;
  titulo: string;
  id_curso: number;
  curso: CursoResumen;
  total_preguntas: number;
  preguntas: Pregunta[];
}

export interface RespuestaCrearRequest {
  texto: string;
  es_correcta: boolean;
}

export interface PreguntaCrearRequest {
  texto: string;
  respuestas: RespuestaCrearRequest[];
}

export interface CrearExamenRequest {
  titulo: string;
  id_curso: number;
  preguntas: PreguntaCrearRequest[];
}

export interface CrearExamenResponse {
  success: boolean;
  message: string;
  data: Examen;
}