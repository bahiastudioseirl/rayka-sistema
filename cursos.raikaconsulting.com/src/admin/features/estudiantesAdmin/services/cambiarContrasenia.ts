import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type {
  CambiarContraseniaRequest,
  CambiarContraseniaResponse,
} from '../schemas/EstudianteSchemas';

export const cambiarContrasenia = async (
  id_usuario: number,
  data: CambiarContraseniaRequest
): Promise<CambiarContraseniaResponse> => {
  const response = await axiosWithoutMultipart.patch<CambiarContraseniaResponse>(
    `usuarios/${id_usuario}/actualizar-contrasenia`,
    data
  );
  return response.data;
};
