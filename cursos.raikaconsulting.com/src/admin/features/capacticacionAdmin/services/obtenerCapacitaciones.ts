import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { ObtenerCapacitacionesResponse } from '../schemas/CapacitacionSchema';

export const obtenerCapacitaciones = async (): Promise<ObtenerCapacitacionesResponse> => {
  const response = await axiosWithoutMultipart.get<ObtenerCapacitacionesResponse>('capacitaciones');
  return response.data;
};
