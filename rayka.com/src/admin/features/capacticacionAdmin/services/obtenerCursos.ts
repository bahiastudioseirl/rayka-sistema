import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { ObtenerCursosResponse } from '../schemas/CapacitacionSchema';

export const obtenerCursos = async (): Promise<ObtenerCursosResponse> => {
  const response = await axiosWithoutMultipart.get<ObtenerCursosResponse>('cursos');
  return response.data;
};
