import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { Solicitante } from '../../solicitanteAdmin/schemas/SolicitanteSchema';
import type { Empresa } from '../../empresaAdmin/schemas/EmpresaSchema';
import { obtenerEmpresas } from '../../empresaAdmin/services/obtenerEmpresas';
import { obtenerCapacitaciones } from './obtenerCapacitaciones';

export interface CapacitacionCompleta {
  capacitacion: {
    id_capacitacion: number;
    duracion_examen_min: number;
    max_intentos: number;
    link_login_unico: string;
    fecha_creacion: string;
    estado: string;
    id_solicitante: number;
  };
  usuarios_asignados: Array<{
    id_usuario: number;
    nombre: string;
    apellido: string;
    correo: string;
    num_documento: string;
    estado: string;
  }>;
  cursos_asignados: Array<{
    id_curso: number;
    titulo: string;
    contenido: string;
    tipo_contenido: string;
    activo: boolean;
    fecha_creacion: string;
  }>;
  solicitante: Solicitante;
  empresaInfo?: Empresa;
}

export interface ObtenerCapacitacionPorCodigoResponse {
  success: boolean;
  message: string;
  data: CapacitacionCompleta | null;
}

export const obtenerCapacitacionPorCodigo = async (codigo: string): Promise<ObtenerCapacitacionPorCodigoResponse> => {
  try {
    
    const capacitacionesResponse = await obtenerCapacitaciones();
    
    if (!capacitacionesResponse.data) {
      return {
        success: false,
        message: 'No se pudieron obtener las capacitaciones',
        data: null
      };
    }
    
    const capacitacionEncontrada = capacitacionesResponse.data.find(
      (cap) => cap.resumen.codigo_unico === codigo
    );

    if (!capacitacionEncontrada) {
      return {
        success: false,
        message: 'El código de capacitación no es válido o ha expirado.',
        data: null
      };
    }

    // Paso 2: Obtener los detalles completos usando el ID
    const response = await axiosWithoutMultipart.get<{ 
      success: boolean; 
      data: Omit<CapacitacionCompleta, 'empresaInfo'> 
    }>(`capacitaciones/${capacitacionEncontrada.capacitacion.id_capacitacion}`);

    if (!response.data.success || !response.data.data) {
      return {
        success: false,
        message: 'No se pudieron obtener los detalles de la capacitación',
        data: null
      };
    }

    // Paso 3: Obtener información de la empresa usando el id_empresa del solicitante
    const empresasResponse = await obtenerEmpresas();
    const empresa = empresasResponse.data.find(
      (emp) => emp.id_empresa === response.data.data.solicitante.empresa_id
    );

    return {
      success: true,
      message: 'Capacitación encontrada',
      data: {
        ...response.data.data,
        empresaInfo: empresa
      }
    };
  } catch (error) {
    console.error('Error al obtener capacitación por código:', error);
    return {
      success: false,
      message: 'Error al obtener la capacitación',
      data: null
    };
  }
};