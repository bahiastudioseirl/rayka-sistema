import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { ObtenerEstudiantesResponse } from '../schemas/EstudianteSchemas';

export const obtenerEstudiantes = async (): Promise<ObtenerEstudiantesResponse> => {
  const response = await axiosWithoutMultipart.get<ObtenerEstudiantesResponse>(
    'usuarios/ver-estudiantes' 
  );
  return response.data;
};
