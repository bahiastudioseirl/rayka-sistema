<?php

namespace App\Services;

use App\Repositories\UsuarioEstudianteRepository;

class UsuarioEstudianteService
{
    protected $usuarioEstudianteRepository;

    public function __construct(UsuarioEstudianteRepository $usuarioEstudianteRepository)
    {
        $this->usuarioEstudianteRepository = $usuarioEstudianteRepository;
    }

    public function obtenerCursosDeCapacitacion(int $idUsuario, int $idCapacitacion): array
    {
        $capacitacion = $this->usuarioEstudianteRepository->obtenerCapacitacion($idUsuario, $idCapacitacion);

        if (!$capacitacion) {
            return [
                'success' => false,
                'message' => 'No tienes acceso a esta capacitación'
            ];
        }

        $cursos = $this->usuarioEstudianteRepository->obtenerCursosDeCapacitacion($idUsuario, $idCapacitacion);

        return [
            'success' => true,
            'capacitacion' => [
                'id_capacitacion' => $capacitacion->id_capacitacion,
                'duracion_examen_min' => $capacitacion->duracion_examen_min,
                'max_intentos' => $capacitacion->max_intentos,
                'estado' => $capacitacion->estado,
                'fecha_creacion' => $capacitacion->fecha_creacion,
                'solicitante' => [
                    'nombre' => $capacitacion->solicitante_nombre,
                    'apellido' => $capacitacion->solicitante_apellido,
                    'cargo' => $capacitacion->solicitante_cargo,
                ],
                'empresa' => [
                    'nombre' => $capacitacion->empresa_nombre,
                ],
            ],
            'cursos' => $cursos->map(function($curso) {
                return [
                    'id_curso' => $curso->id_curso,
                    'titulo' => $curso->titulo,
                    'descripcion' => $curso->descripcion,
                    'url_imagen' => $curso->url_imagen,
                    'contenido' => $curso->contenido,
                    'tipo_contenido' => $curso->tipo_contenido,
                    'fecha_creacion' => $curso->fecha_creacion,
                    'creado_por' => [
                        'nombre' => $curso->creador_nombre,
                        'apellido' => $curso->creador_apellido,
                    ]
                ];
            })->values()->toArray(),
            'total_cursos' => $cursos->count()
        ];
    }

    public function obtenerCursosDisponibles(int $idUsuario): array
    {
        $cursos = $this->usuarioEstudianteRepository->obtenerCursosDelEstudiante($idUsuario);

        $capacitaciones = $this->usuarioEstudianteRepository->obtenerCapacitacionesDelEstudiante($idUsuario);

        $cursosAgrupados = $cursos->groupBy('id_capacitacion');

        $resultado = [
            'total_capacitaciones' => $capacitaciones->count(),
            'total_cursos' => $cursos->count(),
            'capacitaciones' => []
        ];

        foreach ($capacitaciones as $capacitacion) {
            $cursosCapacitacion = $cursosAgrupados->get($capacitacion->id_capacitacion, collect([]));
            
            $resultado['capacitaciones'][] = [
                'id_capacitacion' => $capacitacion->id_capacitacion,
                'duracion_examen_min' => $capacitacion->duracion_examen_min,
                'max_intentos' => $capacitacion->max_intentos,
                'estado' => $capacitacion->estado,
                'fecha_creacion' => $capacitacion->fecha_creacion,
                'solicitante' => [
                    'nombre' => $capacitacion->solicitante_nombre,
                    'apellido' => $capacitacion->solicitante_apellido,
                    'cargo' => $capacitacion->solicitante_cargo,
                ],
                'empresa' => [
                    'nombre' => $capacitacion->empresa_nombre,
                ],
                'cursos' => $cursosCapacitacion->map(function($curso) {
                    return [
                        'id_curso' => $curso->id_curso,
                        'titulo' => $curso->titulo,
                        'descripcion' => $curso->descripcion,
                        'url_imagen' => $curso->url_imagen,
                        'contenido' => $curso->contenido,
                        'tipo_contenido' => $curso->tipo_contenido,
                        'fecha_creacion' => $curso->fecha_creacion,
                        'creado_por' => [
                            'nombre' => $curso->creador_nombre,
                            'apellido' => $curso->creador_apellido,
                        ]
                    ];
                })->values()->toArray(),
                'total_cursos' => $cursosCapacitacion->count()
            ];
        }

        return $resultado;
    }
    public function verificarAccesoCurso(int $idUsuario, int $idCurso): bool
    {
        return $this->usuarioEstudianteRepository->tieneAccesoAlCurso($idUsuario, $idCurso);
    }
}
