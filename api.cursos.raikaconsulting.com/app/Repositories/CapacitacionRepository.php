<?php

namespace App\Repositories;

use App\Models\Capacitaciones;
use App\Models\UsuariosCapacitaciones;
use App\Models\CapacitacionesCursos;
use App\Models\CapacitacionSolicitantes;
use App\Models\Cursos;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class CapacitacionRepository
{
    public function crear(array $datos): Capacitaciones
    {
        return Capacitaciones::create($datos);
    }

    public function obtenerPorId(int $id): ?Capacitaciones
    {
        return Capacitaciones::with([
            'usuarios:id_usuario,nombre,apellido,correo,num_documento,activo',
            'cursos:id_curso,titulo,contenido,tipo_contenido,activo,fecha_creacion',
            'solicitante:id_solicitante,nombre,apellido,cargo,correo,telefono,id_empresa',
            'solicitante.empresa:id_empresa,nombre'
        ])->find($id);
    }

    public function listarTodos(): Collection
    {
        return Capacitaciones::with([
            'usuarios:id_usuario,nombre,apellido,correo,num_documento',
            'cursos:id_curso,titulo,contenido,tipo_contenido,activo',
            'solicitante:id_solicitante,nombre,apellido,cargo,correo,id_empresa'
        ])->get();
    }

    public function asignarUsuarios(int $idCapacitacion, array $usuariosIds): bool
    {
        $usuariosCapacitaciones = [];
        foreach ($usuariosIds as $idUsuario) {
            $usuariosCapacitaciones[] = [
                'id_capacitacion' => $idCapacitacion,
                'id_usuario' => $idUsuario
            ];
        }
        
        return !empty($usuariosCapacitaciones) ? UsuariosCapacitaciones::insert($usuariosCapacitaciones) : true;
    }

    public function asignarCursos(int $idCapacitacion, array $cursosIds): bool
    {
        $capacitacionesCursos = [];
        foreach ($cursosIds as $idCurso) {
            $capacitacionesCursos[] = [
                'id_capacitacion' => $idCapacitacion,
                'id_curso' => $idCurso
            ];
        }
        
        return !empty($capacitacionesCursos) ? CapacitacionesCursos::insert($capacitacionesCursos) : true;
    }

    public function crearSeguimiento(int $idCapacitacion, int $idSolicitante, $fechaFin, $observaciones): CapacitacionSolicitantes
    {
        return CapacitacionSolicitantes::create([
            'id_capacitacion' => $idCapacitacion,
            'id_solicitante' => $idSolicitante,
            'fecha_inicio' => now(),
            'fecha_fin' => $fechaFin,
            'observaciones' => $observaciones
        ]);
    }

    public function obtenerUsuariosAsignados(int $idCapacitacion): array
    {
        return UsuariosCapacitaciones::where('id_capacitacion', $idCapacitacion)
            ->pluck('id_usuario')
            ->toArray();
    }

    public function obtenerCursosAsignados(int $idCapacitacion): array
    {
        return CapacitacionesCursos::where('id_capacitacion', $idCapacitacion)
            ->pluck('id_curso')
            ->toArray();
    }

    public function agregarUsuarios(int $idCapacitacion, array $usuariosIds): bool
    {
        return $this->asignarUsuarios($idCapacitacion, $usuariosIds);
    }

    public function eliminarUsuarios(int $idCapacitacion, array $usuariosIds): int
    {
        return UsuariosCapacitaciones::where('id_capacitacion', $idCapacitacion)
            ->whereIn('id_usuario', $usuariosIds)
            ->delete();
    }

    public function contarUsuarios(int $idCapacitacion): int
    {
        return UsuariosCapacitaciones::where('id_capacitacion', $idCapacitacion)->count();
    }

    public function agregarCursos(int $idCapacitacion, array $cursosIds): bool
    {
        return $this->asignarCursos($idCapacitacion, $cursosIds);
    }

    public function eliminarCursos(int $idCapacitacion, array $cursosIds): int
    {
        return CapacitacionesCursos::where('id_capacitacion', $idCapacitacion)
            ->whereIn('id_curso', $cursosIds)
            ->delete();
    }

    public function contarCursos(int $idCapacitacion): int
    {
        return CapacitacionesCursos::where('id_capacitacion', $idCapacitacion)->count();
    }

    public function obtenerCursosActivos(array $cursosIds): array
    {
        return Cursos::whereIn('id_curso', $cursosIds)
            ->where('activo', true)
            ->pluck('id_curso')
            ->toArray();
    }

    public function verificarCursosExisten(array $cursosIds): array
    {
        return Cursos::whereIn('id_curso', $cursosIds)
            ->pluck('id_curso')
            ->toArray();
    }

    public function ejecutarTransaccion(callable $callback)
    {
        return DB::transaction($callback);
    }

    public function crearProgresosEstudiantesCursos(int $idCapacitacion): int
    {
        // Obtener todos los estudiantes de la capacitación
        $usuarios = DB::table('usuarios_capacitaciones')
            ->where('id_capacitacion', $idCapacitacion)
            ->pluck('id_usuario');

        // Obtener todos los cursos de la capacitación
        $cursos = DB::table('capacitaciones_cursos')
            ->where('id_capacitacion', $idCapacitacion)
            ->pluck('id_curso');

        // Crear progresos para cada combinación estudiante-curso
        $progresos = [];
        foreach ($usuarios as $idUsuario) {
            foreach ($cursos as $idCurso) {
                $progresos[] = [
                    'completado' => false,
                    'nota' => null,
                    'intentos_usados' => 0,
                    'fecha_ultimo_intento' => null,
                    'id_usuario' => $idUsuario,
                    'id_curso' => $idCurso,
                    'fecha_completado' => null
                ];
            }
        }

        // Insertar todos los progresos
        if (!empty($progresos)) {
            DB::table('progresos')->insert($progresos);
        }

        return count($progresos);
    }

    public function crearProgresosParaNuevosEstudiantes(int $idCapacitacion, array $nuevosEstudiantes): int
    {
        // Obtener todos los cursos de la capacitación
        $cursos = DB::table('capacitaciones_cursos')
            ->where('id_capacitacion', $idCapacitacion)
            ->pluck('id_curso');

        // Crear progresos para cada nuevo estudiante y cada curso
        $progresos = [];
        foreach ($nuevosEstudiantes as $idUsuario) {
            foreach ($cursos as $idCurso) {
                $progresos[] = [
                    'completado' => false,
                    'nota' => null,
                    'intentos_usados' => 0,
                    'fecha_ultimo_intento' => null,
                    'id_usuario' => $idUsuario,
                    'id_curso' => $idCurso,
                    'fecha_completado' => null
                ];
            }
        }

        // Insertar todos los progresos
        if (!empty($progresos)) {
            DB::table('progresos')->insert($progresos);
        }

        return count($progresos);
    }

    public function crearProgresosParaNuevosCursos(int $idCapacitacion, array $nuevosCursos): int
    {
        // Obtener todos los estudiantes de la capacitación
        $usuarios = DB::table('usuarios_capacitaciones')
            ->where('id_capacitacion', $idCapacitacion)
            ->pluck('id_usuario');

        // Crear progresos para cada estudiante y cada nuevo curso
        $progresos = [];
        foreach ($usuarios as $idUsuario) {
            foreach ($nuevosCursos as $idCurso) {
                $progresos[] = [
                    'completado' => false,
                    'nota' => null,
                    'intentos_usados' => 0,
                    'fecha_ultimo_intento' => null,
                    'id_usuario' => $idUsuario,
                    'id_curso' => $idCurso,
                    'fecha_completado' => null
                ];
            }
        }

        // Insertar todos los progresos
        if (!empty($progresos)) {
            DB::table('progresos')->insert($progresos);
        }

        return count($progresos);
    }

    public function cambiarEstadoCapacitacion(int $idCapacitacion, bool $nuevoEstado): bool
    {
        return Capacitaciones::where('id_capacitacion', $idCapacitacion)
            ->update(['estado' => $nuevoEstado]);
    }

    public function toggleEstado(int $idCapacitacion): ?Capacitaciones
    {
        $capacitacion = Capacitaciones::find($idCapacitacion);
        
        if (!$capacitacion) {
            return null;
        }

        $nuevoEstado = $capacitacion->estado === 'activa' ? 'inactiva' : 'activa';

        $capacitacion->update(['estado' => $nuevoEstado]);
        
        return $this->obtenerPorId($idCapacitacion);
    }

    public function actualizar(int $idCapacitacion, array $datos): bool
    {
        return Capacitaciones::where('id_capacitacion', $idCapacitacion)
            ->update($datos);
    }

    public function obtenerEstudiantesConResultados(int $idCapacitacion): array
    {
        return DB::table('usuarios_capacitaciones as uc')
            ->join('usuarios as u', 'uc.id_usuario', '=', 'u.id_usuario')
            ->leftJoin('progresos as p', function($join) {
                $join->on('u.id_usuario', '=', 'p.id_usuario');
            })
            ->leftJoin('cursos as c', 'p.id_curso', '=', 'c.id_curso')
            ->where('uc.id_capacitacion', $idCapacitacion)
            ->select(
                'u.id_usuario',
                'u.nombre',
                'u.apellido',
                'u.num_documento',
                DB::raw('COUNT(DISTINCT c.id_curso) as total_cursos'),
                DB::raw('COUNT(DISTINCT CASE WHEN p.resultado_examen = "aprobado" THEN c.id_curso END) as cursos_aprobados'),
                DB::raw('CASE 
                    WHEN COUNT(DISTINCT c.id_curso) = COUNT(DISTINCT CASE WHEN p.resultado_examen = "aprobado" THEN c.id_curso END) 
                    AND COUNT(DISTINCT c.id_curso) > 0 
                    THEN "aprobado" 
                    ELSE "en_progreso" 
                END as estado_capacitacion')
            )
            ->groupBy('u.id_usuario', 'u.nombre', 'u.apellido', 'u.num_documento')
            ->get()
            ->toArray();
    }

    public function obtenerDetallesCursosEstudiante(int $idCapacitacion, int $idUsuario): array
    {
        $cursos = DB::table('capacitaciones_cursos as cc')
            ->join('cursos as c', 'cc.id_curso', '=', 'c.id_curso')
            ->leftJoin('progresos as p', function($join) use ($idUsuario) {
                $join->on('c.id_curso', '=', 'p.id_curso')
                     ->where('p.id_usuario', '=', $idUsuario);
            })
            ->where('cc.id_capacitacion', $idCapacitacion)
            ->select(
                'c.id_curso',
                'c.titulo',
                'p.nota',
                'p.resultado_examen',
                'p.completado',
                'p.video_finalizado',
                'p.intentos_usados',
                'p.fecha_ultimo_intento'
            )
            ->get()
            ->toArray();

        // Transformar valores null a "no iniciado"
        return array_map(function($curso) {
            return [
                'id_curso' => $curso->id_curso,
                'titulo' => $curso->titulo,
                'nota' => $curso->nota ?? 'no iniciado',
                'resultado_examen' => $curso->resultado_examen ?? 'no iniciado',
                'completado' => $curso->completado ?? 0,
                'video_finalizado' => $curso->video_finalizado ?? 0,
                'intentos_usados' => $curso->intentos_usados ?? 0,
                'fecha_ultimo_intento' => $curso->fecha_ultimo_intento ?? 'no iniciado'
            ];
        }, $cursos);
    }
}