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

    public function obtenerCursoPorId(int $idUsuario, int $idCurso): array
    {
        // Verificar que el estudiante tenga acceso al curso
        $tieneAcceso = $this->usuarioEstudianteRepository->tieneAccesoAlCurso($idUsuario, $idCurso);
        
        if (!$tieneAcceso) {
            return [
                'success' => false,
                'message' => 'No tienes acceso a este curso'
            ];
        }

        // Obtener la información completa del curso
        $curso = $this->usuarioEstudianteRepository->obtenerCursoPorId($idCurso);

        if (!$curso) {
            return [
                'success' => false,
                'message' => 'Curso no encontrado'
            ];
        }

        // Obtener el examen del curso
        $examen = $this->usuarioEstudianteRepository->obtenerExamenDelCurso($idCurso);

        $examenData = null;
        if ($examen) {
            // Obtener las preguntas con sus respuestas (sin mostrar cuál es correcta)
            $preguntas = $this->usuarioEstudianteRepository->obtenerPreguntasDelExamen($examen->id_examen);
            
            $examenData = [
                'id_examen' => $examen->id_examen,
                'titulo' => $examen->titulo,
                'total_preguntas' => count($preguntas),
                'preguntas' => $preguntas
            ];
        }

        return [
            'success' => true,
            'curso' => [
                'id_curso' => $curso->id_curso,
                'titulo' => $curso->titulo,
                'descripcion' => $curso->descripcion,
                'url_imagen' => $curso->url_imagen,
                'contenido' => $curso->contenido,
                'tipo_contenido' => $curso->tipo_contenido,
                'activo' => $curso->activo,
                'fecha_creacion' => $curso->fecha_creacion,
                'creado_por' => [
                    'id_usuario' => $curso->creado_por,
                    'nombre' => $curso->creador_nombre,
                    'apellido' => $curso->creador_apellido,
                ],
                'examen' => $examenData
            ]
        ];
    }

    public function marcarVideoFinalizado(int $idUsuario, int $idCurso): array
    {
        // Verificar que el estudiante tenga acceso al curso
        $tieneAcceso = $this->usuarioEstudianteRepository->tieneAccesoAlCurso($idUsuario, $idCurso);
        
        if (!$tieneAcceso) {
            return [
                'success' => false,
                'message' => 'No tienes acceso a este curso'
            ];
        }

        // Marcar el video como finalizado
        $actualizado = $this->usuarioEstudianteRepository->marcarVideoFinalizado($idUsuario, $idCurso);

        if (!$actualizado) {
            return [
                'success' => false,
                'message' => 'No se pudo actualizar el progreso'
            ];
        }

        // Obtener el progreso actualizado
        $progreso = $this->usuarioEstudianteRepository->obtenerProgresoCurso($idUsuario, $idCurso);

        return [
            'success' => true,
            'message' => 'Video marcado como finalizado',
            'progreso' => [
                'id_progreso' => $progreso->id_progreso,
                'video_finalizado' => $progreso->video_finalizado,
                'completado' => $progreso->completado,
                'nota' => $progreso->nota,
                'intentos_usados' => $progreso->intentos_usados
            ]
        ];
    }
}
