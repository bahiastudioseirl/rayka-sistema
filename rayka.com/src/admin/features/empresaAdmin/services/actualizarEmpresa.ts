import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { CrearEmpresaRequest, CrearEmpresaResponse } from '../schemas/EmpresaSchema';

export const actualizarEmpresa = async (
  id: number, 
  data: CrearEmpresaRequest
): Promise<CrearEmpresaResponse> => {
  const response = await axiosWithoutMultipart.patch<CrearEmpresaResponse>(`empresas/${id}`, data);
  if (response.data.data?.empresa) {
    const empresa = response.data.data.empresa;
    if ('id' in empresa && !('id_empresa' in empresa)) {
      // @ts-ignore - Transformar id a id_empresa
      empresa.id_empresa = empresa.id;
      // @ts-ignore
      delete empresa.id;
    }
  }
  
  return response.data;
};
