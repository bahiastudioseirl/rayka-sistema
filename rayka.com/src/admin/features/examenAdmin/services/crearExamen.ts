import { axiosWithoutMultipart } from '../../../../api/axiosInstance';

import type {
    CrearExamenRequest,
    CrearExamenResponse,
} from '../schemas/ExamenSchema';

export const crearExamen = async (
    data: CrearExamenRequest): Promise<CrearExamenResponse> => {
        const response = await axiosWithoutMultipart.post<CrearExamenResponse>(
        'examenes',
        data
    );

    return response.data;
};