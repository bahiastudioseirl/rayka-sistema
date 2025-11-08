import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { CrearSolicitanteRequest, CrearSolicitanteResponse } from '../schemas/SolicitanteSchema';

export const actualizarSolicitante = async (
  id: number,
  data: CrearSolicitanteRequest
): Promise<CrearSolicitanteResponse> => {
  const response = await axiosWithoutMultipart.patch<CrearSolicitanteResponse>(`solicitantes/${id}`, data);
  return response.data;
};
