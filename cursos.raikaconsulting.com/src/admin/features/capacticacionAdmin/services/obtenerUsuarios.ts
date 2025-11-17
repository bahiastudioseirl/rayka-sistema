import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { ObtenerUsuariosResponse } from '../schemas/CapacitacionSchema';

export const obtenerUsuarios = async (): Promise<ObtenerUsuariosResponse> => {
  const response = await axiosWithoutMultipart.get<ObtenerUsuariosResponse>('usuarios/ver-estudiantes');
  return response.data;
};
