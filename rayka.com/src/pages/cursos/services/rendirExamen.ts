import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

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

/**
 * Envía las respuestas del examen para ser calificado
 * @param idCurso - ID del curso
 * @param respuestas - Array de respuestas del estudiante
 */
export const rendirExamen = async (
  idCurso: number,
  respuestas: RespuestaExamen[]
): Promise<RendirExamenResponse> => {
  try {
    const token = localStorage.getItem('estudiante_token');
    
    if (!token) {
      throw new Error('No hay sesión activa. Por favor, inicia sesión nuevamente.');
    }

    const response = await axios.post<RendirExamenResponse>(
      `${API_BASE_URL}/estudiantes/cursos/${idCurso}/rendir-examen`,
      { respuestas },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem('estudiante_token');
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      }
      const message = error.response?.data?.message || 'Error al rendir el examen';
      throw new Error(message);
    }
    throw new Error('Error de conexión con el servidor');
  }
};
