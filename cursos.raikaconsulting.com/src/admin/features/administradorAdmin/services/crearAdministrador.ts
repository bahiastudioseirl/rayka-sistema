import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { CrearAdministradorRequest, CrearAdministradorResponse } from '../schemas/AdministradorSchema';

export const crearAdministrador = async (
  data: CrearAdministradorRequest
): Promise<CrearAdministradorResponse> => {
  const response = await axiosWithoutMultipart.post<CrearAdministradorResponse>( 'usuarios/administrador',  data );
  return response.data;
};
