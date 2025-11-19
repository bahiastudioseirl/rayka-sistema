import { axiosWithoutMultipart } from '../../../../api/axiosInstance';

import type {ObtenerExamenesResponse,ExamenEnLista,} from '../schemas/ExamenSchema';

type GetExamenesParams = {
  search?: string;
};

export const obtenerExamenes = async (
  params: GetExamenesParams
): Promise<ExamenEnLista[]> => {
  
  const response = await axiosWithoutMultipart.get<ObtenerExamenesResponse>(
    'examenes',
    {
      params: {
        titulo: params.search,
      },
    }
  );

  return response.data.data.data;
};