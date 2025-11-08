import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { ObtenerSolicitantesResponse } from '../schemas/SolicitanteSchema';

export const obtenerSolicitantes = async (): Promise<ObtenerSolicitantesResponse> => {
  const response = await axiosWithoutMultipart.get<ObtenerSolicitantesResponse>('solicitantes');


  if (response.data.data && Array.isArray(response.data.data)) {
    response.data.data = response.data.data.map((solicitante: any) => {
  
      if ('id' in solicitante && !('id_solicitante' in solicitante)) {
        solicitante.id_solicitante = solicitante.id;
        delete solicitante.id;
      }
 
      if (solicitante.empresa && 'id' in solicitante.empresa && !('id_empresa' in solicitante.empresa)) {
        solicitante.empresa.id_empresa = solicitante.empresa.id;
        delete solicitante.empresa.id;
      }
      return solicitante;
    });
  }
  
  return response.data;
};
