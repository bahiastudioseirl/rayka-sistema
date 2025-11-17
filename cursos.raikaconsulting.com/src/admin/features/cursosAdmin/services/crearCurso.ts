import { axiosInstance } from '../../../../api/axiosInstance';
import type { CrearCursoRequest, CrearCursoResponse } from '../schemas/CursoSchema';
const url_data = "http://localhost:8000/";

export const crearCurso = async (data: CrearCursoRequest): Promise<CrearCursoResponse> => {
  const formData = new FormData();
  formData.append('titulo', data.titulo);
  formData.append('tipo_contenido', data.tipo_contenido);
  formData.append('descripcion', data.descripcion);
  
  if (data.url_imagen) { 
    formData.append('imagen', data.url_imagen);
  }
  
  if (data.tipo_contenido === 'link' && data.contenido) {
    formData.append('contenido', data.contenido);
  } else if (data.tipo_contenido === 'carga_archivo' && data.archivo) {
    formData.append('archivo', data.archivo);
  }
  const response = await axiosInstance.post<CrearCursoResponse>('cursos', formData);
  return response.data;
};
