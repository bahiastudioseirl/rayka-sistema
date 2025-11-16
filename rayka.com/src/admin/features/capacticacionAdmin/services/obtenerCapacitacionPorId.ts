import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { ObtenerCapacitacionPorIdResponse } from '../schemas/CapacitacionSchema';

export const obtenerCapacitacionPorId = async (idCapacitacion: number): Promise<ObtenerCapacitacionPorIdResponse> => {
  const response = await axiosWithoutMultipart.get<ObtenerCapacitacionPorIdResponse>(`capacitaciones/${idCapacitacion}`);
  return response.data;
};
