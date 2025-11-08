<?php

namespace App\Services;

use App\DTOs\Capacitaciones\CrearCapacitacionDTO;
use App\Repositories\CapacitacionRepository;
use App\Http\Responses\CapacitacionResponse;
use Illuminate\Database\QueryException;
use Exception;

class CapacitacionService
{
    public function __construct(
        private readonly CapacitacionRepository $capacitacionRepository
    ) {}

    public function crearCapacitacion(CrearCapacitacionDTO $capacitacionDTO): array
    {
        try {
            return $this->capacitacionRepository->ejecutarTransaccion(function () use ($capacitacionDTO) {
                $capacitacion = $this->capacitacionRepository->crear($capacitacionDTO->toArray());
                $idCapacitacion = $capacitacion->id_capacitacion;
                
                if (!empty($capacitacionDTO->usuarios_estudiantes)) {
                    $this->capacitacionRepository->asignarUsuarios($idCapacitacion, $capacitacionDTO->usuarios_estudiantes);
                }
                
                if (!empty($capacitacionDTO->cursos)) {
                    $this->capacitacionRepository->asignarCursos($idCapacitacion, $capacitacionDTO->cursos);
                }
                
                if ($capacitacionDTO->fecha_fin) {
                    $this->capacitacionRepository->crearSeguimiento(
                        $idCapacitacion,
                        $capacitacionDTO->id_solicitante,
                        $capacitacionDTO->fecha_fin,
                        $capacitacionDTO->observaciones
                    );
                }
                
                // 5. Obtener capacitación completa para respuesta
                $capacitacionCompleta = $this->capacitacionRepository->obtenerPorId($idCapacitacion);
                
                return CapacitacionResponse::created($capacitacionCompleta);
            });
            
        } catch (QueryException $e) {
            return [
                'success' => false,
                'message' => 'Error en la base de datos al crear la capacitación.',
                'error' => $e->getMessage()
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error inesperado al crear la capacitación.',
                'error' => $e->getMessage()
            ];
        }
    }
    
    public function obtenerCapacitaciones(): array
    {
        try {
            $capacitaciones = $this->capacitacionRepository->listarTodos();
            return CapacitacionResponse::index($capacitaciones);
            
        } catch (Exception $e) {
            return CapacitacionResponse::error('Error al obtener las capacitaciones.', [$e->getMessage()]);
        }
    }
    
    public function obtenerCapacitacion(int $idCapacitacion): array
    {
        try {
            $capacitacion = $this->capacitacionRepository->obtenerPorId($idCapacitacion);
            
            if (!$capacitacion) {
                return CapacitacionResponse::error('Capacitación no encontrada.');
            }
            
            return CapacitacionResponse::show($capacitacion);
            
        } catch (Exception $e) {
            return CapacitacionResponse::error('Error al obtener la capacitación.', [$e->getMessage()]);
        }
    }

    public function agregarEstudiantes(int $idCapacitacion, array $nuevosEstudiantes): array
    {
        try {
            return $this->capacitacionRepository->ejecutarTransaccion(function () use ($idCapacitacion, $nuevosEstudiantes) {
                $capacitacion = $this->capacitacionRepository->obtenerPorId($idCapacitacion);
                
                if (!$capacitacion) {
                    return CapacitacionResponse::error('Capacitación no encontrada.');
                }
                
                $estudiantesExistentes = $this->capacitacionRepository->obtenerUsuariosAsignados($idCapacitacion);
                $duplicados = array_intersect($nuevosEstudiantes, $estudiantesExistentes);
                $estudiantesAgregar = array_diff($nuevosEstudiantes, $estudiantesExistentes);
                
                if (empty($estudiantesAgregar)) {
                    return [
                        'success' => false,
                        'message' => 'Todos los estudiantes ya están asignados a esta capacitación.',
                        'estudiantes_duplicados' => $duplicados
                    ];
                }
                
                $this->capacitacionRepository->agregarUsuarios($idCapacitacion, $estudiantesAgregar);
                
                $capacitacionCompleta = $this->capacitacionRepository->obtenerPorId($idCapacitacion);
                
                return CapacitacionResponse::estudiantesAgregados($capacitacionCompleta, count($estudiantesAgregar), $duplicados);
            });
            
        } catch (Exception $e) {
            return CapacitacionResponse::error('Error al agregar estudiantes.', [$e->getMessage()]);
        }
    }
    
    public function eliminarEstudiantes(int $idCapacitacion, array $estudiantesEliminar): array
    {
        try {
            return $this->capacitacionRepository->ejecutarTransaccion(function () use ($idCapacitacion, $estudiantesEliminar) {
                $capacitacion = $this->capacitacionRepository->obtenerPorId($idCapacitacion);
                
                if (!$capacitacion) {
                    return CapacitacionResponse::error('Capacitación no encontrada.');
                }
                
                $estudiantesAsignados = $this->capacitacionRepository->obtenerUsuariosAsignados($idCapacitacion);
                $estudiantesAEliminar = array_intersect($estudiantesEliminar, $estudiantesAsignados);
                $estudiantesNoEncontrados = array_diff($estudiantesEliminar, $estudiantesAsignados);
                
                if (empty($estudiantesAEliminar)) {
                    return [
                        'success' => false,
                        'message' => 'Ninguno de los estudiantes especificados está asignado a esta capacitación.',
                        'estudiantes_no_encontrados' => $estudiantesNoEncontrados
                    ];
                }
                
                $totalEstudiantesActuales = $this->capacitacionRepository->contarUsuarios($idCapacitacion);
                
                if ($totalEstudiantesActuales <= count($estudiantesAEliminar)) {
                    return [
                        'success' => false,
                        'message' => 'No se pueden eliminar todos los estudiantes. La capacitación debe tener al menos un estudiante.'
                    ];
                }
                
                $eliminados = $this->capacitacionRepository->eliminarUsuarios($idCapacitacion, $estudiantesAEliminar);
                
                $capacitacionCompleta = $this->capacitacionRepository->obtenerPorId($idCapacitacion);
                
                return CapacitacionResponse::estudiantesEliminados($capacitacionCompleta, $eliminados, $estudiantesNoEncontrados);
            });
            
        } catch (Exception $e) {
            return CapacitacionResponse::error('Error al eliminar estudiantes.', [$e->getMessage()]);
        }
    }

