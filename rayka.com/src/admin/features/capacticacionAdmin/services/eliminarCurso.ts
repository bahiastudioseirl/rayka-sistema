import { axiosWithoutMultipart } from '../../../../api/axiosInstance';

export interface EliminarCursoRequest {
  cursos: number[];
}

export interface EliminarCursoResponse {
  success: boolean;
  message: string;
}

export const eliminarCurso = async (
  idCapacitacion: number,
  data: EliminarCursoRequest
): Promise<EliminarCursoResponse> => {
  const response = await axiosWithoutMultipart.delete<EliminarCursoResponse>(
    `capacitaciones/${idCapacitacion}/cursos/eliminar`,
    { data }
  );
  return response.data;
};