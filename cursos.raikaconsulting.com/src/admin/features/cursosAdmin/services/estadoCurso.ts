import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { Curso } from '../schemas/CursoSchema';

export interface CambiarEstadoCursoResponse {
  message: string;
  data: Curso;
}

export const cambiarEstadoCurso = async (id: number): Promise<CambiarEstadoCursoResponse> => {

  const response = await axiosWithoutMultipart.patch<CambiarEstadoCursoResponse>(`cursos/${id}/cambiar-estado`);

  return response.data;
};
