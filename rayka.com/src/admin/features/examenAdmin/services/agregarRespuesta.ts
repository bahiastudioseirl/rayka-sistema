import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type {
  AgregarRespuestasRequest,
  AgregarRespuestasResponse,
} from '../schemas/examenSchema';

export const agregarRespuestas = async (
  idExamen: number,
  idPregunta: number,
  data: AgregarRespuestasRequest
): Promise<AgregarRespuestasResponse> => {
  
  const response = await axiosWithoutMultipart.post<AgregarRespuestasResponse>(
    `examenes/${idExamen}/preguntas/${idPregunta}/respuestas`,
    data 
  );

  return response.data;
};