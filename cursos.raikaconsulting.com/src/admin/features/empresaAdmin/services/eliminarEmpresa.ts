import { axiosWithoutMultipart } from '../../../../api/axiosInstance';

export interface EliminarEmpresaResponse {
  success: boolean;
  message: string;
}

export const eliminarEmpresa = async (id: number): Promise<EliminarEmpresaResponse> => {
  const response = await axiosWithoutMultipart.delete<EliminarEmpresaResponse>(`empresas/${id}`);
  return response.data;
};
