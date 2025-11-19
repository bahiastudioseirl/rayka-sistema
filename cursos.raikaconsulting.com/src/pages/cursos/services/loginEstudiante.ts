import { axiosEstudiante } from '../../../api/axiosInstance';
import type { LoginEstudianteResponse } from '../schemas/EstudianteSchema';

export const loginEstudiante = async (
  codigoCapacitacion: string,
  numDocumento: string
): Promise<LoginEstudianteResponse> => {
  try {
    const response = await axiosEstudiante.post<LoginEstudianteResponse>(
      `/estudiantes/login/${codigoCapacitacion}`,
      { num_documento: numDocumento }
    );

    // Guardar el token específico del estudiante
    if (response.data?.access_token) {
      localStorage.setItem('estudiante_token', response.data.access_token);
      // Remover authToken para evitar conflictos
      localStorage.removeItem('authToken');
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión con el servidor');
  }
};
