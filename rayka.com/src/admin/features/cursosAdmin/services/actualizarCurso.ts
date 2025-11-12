import { axiosInstance } from '../../../../api/axiosInstance';
import type { ActualizarCursoRequest, CrearCursoResponse } from '../schemas/CursoSchema';

export const actualizarCurso = async (
  id: number,
  data: ActualizarCursoRequest
): Promise<CrearCursoResponse> => {
  const formData = new FormData();
  
  formData.append('titulo', data.titulo);
  formData.append('tipo_contenido', data.tipo_contenido);
  
  if (data.descripcion) {
    formData.append('descripcion', data.descripcion);
  }
  
  if (data.url_imagen) {
    formData.append('imagen', data.url_imagen); // Backend espera 'imagen', no 'url_imagen'
  }
  
  if (data.tipo_contenido === 'link' && data.contenido) {
    formData.append('contenido', data.contenido);
  } else if (data.tipo_contenido === 'carga_archivo' && data.archivo) {
    formData.append('archivo', data.archivo);
  }

  const response = await axiosInstance.post<CrearCursoResponse>(`cursos/${id}`, formData);
  return response.data;
};
