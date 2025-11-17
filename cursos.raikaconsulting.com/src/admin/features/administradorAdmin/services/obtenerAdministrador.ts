import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { ObtenerAdministradoresResponse } from '../schemas/AdministradorSchema';

export const obtenerAdministradores = async (): Promise<ObtenerAdministradoresResponse> => {
  const response = await axiosWithoutMultipart.get<ObtenerAdministradoresResponse>(
    'usuarios/ver-administradores' 
  );
  return response.data;
};
