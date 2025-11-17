import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { Estudiante } from '../schemas/EstudianteSchemas';

export interface CambiarEstadoEstudianteResponse {
  message: string;
  data: Estudiante;
}

export const cambiarEstadoEstudiante = async (id: number): Promise<CambiarEstadoEstudianteResponse> => {

  const response = await axiosWithoutMultipart.patch<CambiarEstadoEstudianteResponse>(`usuarios/${id}/cambiar-estado`);

  return response.data;
};
