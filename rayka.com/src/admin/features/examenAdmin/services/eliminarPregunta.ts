import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { EliminarPreguntaResponse } from '../schemas/examenSchema';

export const eliminarPregunta = async (
  idExamen: number,
  idPregunta: number
): Promise<EliminarPreguntaResponse> => {
  
  const response = await axiosWithoutMultipart.delete<EliminarPreguntaResponse>(
    `examenes/${idExamen}/preguntas/${idPregunta}`
  );
  
  return response.data;
};