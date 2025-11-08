import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { ObtenerSolicitantesResponse } from '../schemas/SolicitanteSchema';

export const obtenerSolicitantes = async (): Promise<ObtenerSolicitantesResponse> => {
  const response = await axiosWithoutMultipart.get<ObtenerSolicitantesResponse>('solicitantes');
  return response.data;
};
