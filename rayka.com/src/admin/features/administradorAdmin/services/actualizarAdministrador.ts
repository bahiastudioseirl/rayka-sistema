import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type {ActualizarAdministradorRequest, ActualizarAdministradorResponse,} from '../schemas/AdministradorSchema';

export const actualizarAdministrador = async (
  id_usuario: number,
  data: ActualizarAdministradorRequest
): Promise<ActualizarAdministradorResponse> => { const response = await axiosWithoutMultipart.patch<ActualizarAdministradorResponse>(
 `usuarios/${id_usuario}`,
    data
  );
  return response.data;
};
