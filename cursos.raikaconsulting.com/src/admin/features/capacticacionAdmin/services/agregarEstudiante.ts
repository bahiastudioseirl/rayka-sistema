import { axiosWithoutMultipart } from '../../../../api/axiosInstance';

export interface AgregarEstudianteRequest {
  usuarios_estudiantes: number[];
}

export interface AgregarEstudianteResponse {
  success: boolean;
  message: string;
}

export const agregarEstudiante = async (
  idCapacitacion: number,
  data: AgregarEstudianteRequest
): Promise<AgregarEstudianteResponse> => {
  const response = await axiosWithoutMultipart.post<AgregarEstudianteResponse>(
    `capacitaciones/${idCapacitacion}/estudiantes/agregar`,
    data
  );
  return response.data;
};