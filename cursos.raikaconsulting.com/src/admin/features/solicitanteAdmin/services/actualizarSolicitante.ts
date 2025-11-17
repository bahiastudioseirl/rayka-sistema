import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { ActualizarSolicitanteRequest, CrearSolicitanteResponse } from '../schemas/SolicitanteSchema';

export const actualizarSolicitante = async (
  id: number,
  data: ActualizarSolicitanteRequest
): Promise<CrearSolicitanteResponse> => {
  const response = await axiosWithoutMultipart.patch<CrearSolicitanteResponse>(`solicitantes/${id}`, data);
  return response.data;
};
