import { axiosWithoutMultipart } from '../../../../api/axiosInstance';

export interface AgregarCursoRequest {
  cursos: number[];
}

export interface AgregarCursoResponse {
  success: boolean;
  message: string;
}

export const agregarCurso = async (
  idCapacitacion: number,
  data: AgregarCursoRequest
): Promise<AgregarCursoResponse> => {
  const response = await axiosWithoutMultipart.post<AgregarCursoResponse>(
    `capacitaciones/${idCapacitacion}/cursos/agregar`,
    data
  );
  return response.data;
};