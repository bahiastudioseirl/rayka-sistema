export type TipoContenido = 'link' | 'carga_archivo';

export interface Creador {
  id_usuario: number;
  nombre: string;
  apellido: string;
  num_documento: string;
  correo: string;
  activo: boolean;
  id_rol: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface Curso {
  id_curso: number;
  titulo: string;
  descripcion: string;
  url_imagen: string;
  tipo_contenido: TipoContenido;
  contenido: string;
  activo: boolean;
  fecha_creacion: string;
  creado_por: number;
  creador: Creador;
}

export interface CrearCursoRequest {
  titulo: string;
  descripcion: string;
  url_imagen?: File; // Al crear, enviamos un File
  tipo_contenido: TipoContenido;
  contenido?: string;
  archivo?: File;
}

export interface ActualizarCursoRequest {
  titulo: string;
  tipo_contenido: TipoContenido;
  contenido?: string;
  archivo?: File;
  url_imagen?: File;
  descripcion?: string;
}

export interface CrearCursoResponse {
  success: boolean;
  message: string;
  data: {
    curso: Curso;
  };
}

export interface ObtenerCursosResponse {
  message: string;
  data: Curso[];
}

// Validaciones que coinciden con el backend
export interface ValidationError {
  field: string;
  message: string;
}

export const validateCurso = {
  // Validar título (required, min:2, max:255)
  titulo: (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'El título del curso es obligatorio.';
    }
    if (trimmed.length < 2) {
      return 'El título del curso debe tener al menos 2 caracteres.';
    }
    if (trimmed.length > 255) {
      return 'El título del curso no puede exceder 255 caracteres.';
    }
    return null;
  },

  // Validar descripción (max:1000)
  descripcion: (value: string): string | null => {
    if (value && value.length > 1000) {
      return 'La descripción no puede exceder 1000 caracteres.';
    }
    return null;
  },

  // Validar contenido (min:10 si existe)
  contenido: (value: string | undefined): string | null => {
    if (value && value.trim().length > 0 && value.trim().length < 10) {
      return 'El contenido del curso debe tener al menos 10 caracteres.';
    }
    return null;
  },

  // Validar imagen (mimes:jpeg,jpg,png,webp, max:10240KB = 10MB)
  imagen: (file: File | null | undefined): string | null => {
    if (!file) return null;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'La imagen debe ser de tipo: jpeg, jpg, png o webp.';
    }

    const maxSizeKB = 10240; // 10MB
    const fileSizeKB = file.size / 1024;
    if (fileSizeKB > maxSizeKB) {
      return 'La imagen no puede exceder 10MB.';
    }

    return null;
  },

  // Validar video (mimes:mp4,avi,mov,wmv,flv,webm,mkv, max:1024000KB = 1GB)
  video: (file: File | null | undefined): string | null => {
    if (!file) return null;

    const validTypes = [
      'video/mp4',
      'video/avi',
      'video/quicktime', // .mov
      'video/x-ms-wmv',  // .wmv
      'video/x-flv',     // .flv
      'video/webm',
      'video/x-matroska' // .mkv
    ];

    if (!validTypes.includes(file.type) && !file.type.startsWith('video/')) {
      return 'El archivo debe ser un video (mp4, avi, mov, wmv, flv, webm, mkv).';
    }

    const maxSizeKB = 1024000; // 1GB
    const fileSizeKB = file.size / 1024;
    if (fileSizeKB > maxSizeKB) {
      return 'El archivo no puede exceder 1GB.';
    }

    return null;
  },

  // Validar URL
  url: (value: string): string | null => {
    if (!value.trim()) {
      return 'Ingresa el link del video.';
    }
    try {
      new URL(value);
      return null;
    } catch {
      return 'Ingresa una URL válida.';
    }
  }
};
