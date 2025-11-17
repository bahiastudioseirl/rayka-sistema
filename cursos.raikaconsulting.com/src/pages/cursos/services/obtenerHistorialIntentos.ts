import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export interface IntentoExamen {
  id_progreso: number;
  fecha_intento: string;
  nota: number;
  aprobado: boolean;
  tiempo_empleado?: number;
  respuestas_correctas?: number;
  total_preguntas?: number;
}

export interface HistorialIntentosResponse {
  success: boolean;
  message: string;
  data: {
    historial_intentos: IntentoExamen[];
    resumen: {
      mejor_puntaje: number | null;
      intentos_usados: number;
      intentos_restantes: number;
      estado: 'aprobado' | 'reprobado' | null;
    };
  };
}

/**
 * Obtiene el historial de intentos de examen para un curso
 * @param idCurso - ID del curso
 */
export const obtenerHistorialIntentos = async (idCurso: number): Promise<HistorialIntentosResponse> => {
  try {
    const token = localStorage.getItem('estudiante_token');
    
    if (!token) {
      throw new Error('No hay sesión activa. Por favor, inicia sesión nuevamente.');
    }

    const response = await axios.get<HistorialIntentosResponse>(
      `${API_BASE_URL}/estudiantes/cursos/${idCurso}/historial-intentos`,
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
      const message = error.response?.data?.message || 'Error al obtener el historial de intentos';
      throw new Error(message);
    }
    throw new Error('Error de conexión con el servidor');
  }
};
