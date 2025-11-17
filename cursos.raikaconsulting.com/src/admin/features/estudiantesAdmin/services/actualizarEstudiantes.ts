import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type {ActualizarEstudianteRequest, ActualizarEstudianteResponse,} from '../schemas/EstudianteSchemas';

export const actualizarEstudiante = async (
  id_usuario: number,
  data: ActualizarEstudianteRequest
): Promise<ActualizarEstudianteResponse> => { const response = await axiosWithoutMultipart.patch<ActualizarEstudianteResponse>(
 `usuarios/${id_usuario}`,
    data
  );
  return response.data;
};
