import { axiosEstudiante } from '../../../api/axiosInstance';
import type { CursosCapacitacionResponse } from '../schemas/EstudianteSchema';


export const obtenerCursosEstudiante = async (): Promise<CursosCapacitacionResponse> => {
  try {
    const response = await axiosEstudiante.get<CursosCapacitacionResponse>(
      `/estudiantes/cursos`
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión con el servidor');
  }
};
