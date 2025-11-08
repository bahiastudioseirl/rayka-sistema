import type { Empresa } from "../../empresaAdmin/schemas/EmpresaSchema";

export interface Solicitante {
  id_solicitante: number;
  nombre: string;
  apellido: string;
  cargo: string;
  correo: string;
  telefono: string;
  empresa_id: number;
  empresa?: Empresa | null;
  fecha_creacion?: string;
}

export interface CrearSolicitanteRequest {
  nombre: string;
  apellido: string;
  cargo: string;
  correo: string;
  telefono: string;
  empresa_id: number;
}

export interface CrearSolicitanteResponse {
  success: boolean;
  message: string;
  data: {
    solicitante: Solicitante;
  };
}

export interface ObtenerSolicitantesResponse {
  success: true;
  message: string;
  data: Solicitante[];
}
