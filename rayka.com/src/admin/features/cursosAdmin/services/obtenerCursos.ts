import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { ObtenerCursosResponse } from '../schemas/CursoSchema';

export const obtenerCursos = async (): Promise<ObtenerCursosResponse> => {
  const response = await axiosWithoutMultipart.get<ObtenerCursosResponse>('cursos');
  return response.data;
};
