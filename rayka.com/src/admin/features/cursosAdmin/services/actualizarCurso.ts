import { axiosInstance } from '../../../../api/axiosInstance';
import type { CrearCursoRequest, CrearCursoResponse } from '../schemas/CursoSchema';

export const actualizarCurso = async (
  id: number,
  data: CrearCursoRequest
): Promise<CrearCursoResponse> => {
  const formData = new FormData();
  
  formData.append('titulo', data.titulo);
  formData.append('tipo_contenido', data.tipo_contenido);
  
  if (data.tipo_contenido === 'link' && data.contenido) {
    formData.append('contenido', data.contenido);
  } else if (data.tipo_contenido === 'carga_archivo' && data.archivo) {
    formData.append('archivo', data.archivo);
  }
  
  console.log("📤 Actualizando curso ID:", id);
  const response = await axiosInstance.post<CrearCursoResponse>(`cursos/${id}`, formData);
  console.log("📥 Respuesta raw del backend:", response);
  console.log("📥 response.data:", response.data);
  
  // Normalizar la respuesta: convertir 'id' a 'id_curso' si es necesario
  if (response.data.data?.curso) {
    const curso = response.data.data.curso;
    if ('id' in curso && !('id_curso' in curso)) {
      // @ts-ignore - Transformar id a id_curso
      curso.id_curso = curso.id;
      // @ts-ignore
      delete curso.id;
      console.log("🔧 Curso normalizado (id → id_curso):", curso);
    }
    
    // Normalizar creador: convertir 'id' a 'id_usuario' si es necesario
    if (curso.creador && 'id' in curso.creador && !('id_usuario' in curso.creador)) {
      // @ts-ignore
      curso.creador.id_usuario = curso.creador.id;
      // @ts-ignore
      delete curso.creador.id;
    }
  }
  
  return response.data;
};
