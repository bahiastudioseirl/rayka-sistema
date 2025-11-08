export interface CrearEmpresaRequest {
  nombre: string;
}

export interface Empresa {
  id_empresa: number;
  nombre: string;
  creado_por: number;
  fecha_creacion: string;
}

export interface CrearEmpresaResponse {
  success: boolean;
  message: string;
  data: {
    empresa: Empresa;
  };
}

export interface ObtenerEmpresaResponse {
  success: boolean;
  message: string;
  data: {
    empresa: Empresa;
  };
}