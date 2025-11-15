import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Marca el video del curso como finalizado
 * @param idCurso - ID del curso
 */
export const marcarVideoFinalizado = async (idCurso: number): Promise<void> => {
  try {
    const token = localStorage.getItem('estudiante_token');
    
    if (!token) {
      throw new Error('No hay sesión activa. Por favor, inicia sesión nuevamente.');
    }

    await axios.patch(
      `${API_BASE_URL}/estudiantes/cursos/${idCurso}/marcar-video-finalizado`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem('estudiante_token');
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      }
      const message = error.response?.data?.message || 'Error al marcar el video como finalizado';
      throw new Error(message);
    }
    throw new Error('Error de conexión con el servidor');
  }
};
