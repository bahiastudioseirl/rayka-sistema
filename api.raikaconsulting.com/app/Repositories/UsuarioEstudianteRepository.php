<?php

namespace App\Repositories;

use App\Models\Usuarios;
use App\Models\Capacitaciones;
use Illuminate\Support\Facades\DB;

class UsuarioEstudianteRepository
{

    public function obtenerCursosDeCapacitacion(int $idUsuario, int $idCapacitacion)
    {
        $tieneAcceso = DB::table('usuarios_capacitaciones')
            ->where('id_usuario', $idUsuario)
            ->where('id_capacitacion', $idCapacitacion)
            ->exists();

        if (!$tieneAcceso) {
            return collect([]);
        }

        $cursos = DB::table('capacitaciones_cursos')
            ->join('cursos', 'capacitaciones_cursos.id_curso', '=', 'cursos.id_curso')
            ->leftJoin('usuarios', 'cursos.creado_por', '=', 'usuarios.id_usuario')
            ->where('capacitaciones_cursos.id_capacitacion', $idCapacitacion)
            ->where('cursos.activo', true)
            ->select(
                'cursos.id_curso',
                'cursos.titulo',
                'cursos.contenido',
                'cursos.tipo_contenido',
                'cursos.fecha_creacion',
                'usuarios.nombre as creador_nombre',
                'usuarios.apellido as creador_apellido'
            )
            ->orderBy('cursos.fecha_creacion', 'desc')
            ->get();

        return $cursos;
    }

    public function obtenerCapacitacion(int $idUsuario, int $idCapacitacion)
    {
        return DB::table('usuarios_capacitaciones')
            ->join('capacitaciones', 'usuarios_capacitaciones.id_capacitacion', '=', 'capacitaciones.id_capacitacion')
            ->join('solicitantes', 'capacitaciones.id_solicitante', '=', 'solicitantes.id_solicitante')
            ->join('empresas', 'solicitantes.id_empresa', '=', 'empresas.id_empresa')
            ->where('usuarios_capacitaciones.id_usuario', $idUsuario)
            ->where('capacitaciones.id_capacitacion', $idCapacitacion)
            ->where('capacitaciones.estado', 'activa')
            ->select(
                'capacitaciones.id_capacitacion',
                'capacitaciones.duracion_examen_min',
                'capacitaciones.max_intentos',
                'capacitaciones.estado',
                'capacitaciones.fecha_creacion',
                'solicitantes.nombre as solicitante_nombre',
                'solicitantes.apellido as solicitante_apellido',
                'solicitantes.cargo as solicitante_cargo',
                'empresas.nombre as empresa_nombre'
            )
            ->first();
    }
 
    public function obtenerCursosDelEstudiante(int $idUsuario)
    {
        $capacitaciones = DB::table('usuarios_capacitaciones')
            ->join('capacitaciones', 'usuarios_capacitaciones.id_capacitacion', '=', 'capacitaciones.id_capacitacion')
            ->where('usuarios_capacitaciones.id_usuario', $idUsuario)
            ->where('capacitaciones.estado', 'activa')
            ->select('capacitaciones.*')
            ->get();

        if ($capacitaciones->isEmpty()) {
            return collect([]);
        }

        $idsCapacitaciones = $capacitaciones->pluck('id_capacitacion');

        $cursos = DB::table('capacitaciones_cursos')
            ->join('cursos', 'capacitaciones_cursos.id_curso', '=', 'cursos.id_curso')
            ->leftJoin('usuarios', 'cursos.creado_por', '=', 'usuarios.id_usuario')
            ->whereIn('capacitaciones_cursos.id_capacitacion', $idsCapacitaciones)
            ->where('cursos.activo', true)
            ->select(
                'cursos.id_curso',
                'cursos.titulo',
                'cursos.contenido',
                'cursos.tipo_contenido',
                'cursos.fecha_creacion',
                'capacitaciones_cursos.id_capacitacion',
                'usuarios.nombre as creador_nombre',
                'usuarios.apellido as creador_apellido'
            )
            ->orderBy('cursos.fecha_creacion', 'desc')
            ->get();

        return $cursos;
    }

    public function obtenerCapacitacionesDelEstudiante(int $idUsuario)
    {
        return DB::table('usuarios_capacitaciones')
            ->join('capacitaciones', 'usuarios_capacitaciones.id_capacitacion', '=', 'capacitaciones.id_capacitacion')
            ->join('solicitantes', 'capacitaciones.id_solicitante', '=', 'solicitantes.id_solicitante')
            ->join('empresas', 'solicitantes.id_empresa', '=', 'empresas.id_empresa')
            ->where('usuarios_capacitaciones.id_usuario', $idUsuario)
            ->where('capacitaciones.estado', 'activa')
            ->select(
                'capacitaciones.id_capacitacion',
                'capacitaciones.duracion_examen_min',
                'capacitaciones.max_intentos',
                'capacitaciones.estado',
                'capacitaciones.fecha_creacion',
                'solicitantes.nombre as solicitante_nombre',
                'solicitantes.apellido as solicitante_apellido',
                'solicitantes.cargo as solicitante_cargo',
                'empresas.nombre as empresa_nombre'
            )
            ->get();
    }
    public function tieneAccesoAlCurso(int $idUsuario, int $idCurso): bool
    {
        return DB::table('usuarios_capacitaciones')
            ->join('capacitaciones_cursos', 'usuarios_capacitaciones.id_capacitacion', '=', 'capacitaciones_cursos.id_capacitacion')
            ->join('capacitaciones', 'usuarios_capacitaciones.id_capacitacion', '=', 'capacitaciones.id_capacitacion')
            ->where('usuarios_capacitaciones.id_usuario', $idUsuario)
            ->where('capacitaciones_cursos.id_curso', $idCurso)
            ->where('capacitaciones.estado', 'activa')
            ->exists();
    }
}
