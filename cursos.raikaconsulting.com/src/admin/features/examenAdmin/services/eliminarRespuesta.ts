import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { EliminarRespuestaResponse } from '../schemas/examenSchema';

export const eliminarRespuesta = async (
  idExamen: number,
  idPregunta: number
): Promise<EliminarRespuestaResponse> => {
  
  const response = await axiosWithoutMultipart.delete<EliminarRespuestaResponse>(
    `examenes/${idExamen}/preguntas/${idPregunta}`
  );
  
  return response.data;
};