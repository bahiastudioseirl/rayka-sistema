import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { CrearSolicitanteRequest, CrearSolicitanteResponse } from '../schemas/SolicitanteSchema';

export const crearSolicitante = async (data: CrearSolicitanteRequest): Promise<CrearSolicitanteResponse> => {
  const response = await axiosWithoutMultipart.post<CrearSolicitanteResponse>('solicitantes', data);
  return response.data;
};
