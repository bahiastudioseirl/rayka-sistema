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
            'solicitante'
        ])->find($id);
    }

    public function listarTodos(): Collection
    {
        return Capacitaciones::with([
            'usuarios:id_usuario,nombre,apellido,correo,num_documento',
            'cursos:id_curso,titulo,contenido,tipo_contenido,activo',
            'solicitante'
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
}