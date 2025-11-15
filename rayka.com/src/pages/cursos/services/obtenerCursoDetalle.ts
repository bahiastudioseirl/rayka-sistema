import axios from 'axios';
import type { CursoDetalleResponse } from '../schemas/EstudianteSchema';

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Obtiene el detalle de un curso específico con su examen asociado
 * Requiere token JWT en el header Authorization
 * @param idCurso - ID del curso a obtener
 */
export const obtenerCursoDetalle = async (idCurso: number): Promise<CursoDetalleResponse> => {
  try {
    // Obtener el token del estudiante del localStorage
    const token = localStorage.getItem('estudiante_token');
    
    if (!token) {
      throw new Error('No hay sesión activa. Por favor, inicia sesión nuevamente.');
    }

    const response = await axios.get<CursoDetalleResponse>(
      `${API_BASE_URL}/estudiantes/cursos/${idCurso}`,
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
        // Token expirado o inválido
        localStorage.removeItem('estudiante_token');
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      }
      const message = error.response?.data?.message || 'Error al obtener el detalle del curso';
      throw new Error(message);
    }
    throw new Error('Error de conexión con el servidor');
  }
};
