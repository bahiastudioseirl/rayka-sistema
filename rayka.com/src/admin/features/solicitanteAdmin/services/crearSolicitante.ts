import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { CrearSolicitanteRequest, CrearSolicitanteResponse } from '../schemas/SolicitanteSchema';

export const crearSolicitante = async (data: CrearSolicitanteRequest): Promise<CrearSolicitanteResponse> => {
  const response = await axiosWithoutMultipart.post<CrearSolicitanteResponse>('solicitantes', data);

  if (response.data.data?.solicitante) {
    const solicitante = response.data.data.solicitante;
    // @ts-ignore
    if ('id' in solicitante && !('id_solicitante' in solicitante)) {
      // @ts-ignore - Transformar id a id_solicitante
      solicitante.id_solicitante = solicitante.id;
      // @ts-ignore
      delete solicitante.id;
    }
    // Normalizar empresa.id → empresa.id_empresa
    // @ts-ignore
    if (solicitante.empresa && 'id' in solicitante.empresa && !('id_empresa' in solicitante.empresa)) {
      // @ts-ignore
      solicitante.empresa.id_empresa = solicitante.empresa.id;
      // @ts-ignore
      delete solicitante.empresa.id;
    }
  }
  
  return response.data;
};
