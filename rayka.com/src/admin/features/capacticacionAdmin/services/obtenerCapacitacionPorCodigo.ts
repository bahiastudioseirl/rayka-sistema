// import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { Solicitante } from '../../solicitanteAdmin/schemas/SolicitanteSchema';
import type { Empresa } from '../../empresaAdmin/schemas/EmpresaSchema';

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
  resumen: {
    total_estudiantes: number;
    total_cursos: number;
    codigo_unico: string;
    fecha_creacion: string;
    estado: string;
  };
  solicitante: Solicitante;
  empresa: Empresa;
  estudiantes_registrados: string[]; // DNIs de los estudiantes
}

export interface ObtenerCapacitacionPorCodigoResponse {
  success: boolean;
  message: string;
  data: CapacitacionCompleta | null;
}

export const obtenerCapacitacionPorCodigo = async (codigo: string): Promise<ObtenerCapacitacionPorCodigoResponse> => {
  // TODO: Reemplazar con llamada real al backend cuando esté disponible
  // const response = await axiosWithoutMultipart.get<ObtenerCapacitacionPorCodigoResponse>(`capacitaciones/codigo/${codigo}`);
  
  // Simulación con datos de prueba
  return new Promise((resolve) => {
    setTimeout(() => {
      const capacitacionesMock = {
        'cap_691370844b0ab_1762881668': {
          capacitacion: {
            id_capacitacion: 1,
            duracion_examen_min: 60,
            max_intentos: 3,
            link_login_unico: `http://localhost:5173/login/${codigo}`,
            fecha_creacion: '2024-01-15T10:00:00Z',
            estado: 'activa',
            id_solicitante: 1
          },
          resumen: {
            total_estudiantes: 25,
            total_cursos: 4,
            codigo_unico: codigo,
            fecha_creacion: '2024-01-15T10:00:00Z',
            estado: 'activa'
          },
          solicitante: {
            id_solicitante: 1,
            nombre: 'Carlos',
            apellido: 'Mendoza',
            correo: 'carlos.mendoza@yanacocha.com',
            telefono: '+51 976 123 456',
            cargo: 'Jefe de Seguridad',
            empresa_id: 1
          },
          empresa: {
            id_empresa: 1,
            nombre: 'MINERA YANACOCHA S.R.L.',
            creado_por: 1,
            fecha_creacion: '2023-01-01T00:00:00Z'
          },
          estudiantes_registrados: ['12345678', '87654321', '11223344', '55667788']
        },
        'cap_123456789abc_9876543210': {
          capacitacion: {
            id_capacitacion: 2,
            duracion_examen_min: 45,
            max_intentos: 2,
            link_login_unico: `http://localhost:5173/login/${codigo}`,
            fecha_creacion: '2024-02-01T14:30:00Z',
            estado: 'activa',
            id_solicitante: 2
          },
          resumen: {
            total_estudiantes: 18,
            total_cursos: 3,
            codigo_unico: codigo,
            fecha_creacion: '2024-02-01T14:30:00Z',
            estado: 'activa'
          },
          solicitante: {
            id_solicitante: 2,
            nombre: 'María',
            apellido: 'Rodriguez',
            correo: 'maria.rodriguez@antamina.com',
            telefono: '+51 987 654 321',
            cargo: 'Coordinadora de Capacitación',
            empresa_id: 2
          },
          empresa: {
            id_empresa: 2,
            nombre: 'COMPAÑÍA MINERA ANTAMINA S.A.',
            creado_por: 1,
            fecha_creacion: '2023-01-01T00:00:00Z'
          },
          estudiantes_registrados: ['12345678', '55667788', '99887766', '44332211']
        }
      };

      const capacitacion = capacitacionesMock[codigo as keyof typeof capacitacionesMock];
      
      if (capacitacion) {
        resolve({
          success: true,
          message: 'Capacitación encontrada',
          data: capacitacion
        });
      } else {
        resolve({
          success: false,
          message: 'Capacitación no encontrada',
          data: null
        });
      }
    }, 800); // Simular delay de red
  });
};