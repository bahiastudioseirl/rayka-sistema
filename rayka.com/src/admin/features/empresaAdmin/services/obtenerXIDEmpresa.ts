import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { ObtenerEmpresaResponse } from '../schemas/EmpresaSchema';

export const obtenerEmpresaXID = async (
  id: number
): Promise<ObtenerEmpresaResponse> => {
  const response = await axiosWithoutMultipart.get<ObtenerEmpresaResponse>(`empresas/${id}`);
  return response.data;
};