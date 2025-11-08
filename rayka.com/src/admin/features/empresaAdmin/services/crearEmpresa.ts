import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { CrearEmpresaRequest, CrearEmpresaResponse } from '../schemas/EmpresaSchema';

export const crearEmpresa = async (data: CrearEmpresaRequest): Promise<CrearEmpresaResponse> => {
  const response = await axiosWithoutMultipart.post<CrearEmpresaResponse>('empresas', data);
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
