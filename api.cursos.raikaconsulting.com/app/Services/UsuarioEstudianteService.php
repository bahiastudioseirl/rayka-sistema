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
        $tieneAcceso = $this->usuarioEstudianteRepository->tieneAccesoAlCurso($idUsuario, $idCurso);
        
        if (!$tieneAcceso) {
            return [
                'success' => false,
                'message' => 'No tienes acceso a este curso'
            ];
        }

        $actualizado = $this->usuarioEstudianteRepository->marcarVideoFinalizado($idUsuario, $idCurso);

        if (!$actualizado) {
            return [
                'success' => false,
                'message' => 'No se pudo actualizar el progreso'
            ];
        }

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

    public function rendirExamen(int $idUsuario, int $idCurso, array $respuestas): array
    {
        $tieneAcceso = $this->usuarioEstudianteRepository->tieneAccesoAlCurso($idUsuario, $idCurso);
        
        if (!$tieneAcceso) {
            return [
                'success' => false,
                'message' => 'No tienes acceso a este curso'
            ];
        }

        $examen = $this->usuarioEstudianteRepository->obtenerExamenDelCurso($idCurso);

        if (!$examen) {
            return [
                'success' => false,
                'message' => 'Este curso no tiene un examen asociado'
            ];
        }

        $progreso = $this->usuarioEstudianteRepository->obtenerProgresoCurso($idUsuario, $idCurso);

        if (!$progreso || !$progreso->video_finalizado) {
            return [
                'success' => false,
                'message' => 'Debes finalizar el video del curso antes de rendir el examen'
            ];
        }

        $maxIntentos = $this->usuarioEstudianteRepository->obtenerMaxIntentosCapacitacion($idUsuario, $idCurso);
        
        $intentosUsados = $progreso ? $progreso->intentos_usados + 1 : 1;

        if ($maxIntentos && $intentosUsados > $maxIntentos) {
            return [
                'success' => false,
                'message' => "Has alcanzado el máximo de intentos permitidos ({$maxIntentos})"
            ];
        }

        $preguntas = $this->usuarioEstudianteRepository->obtenerPreguntasDelExamen($examen->id_examen);
        $totalPreguntas = count($preguntas);

        if ($totalPreguntas === 0) {
            return [
                'success' => false,
                'message' => 'El examen no tiene preguntas configuradas'
            ];
        }

        if (count($respuestas) !== $totalPreguntas) {
            return [
                'success' => false,
                'message' => "Debes responder todas las preguntas ({$totalPreguntas})"
            ];
        }

        $respuestasCorrectas = 0;
        $detalleRespuestas = [];

        foreach ($respuestas as $respuesta) {
            $esCorrecta = $this->usuarioEstudianteRepository->verificarRespuesta($respuesta['id_respuesta']);
            
            if ($esCorrecta) {
                $respuestasCorrectas++;
            }

            $detalleRespuestas[] = [
                'id_pregunta' => $respuesta['id_pregunta'],
                'id_respuesta' => $respuesta['id_respuesta'],
                'es_correcta' => $esCorrecta
            ];
        }

        $nota = ($respuestasCorrectas / $totalPreguntas) * 20;
        $nota = round($nota, 2);

        $resultado = $nota >= 10.5 ? 'aprobado' : 'desaprobado';

        // Actualizar el progreso
        $this->usuarioEstudianteRepository->actualizarProgresoExamen(
            $idUsuario,
            $idCurso,
            $nota,
            $resultado,
            $intentosUsados
        );

        // Obtener el ID del progreso para registrar el intento
        $progresoActualizado = $this->usuarioEstudianteRepository->obtenerProgresoCurso($idUsuario, $idCurso);
        
        // Registrar el intento en el historial
        $this->usuarioEstudianteRepository->registrarIntentoExamen(
            $progresoActualizado->id_progreso,
            $intentosUsados,
            $nota,
            $respuestasCorrectas,
            $totalPreguntas,
            $resultado
        );

        // Obtener mejor puntaje
        $mejorPuntaje = $this->usuarioEstudianteRepository->obtenerMejorPuntaje($progresoActualizado->id_progreso);

        return [
            'success' => true,
            'message' => $resultado === 'aprobado' ? '¡Felicidades! Has aprobado el examen' : 'No has aprobado el examen',
            'resultado' => [
                'nota' => $nota,
                'resultado' => $resultado,
                'respuestas_correctas' => $respuestasCorrectas,
                'total_preguntas' => $totalPreguntas,
                'porcentaje' => round(($respuestasCorrectas / $totalPreguntas) * 100, 2),
                'intentos_usados' => $intentosUsados,
                'intentos_restantes' => $maxIntentos ? ($maxIntentos - $intentosUsados) : null,
                'mejor_puntaje' => $mejorPuntaje,
                'detalle_respuestas' => $detalleRespuestas
            ]
        ];
    }

    public function obtenerHistorialIntentos(int $idUsuario, int $idCurso): array
    {
        // Verificar acceso
        $tieneAcceso = $this->usuarioEstudianteRepository->tieneAccesoAlCurso($idUsuario, $idCurso);
        
        if (!$tieneAcceso) {
            return [
                'success' => false,
                'message' => 'No tienes acceso a este curso'
            ];
        }

        // Obtener progreso
        $progreso = $this->usuarioEstudianteRepository->obtenerProgresoCurso($idUsuario, $idCurso);

        if (!$progreso) {
            return [
                'success' => true,
                'historial_intentos' => [],
                'resumen' => [
                    'mejor_puntaje' => null,
                    'intentos_usados' => 0,
                    'intentos_restantes' => null,
                    'estado' => null
                ]
            ];
        }

        // Obtener historial
        $intentos = $this->usuarioEstudianteRepository->obtenerHistorialIntentos($progreso->id_progreso);
        $mejorPuntaje = $this->usuarioEstudianteRepository->obtenerMejorPuntaje($progreso->id_progreso);
        $maxIntentos = $this->usuarioEstudianteRepository->obtenerMaxIntentosCapacitacion($idUsuario, $idCurso);

        return [
            'success' => true,
            'historial_intentos' => $intentos->map(function($intento) {
                return [
                    'num_intento' => $intento->num_intento,
                    'fecha_intento' => $intento->fecha_intento,
                    'nota' => $intento->nota,
                    'respuestas_correctas' => "{$intento->respuestas_correctas}/{$intento->total_preguntas}",
                    'resultado' => $intento->resultado
                ];
            })->toArray(),
            'resumen' => [
                'mejor_puntaje' => $mejorPuntaje,
                'intentos_usados' => $progreso->intentos_usados,
                'intentos_restantes' => $maxIntentos ? ($maxIntentos - $progreso->intentos_usados) : null,
                'estado' => $progreso->resultado_examen
            ]
        ];
    }
}
