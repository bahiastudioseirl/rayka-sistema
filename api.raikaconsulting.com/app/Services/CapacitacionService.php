<?php

namespace App\Services;

use App\DTOs\Capacitaciones\CrearCapacitacionDTO;
use App\Models\Capacitaciones;
use App\Models\Cursos;
use App\Models\UsuariosCapacitaciones;
use App\Models\CapacitacionesCursos;
use App\Models\CapacitacionSolicitantes;
use App\Http\Responses\CapacitacionResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Auth;
use Exception;

class CapacitacionService
{
    public function crearCapacitacion(CrearCapacitacionDTO $capacitacionDTO): array
    {
        try {
            return DB::transaction(function () use ($capacitacionDTO) {
                $capacitacion = Capacitaciones::create($capacitacionDTO->toArray());
                
                $idCapacitacion = $capacitacion->id_capacitacion;
                
                $usuariosCapacitaciones = [];
                foreach ($capacitacionDTO->usuarios_estudiantes as $idUsuario) {
                    $usuariosCapacitaciones[] = [
                        'id_capacitacion' => $idCapacitacion,
                        'id_usuario' => $idUsuario
                    ];
                }
                
                if (!empty($usuariosCapacitaciones)) {
                    UsuariosCapacitaciones::insert($usuariosCapacitaciones);
                }
                
                $capacitacionesCursos = [];
                foreach ($capacitacionDTO->cursos as $idCurso) {
                    $capacitacionesCursos[] = [
                        'id_capacitacion' => $idCapacitacion,
                        'id_curso' => $idCurso
                    ];
                }
                
                if (!empty($capacitacionesCursos)) {
                    CapacitacionesCursos::insert($capacitacionesCursos);
                }
                
                // 4. Crear registro en capacitacion_solicitantes (historial/seguimiento) - solo si se proporciona fecha_fin
                if ($capacitacionDTO->fecha_fin) {
                    CapacitacionSolicitantes::create([
                        'id_capacitacion' => $idCapacitacion,
                        'id_solicitante' => $capacitacionDTO->id_solicitante,
                        'fecha_inicio' => now(),
                        'fecha_fin' => $capacitacionDTO->fecha_fin,
                        'observaciones' => $capacitacionDTO->observaciones
                    ]);
                }
                
                // 5. Cargar la capacitación con todas sus relaciones para retornar
                $capacitacionCompleta = Capacitaciones::with([
                    'usuarios:id_usuario,nombre,apellido,correo,num_documento,activo',
                    'cursos:id_curso,titulo,contenido,tipo_contenido,activo,fecha_creacion',
                    'solicitante'
                ])->find($idCapacitacion);
                
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
            $capacitaciones = Capacitaciones::with([
                'usuarios:id_usuario,nombre,apellido,correo,num_documento',
                'cursos:id_curso,titulo,contenido,tipo_contenido,activo',
                'solicitante'
            ])->get();
            
            return CapacitacionResponse::index($capacitaciones);
            
        } catch (Exception $e) {
            return CapacitacionResponse::error('Error al obtener las capacitaciones.', [$e->getMessage()]);
        }
    }
    
    public function obtenerCapacitacion(int $idCapacitacion): array
    {
        try {
            $capacitacion = Capacitaciones::with([
                'usuarios:id_usuario,nombre,apellido,correo,num_documento,activo',
                'cursos:id_curso,titulo,contenido,tipo_contenido,activo,fecha_creacion',
                'solicitante'
            ])->find($idCapacitacion);
            
            if (!$capacitacion) {
                return CapacitacionResponse::error('Capacitación no encontrada.');
            }
            
            return CapacitacionResponse::show($capacitacion);
            
        } catch (Exception $e) {
            return CapacitacionResponse::error('Error al eliminar la capacitación.', [$e->getMessage()]);
        }
    }
    

    public function agregarEstudiantes(int $idCapacitacion, array $nuevosEstudiantes): array
    {
        try {
            return DB::transaction(function () use ($idCapacitacion, $nuevosEstudiantes) {
                $capacitacion = Capacitaciones::find($idCapacitacion);
                
                if (!$capacitacion) {
                    return CapacitacionResponse::error('Capacitación no encontrada.');
                }
                
                $estudiantesExistentes = UsuariosCapacitaciones::where('id_capacitacion', $idCapacitacion)
                    ->whereIn('id_usuario', $nuevosEstudiantes)
                    ->pluck('id_usuario')
                    ->toArray();
                
                $estudiantesAgregar = array_diff($nuevosEstudiantes, $estudiantesExistentes);
                
                if (empty($estudiantesAgregar)) {
                    return [
                        'success' => false,
                        'message' => 'Todos los estudiantes ya están asignados a esta capacitación.',
                        'estudiantes_duplicados' => $estudiantesExistentes
                    ];
                }
                
                $usuariosCapacitaciones = [];
                foreach ($estudiantesAgregar as $idUsuario) {
                    $usuariosCapacitaciones[] = [
                        'id_capacitacion' => $idCapacitacion,
                        'id_usuario' => $idUsuario
                    ];
                }
                
                UsuariosCapacitaciones::insert($usuariosCapacitaciones);
                
                $capacitacionCompleta = Capacitaciones::with([
                    'usuarios:id_usuario,nombre,apellido,correo,num_documento,activo',
                    'cursos:id_curso,titulo,contenido,tipo_contenido,activo,fecha_creacion',
                    'solicitante'
                ])->find($idCapacitacion);
                
                return CapacitacionResponse::estudiantesAgregados($capacitacionCompleta, count($estudiantesAgregar), $estudiantesExistentes);
            });
            
        } catch (Exception $e) {
            return CapacitacionResponse::error('Error al agregar estudiantes.', [$e->getMessage()]);
        }
    }
    
    public function eliminarEstudiantes(int $idCapacitacion, array $estudiantesEliminar): array
    {
        try {
            return DB::transaction(function () use ($idCapacitacion, $estudiantesEliminar) {
                $capacitacion = Capacitaciones::find($idCapacitacion);
                
                if (!$capacitacion) {
                    return CapacitacionResponse::error('Capacitación no encontrada.');
                }
                
                $estudiantesExistentes = UsuariosCapacitaciones::where('id_capacitacion', $idCapacitacion)
                    ->whereIn('id_usuario', $estudiantesEliminar)
                    ->pluck('id_usuario')
                    ->toArray();
                
                if (empty($estudiantesExistentes)) {
                    return [
                        'success' => false,
                        'message' => 'Ninguno de los estudiantes especificados está asignado a esta capacitación.',
                        'estudiantes_no_encontrados' => $estudiantesEliminar
                    ];
                }
                
                $totalEstudiantesActuales = UsuariosCapacitaciones::where('id_capacitacion', $idCapacitacion)->count();
                
                if ($totalEstudiantesActuales <= count($estudiantesExistentes)) {
                    return [
                        'success' => false,
                        'message' => 'No se pueden eliminar todos los estudiantes. La capacitación debe tener al menos un estudiante.'
                    ];
                }
                
                $eliminados = UsuariosCapacitaciones::where('id_capacitacion', $idCapacitacion)
                    ->whereIn('id_usuario', $estudiantesEliminar)
                    ->delete();
                
                $capacitacionCompleta = Capacitaciones::with([
                    'usuarios:id_usuario,nombre,apellido,correo,num_documento,activo',
                    'cursos:id_curso,titulo,contenido,tipo_contenido,activo,fecha_creacion',
                    'solicitante'
                ])->find($idCapacitacion);
                
                return CapacitacionResponse::estudiantesEliminados($capacitacionCompleta, $eliminados, array_diff($estudiantesEliminar, $estudiantesExistentes));
            });
            
        } catch (Exception $e) {
            return CapacitacionResponse::error('Error al eliminar estudiantes.', [$e->getMessage()]);
        }
    }
    public function agregarCursos(int $idCapacitacion, array $cursosAgregar): array
    {
        try {
            return DB::transaction(function () use ($idCapacitacion, $cursosAgregar) {
                $capacitacion = Capacitaciones::find($idCapacitacion);
                
                if (!$capacitacion) {
                    return CapacitacionResponse::error('La capacitación especificada no existe.', ['id_capacitacion' => 'No encontrada']);
                }
                
                $cursosValidos = Cursos::whereIn('id_curso', $cursosAgregar)
                    ->where('activo', true)
                    ->pluck('id_curso')
                    ->toArray();
                
                $cursosInvalidos = array_diff($cursosAgregar, $cursosValidos);
                
                if (!empty($cursosInvalidos)) {
                    return CapacitacionResponse::error(
                        'Algunos cursos no existen o no están activos.', 
                        ['cursos_invalidos' => $cursosInvalidos]
                    );
                }
                
                $cursosExistentes = CapacitacionesCursos::where('id_capacitacion', $idCapacitacion)
                    ->pluck('id_curso')
                    ->toArray();
                
                $duplicados = array_intersect($cursosAgregar, $cursosExistentes);
                $cursosNuevos = array_diff($cursosAgregar, $cursosExistentes);
                
                if (empty($cursosNuevos)) {
                    return CapacitacionResponse::error('Todos los cursos ya están asignados a esta capacitación.', ['duplicados' => $duplicados]);
                }
                
                $cursosData = array_map(function ($idCurso) use ($idCapacitacion) {
                    return [
                        'id_capacitacion' => $idCapacitacion,
                        'id_curso' => $idCurso
                    ];
                }, $cursosNuevos);
                
                CapacitacionesCursos::insert($cursosData);
                
                $capacitacionCompleta = Capacitaciones::with([
                    'usuarios:id_usuario,nombre,apellido,correo,num_documento,activo',
                    'cursos:id_curso,titulo,contenido,tipo_contenido,activo,fecha_creacion',
                    'solicitante'
                ])->find($idCapacitacion);
                
                return CapacitacionResponse::cursosAgregados($capacitacionCompleta, count($cursosNuevos), $duplicados);
            });
            
        } catch (Exception $e) {
            return CapacitacionResponse::error('Error al agregar cursos.', [$e->getMessage()]);
        }
    }
    public function eliminarCursos(int $idCapacitacion, array $cursosEliminar): array
    {
        try {
            return DB::transaction(function () use ($idCapacitacion, $cursosEliminar) {
                $capacitacion = Capacitaciones::find($idCapacitacion);
                
                if (!$capacitacion) {
                    return CapacitacionResponse::error('La capacitación especificada no existe.', ['id_capacitacion' => 'No encontrada']);
                }
                
                $cursosExistentesEnBD = Cursos::whereIn('id_curso', $cursosEliminar)
                    ->pluck('id_curso')
                    ->toArray();
                
                $cursosInexistentes = array_diff($cursosEliminar, $cursosExistentesEnBD);
                
                if (!empty($cursosInexistentes)) {
                    return CapacitacionResponse::error(
                        'Algunos cursos no existen.', 
                        ['cursos_inexistentes' => $cursosInexistentes]
                    );
                }
                
                $cursosAsignados = CapacitacionesCursos::where('id_capacitacion', $idCapacitacion)
                    ->whereIn('id_curso', $cursosEliminar)
                    ->pluck('id_curso')
                    ->toArray();
                
                $cursosNoAsignados = array_diff($cursosEliminar, $cursosAsignados);
                
                if (empty($cursosAsignados)) {
                    return CapacitacionResponse::error('Ninguno de los cursos especificados está asignado a esta capacitación.', ['cursos_no_asignados' => $cursosNoAsignados]);
                }
                
                $totalCursosActuales = CapacitacionesCursos::where('id_capacitacion', $idCapacitacion)->count();
                if (count($cursosAsignados) >= $totalCursosActuales) {
                    return [
                        'success' => false,
                        'message' => 'No se pueden eliminar todos los cursos. La capacitación debe tener al menos un curso.'
                    ];
                }
                
                $eliminados = CapacitacionesCursos::where('id_capacitacion', $idCapacitacion)
                    ->whereIn('id_curso', $cursosAsignados)
                    ->delete();
                
                $capacitacionCompleta = Capacitaciones::with([
                    'usuarios:id_usuario,nombre,apellido,correo,num_documento,activo',
                    'cursos:id_curso,titulo,contenido,tipo_contenido,activo,fecha_creacion',
                    'solicitante'
                ])->find($idCapacitacion);
                
                return CapacitacionResponse::cursosEliminados($capacitacionCompleta, $eliminados, $cursosNoAsignados);
            });
            
        } catch (Exception $e) {
            return CapacitacionResponse::error('Error al eliminar cursos.', [$e->getMessage()]);
        }
    }
    

    
}