import { axiosEstudiante } from '../../../api/axiosInstance';
import type { CursoDetalleResponse } from '../schemas/EstudianteSchema';


export const obtenerCursoDetalle = async (idCurso: number): Promise<CursoDetalleResponse> => {
  try {
    const response = await axiosEstudiante.get<CursoDetalleResponse>(
      `/estudiantes/cursos/${idCurso}`
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión con el servidor');
  }
};
