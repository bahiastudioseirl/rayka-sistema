import { axiosEstudiante } from '../../../api/axiosInstance';

export interface RespuestaExamen {
  id_pregunta: number;
  id_respuesta: number;
}

export interface RendirExamenRequest {
  respuestas: RespuestaExamen[];
}

export interface RendirExamenResponse {
  success: boolean;
  message: string;
  data: {
    nota: number;
    aprobado: boolean;
    respuestas_correctas: number;
    total_preguntas: number;
    intentos_restantes: number;
  };
}

export const rendirExamen = async (
  idCurso: number,
  respuestas: RespuestaExamen[]
): Promise<RendirExamenResponse> => {
  try {
    const response = await axiosEstudiante.post<RendirExamenResponse>(
      `/estudiantes/cursos/${idCurso}/rendir-examen`,
      { respuestas }
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión con el servidor');
  }
};
