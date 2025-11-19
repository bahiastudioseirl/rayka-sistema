import { axiosWithoutMultipart } from '../../../../api/axiosInstance';

import type {
  ActualizarExamenRequest,
  ActualizarExamenResponse,
} from '../schemas/ExamenSchema';

export const actualizarExamen = async (
  idExamen: number,
  data: ActualizarExamenRequest 
): Promise<ActualizarExamenResponse> => {
  const response = await axiosWithoutMultipart.patch<ActualizarExamenResponse>(
    `examenes/${idExamen}`, 
    data 
  );
  return response.data;
};