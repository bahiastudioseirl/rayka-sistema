import { axiosEstudiante } from '../../../api/axiosInstance';

export interface IntentoExamen {
  id_progreso: number;
  fecha_intento: string;
  nota: number;
  aprobado: boolean;
  tiempo_empleado?: number;
  respuestas_correctas?: number;
  total_preguntas?: number;
}

export interface HistorialIntentosResponse {
  success: boolean;
  message: string;
  data: {
    historial_intentos: IntentoExamen[];
    resumen: {
      mejor_puntaje: number | null;
      intentos_usados: number;
      intentos_restantes: number;
      estado: 'aprobado' | 'reprobado' | null;
    };
  };
}


export const obtenerHistorialIntentos = async (idCurso: number): Promise<HistorialIntentosResponse> => {
  try {
    const response = await axiosEstudiante.get<HistorialIntentosResponse>(
      `/estudiantes/cursos/${idCurso}/historial-intentos`
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión con el servidor');
  }
};
