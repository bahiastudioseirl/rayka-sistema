<?php

namespace App\Http\Responses;

use App\Models\Capacitaciones;

class CapacitacionResponse
{
    public static function created(Capacitaciones $capacitacion): array
    {
        return [
            'success' => true,
            'message' => 'Capacitación creada exitosamente.',
            'data' => [
                'capacitacion' => self::formatCapacitacion($capacitacion),
                'usuarios_asignados' => self::formatUsuarios($capacitacion->usuarios),
                'cursos_asignados' => self::formatCursos($capacitacion->cursos),
                'solicitante' => self::formatSolicitante($capacitacion->solicitante),
                'resumen' => [
                    'total_estudiantes' => $capacitacion->usuarios->count(),
                    'total_cursos' => $capacitacion->cursos->count(),
                    'link_acceso_completo' => self::generateCapacitacionUrl($capacitacion->link_login_unico),
                    'codigo_unico' => $capacitacion->link_login_unico,
                    'fecha_creacion' => $capacitacion->fecha_creacion?->format('Y-m-d H:i:s'),
                    'estado' => $capacitacion->estado
                ]
            ]
        ];
    }

    public static function show(Capacitaciones $capacitacion): array
    {
        return [
            'success' => true,
            'data' => [
                'capacitacion' => self::formatCapacitacion($capacitacion),
                'usuarios_asignados' => self::formatUsuarios($capacitacion->usuarios),
                'cursos_asignados' => self::formatCursos($capacitacion->cursos),
                'solicitante' => self::formatSolicitante($capacitacion->solicitante)
            ]
        ];
    }

    public static function index($capacitaciones): array
    {
        return [
            'success' => true,
            'data' => $capacitaciones->map(function ($capacitacion) {
                return [
                    'capacitacion' => self::formatCapacitacion($capacitacion),
                    'resumen' => [
                        'total_estudiantes' => $capacitacion->usuarios->count(),
                        'total_cursos' => $capacitacion->cursos->count(),
                        'codigo_unico' => $capacitacion->link_login_unico,
                        'fecha_creacion' => $capacitacion->fecha_creacion?->format('Y-m-d H:i:s'),
                        'estado' => $capacitacion->estado
                    ],
                    'solicitante' => [
                        'id_solicitante' => $capacitacion->solicitante->id_solicitante,
                        'nombre' => $capacitacion->solicitante->nombre,
                        'id_empresa' => $capacitacion->solicitante->id_empresa
                    ]
                ];
            })->all()
        ];
    }

    private static function formatCapacitacion(Capacitaciones $capacitacion): array
    {
        return [
            'id_capacitacion' => $capacitacion->id_capacitacion,
            'duracion_examen_min' => $capacitacion->duracion_examen_min,
            'max_intentos' => $capacitacion->max_intentos,
            'link_login_unico' => $capacitacion->link_login_unico,
            'fecha_creacion' => $capacitacion->fecha_creacion?->format('Y-m-d H:i:s'),
            'estado' => $capacitacion->estado,
            'id_solicitante' => $capacitacion->id_solicitante
        ];
    }

    private static function formatUsuarios($usuarios): array
    {
        return $usuarios->map(function ($usuario) {
            return [
                'id_usuario' => $usuario->id_usuario,
                'nombre' => $usuario->nombre,
                'apellido' => $usuario->apellido ?? '',
                'correo' => $usuario->correo ?? '',
                'num_documento' => $usuario->num_documento,
                'estado' => $usuario->activo ? 'activo' : 'inactivo'
            ];
        })->all();
    }

    private static function formatCursos($cursos): array
    {
        return $cursos->map(function ($curso) {
            return [
                'id_curso' => $curso->id_curso,
                'titulo' => $curso->titulo,
                'contenido' => $curso->contenido,
                'tipo_contenido' => $curso->tipo_contenido,
                'activo' => $curso->activo,
                'fecha_creacion' => $curso->fecha_creacion?->format('Y-m-d H:i:s')
            ];
        })->all();
    }

    private static function formatSolicitante($solicitante): array
    {
        if (!$solicitante) {
            return [];
        }

        return [
            'id_solicitante' => $solicitante->id_solicitante,
            'nombre' => $solicitante->nombre,
            'apellido' => $solicitante->apellido ?? '',
            'correo' => $solicitante->correo ?? '',
            'telefono' => $solicitante->telefono ?? '',
            'cargo' => $solicitante->cargo ?? '',
            'id_empresa' => $solicitante->id_empresa
        ];
    }


    public static function error(string $message, array $errors = []): array
    {
        return [
            'success' => false,
            'message' => $message,
            'errors' => $errors
        ];
    }

    public static function estudiantesAgregados(Capacitaciones $capacitacion, int $agregados, array $duplicados): array
    {
        return [
            'success' => true,
            'message' => 'Estudiantes agregados exitosamente.',
            'data' => [
                'capacitacion' => self::formatCapacitacion($capacitacion),
                'estudiantes_agregados' => $agregados,
                'estudiantes_duplicados' => $duplicados,
                'total_estudiantes' => $capacitacion->usuarios->count()
            ]
        ];
    }

    public static function estudiantesEliminados(Capacitaciones $capacitacion, int $eliminados, array $noEncontrados): array
    {
        return [
            'success' => true,
            'message' => 'Estudiantes eliminados exitosamente.',
            'data' => [
                'capacitacion' => self::formatCapacitacion($capacitacion),
                'estudiantes_eliminados' => $eliminados,
                'estudiantes_no_encontrados' => $noEncontrados,
                'total_estudiantes' => $capacitacion->usuarios->count()
            ]
        ];
    }

    public static function cursosAgregados(Capacitaciones $capacitacion, int $cursosAgregados, array $duplicados): array
    {
        return [
            'success' => true,
            'message' => 'Cursos agregados exitosamente a la capacitación.',
            'data' => [
                'capacitacion' => self::formatCapacitacion($capacitacion),
                'cursos_agregados' => $cursosAgregados,
                'duplicados_omitidos' => $duplicados,
                'total_cursos' => $capacitacion->cursos->count(),
                'cursos_actuales' => self::formatCursos($capacitacion->cursos)
            ]
        ];
    }

    public static function cursosEliminados(Capacitaciones $capacitacion, int $eliminados, array $noAsignados): array
    {
        return [
            'success' => true,
            'message' => 'Cursos eliminados exitosamente de la capacitación.',
            'data' => [
                'capacitacion' => self::formatCapacitacion($capacitacion),
                'cursos_eliminados' => $eliminados,
                'cursos_no_asignados' => $noAsignados,
                'total_cursos' => $capacitacion->cursos->count(),
                'cursos_restantes' => self::formatCursos($capacitacion->cursos)
            ]
        ];
    }

    private static function generateCapacitacionUrl(string $codigoUnico): string
    {
        $frontendUrl = config('app.frontend.url');
        $loginPath = config('app.frontend.capacitacion_login_path');
        
        return "{$frontendUrl}{$loginPath}/{$codigoUnico}";
    }
}
