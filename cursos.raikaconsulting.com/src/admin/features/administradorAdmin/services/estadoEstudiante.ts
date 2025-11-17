import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { Administrador } from '../schemas/AdministradorSchema';

export interface CambiarEstadoAdministradorResponse {
  message: string;
  data: Administrador;
}

export const cambiarEstadoAdministrador = async (id: number): Promise<CambiarEstadoAdministradorResponse> => {

  const response = await axiosWithoutMultipart.patch<CambiarEstadoAdministradorResponse>(`usuarios/${id}/cambiar-estado`);

  return response.data;
};
