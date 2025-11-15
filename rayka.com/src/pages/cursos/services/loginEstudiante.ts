import axios from 'axios';
import type { LoginEstudianteResponse } from '../schemas/EstudianteSchema';

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Login de estudiante con DNI en una capacitación específica
 * @param codigoCapacitacion - Código único de la capacitación (ej: cap_691763fb7376d_1763140603)
 * @param numDocumento - DNI del estudiante
 */
export const loginEstudiante = async (
  codigoCapacitacion: string,
  numDocumento: string
): Promise<LoginEstudianteResponse> => {
  try {
    const response = await axios.post<LoginEstudianteResponse>(
      `${API_BASE_URL}/estudiantes/login/${codigoCapacitacion}`,
      { num_documento: numDocumento }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      throw new Error(message);
    }
    throw new Error('Error de conexión con el servidor');
  }
};
