import { axiosEstudiante } from '../../../api/axiosInstance';

export interface MarcarVideoFinalizadoResponse {
  success: boolean;
  message: string;
  data: {
    id_progreso: number;
    video_finalizado: number;
    completado: number;
    nota: number | null;
    intentos_usados: number;
  };
}

export const marcarVideoFinalizado = async (idCurso: number): Promise<MarcarVideoFinalizadoResponse> => {
  try {
    const response = await axiosEstudiante.patch<MarcarVideoFinalizadoResponse>(
      `/estudiantes/cursos/${idCurso}/marcar-video-finalizado`,
      {}
    );
    
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión con el servidor');
  }
};
