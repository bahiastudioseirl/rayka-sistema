import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { Capacitacion } from '../schemas/CapacitacionSchema';

export interface CambiarEstadoCapacitacionResponse {
  message: string;
  data: Capacitacion;
}

export const cambiarEstadoCapacitacion = async (id: number): Promise<CambiarEstadoCapacitacionResponse> => {
  const response = await axiosWithoutMultipart.patch<CambiarEstadoCapacitacionResponse>(`capacitaciones/${id}/cambiar-estado`);
  return response.data;
};
