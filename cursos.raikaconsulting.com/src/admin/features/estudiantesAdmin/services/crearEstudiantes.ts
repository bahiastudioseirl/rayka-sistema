
import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { CrearEstudianteRequest, CrearEstudianteResponse } from '../schemas/EstudianteSchemas';

export const crearEstudiante = async (
  data: CrearEstudianteRequest
): Promise<CrearEstudianteResponse> => {
  const response = await axiosWithoutMultipart.post<CrearEstudianteResponse>( 'usuarios/estudiante',  data );
  return response.data;
};
