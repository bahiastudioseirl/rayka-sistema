import { axiosWithoutMultipart } from '../../../../api/axiosInstance';

export interface EliminarEstudianteRequest {
  usuarios_estudiantes: number[];
}

export interface EliminarEstudianteResponse {
  success: boolean;
  message: string;
}

export const eliminarEstudiante = async (
  idCapacitacion: number,
  data: EliminarEstudianteRequest
): Promise<EliminarEstudianteResponse> => {
  const response = await axiosWithoutMultipart.delete<EliminarEstudianteResponse>(
    `capacitaciones/${idCapacitacion}/estudiantes/eliminar`,
    { data }
  );
  return response.data;
};