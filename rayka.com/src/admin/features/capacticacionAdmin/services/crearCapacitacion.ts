import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { CrearCapacitacionRequest, CrearCapacitacionResponse } from '../schemas/CapacitacionSchema';

export const crearCapacitacion = async (data: CrearCapacitacionRequest): Promise<CrearCapacitacionResponse> => {
  const response = await axiosWithoutMultipart.post<CrearCapacitacionResponse>('capacitaciones', data);
  return response.data;
};