    public function agregarCursos(int $idCapacitacion, array $cursosAgregar): array
    {
        try {
            return $this->capacitacionRepository->ejecutarTransaccion(function () use ($idCapacitacion, $cursosAgregar) {
                $capacitacion = $this->capacitacionRepository->obtenerPorId($idCapacitacion);
                
                if (!$capacitacion) {
                    return CapacitacionResponse::error('La capacitación especificada no existe.', ['id_capacitacion' => 'No encontrada']);
                }
                
                $cursosValidos = $this->capacitacionRepository->obtenerCursosActivos($cursosAgregar);
                $cursosInvalidos = array_diff($cursosAgregar, $cursosValidos);
                
                if (!empty($cursosInvalidos)) {
                    return CapacitacionResponse::error(
                        'Algunos cursos no existen o no están activos.', 
                        ['cursos_invalidos' => $cursosInvalidos]
                    );
                }
                
                $cursosExistentes = $this->capacitacionRepository->obtenerCursosAsignados($idCapacitacion);
                $duplicados = array_intersect($cursosAgregar, $cursosExistentes);
                $cursosNuevos = array_diff($cursosAgregar, $cursosExistentes);
                
                if (empty($cursosNuevos)) {
                    return CapacitacionResponse::error('Todos los cursos ya están asignados a esta capacitación.', ['duplicados' => $duplicados]);
                }
                
                $this->capacitacionRepository->agregarCursos($idCapacitacion, $cursosNuevos);
                
                $capacitacionCompleta = $this->capacitacionRepository->obtenerPorId($idCapacitacion);
                
                return CapacitacionResponse::cursosAgregados($capacitacionCompleta, count($cursosNuevos), $duplicados);
            });
            
        } catch (Exception $e) {
            return CapacitacionResponse::error('Error al agregar cursos.', [$e->getMessage()]);
        }
    }

    public function eliminarCursos(int $idCapacitacion, array $cursosEliminar): array
    {
        try {
            return $this->capacitacionRepository->ejecutarTransaccion(function () use ($idCapacitacion, $cursosEliminar) {
                $capacitacion = $this->capacitacionRepository->obtenerPorId($idCapacitacion);
                
                if (!$capacitacion) {
                    return CapacitacionResponse::error('La capacitación especificada no existe.', ['id_capacitacion' => 'No encontrada']);
                }
                
                $cursosExistentesEnBD = $this->capacitacionRepository->verificarCursosExisten($cursosEliminar);
                $cursosInexistentes = array_diff($cursosEliminar, $cursosExistentesEnBD);
                
                if (!empty($cursosInexistentes)) {
                    return CapacitacionResponse::error(
                        'Algunos cursos no existen.', 
                        ['cursos_inexistentes' => $cursosInexistentes]
                    );
                }
                
                $cursosAsignados = $this->capacitacionRepository->obtenerCursosAsignados($idCapacitacion);
                $cursosAEliminar = array_intersect($cursosEliminar, $cursosAsignados);
                $cursosNoAsignados = array_diff($cursosEliminar, $cursosAsignados);
                
                if (empty($cursosAEliminar)) {
                    return CapacitacionResponse::error('Ninguno de los cursos especificados está asignado a esta capacitación.', ['cursos_no_asignados' => $cursosNoAsignados]);
                }
                
                $totalCursosActuales = $this->capacitacionRepository->contarCursos($idCapacitacion);
                if (count($cursosAEliminar) >= $totalCursosActuales) {
                    return [
                        'success' => false,
                        'message' => 'No se pueden eliminar todos los cursos. La capacitación debe tener al menos un curso.'
                    ];
                }
                
                $eliminados = $this->capacitacionRepository->eliminarCursos($idCapacitacion, $cursosAEliminar);
                
                $capacitacionCompleta = $this->capacitacionRepository->obtenerPorId($idCapacitacion);
                
                return CapacitacionResponse::cursosEliminados($capacitacionCompleta, $eliminados, $cursosNoAsignados);
            });
            
        } catch (Exception $e) {
            return CapacitacionResponse::error('Error al eliminar cursos.', [$e->getMessage()]);
        }
    }

    public function cambiarEstado(int $idCapacitacion): array
    {
        try {
            $capacitacionActualizada = $this->capacitacionRepository->toggleEstado($idCapacitacion);
            
            if ($capacitacionActualizada === null) {
                return CapacitacionResponse::error('La capacitación especificada no existe.', ['id_capacitacion' => 'No encontrada']);
            }
            
            return CapacitacionResponse::estadoCambiado($capacitacionActualizada);
            
        } catch (Exception $e) {
            return CapacitacionResponse::error('Error al cambiar el estado de la capacitación.', [$e->getMessage()]);
        }
    }



}