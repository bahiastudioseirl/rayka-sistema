import { axiosInstance } from '../../../../api/axiosInstance';
import type { CrearCursoRequest, CrearCursoResponse } from '../schemas/CursoSchema';

export const crearCurso = async (data: CrearCursoRequest): Promise<CrearCursoResponse> => {
  const formData = new FormData();
  formData.append('titulo', data.titulo);
  formData.append('tipo_contenido', data.tipo_contenido);
  if (data.tipo_contenido === 'link' && data.contenido) {
    formData.append('contenido', data.contenido);
  } else if (data.tipo_contenido === 'carga_archivo' && data.archivo) {
    formData.append('archivo', data.archivo);
  }
  const response = await axiosInstance.post<CrearCursoResponse>('cursos', formData);
  return response.data;
};
