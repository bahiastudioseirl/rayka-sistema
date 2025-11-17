import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type {
  AgregarPreguntaRequest,
  AgregarPreguntaResponse,
} from '../schemas/examenSchema';

export const agregarPregunta = async (
  idExamen: number,
  preguntaData: AgregarPreguntaRequest
): Promise<AgregarPreguntaResponse> => {
  const response = await axiosWithoutMultipart.post<AgregarPreguntaResponse>(
    `examenes/${idExamen}/preguntas`,
    { preguntas: [preguntaData] } 
  );

  return response.data;
};