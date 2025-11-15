<?php

namespace App\Services;

use App\DTOs\Examenes\ActualizarExamenDTO;
use App\DTOs\Examenes\AgregarPreguntasDTO;
use App\DTOs\Examenes\AgregarRespuestasDTO;
use App\DTOs\Examenes\CrearExamenDTO;
use App\Repositories\ExamenRepository;
use Exception;

class ExamenService
{
    protected $examenRepository;

    public function __construct(ExamenRepository $examenRepository)
    {
        $this->examenRepository = $examenRepository;
    }

    public function crearExamen(CrearExamenDTO $dto): array
    {
        try {
            if (!$this->examenRepository->cursoExiste($dto->id_curso)) {
                return [
                    'success' => false,
                    'message' => 'El curso especificado no existe.'
                ];
            }
            
            if($this->examenRepository->verificarSiCursoTieneExamenes($dto->id_curso)) {
                return [
                    'success' => false,
                    'message' => 'El curso ya tiene un examen asociado.'
                ];
            }

            $validacion = $this->validarDatosExamen($dto->toArray());
            if (!$validacion['valido']) {
                return [
                    'success' => false,
                    'message' => 'Datos de examen inválidos.',
                    'errores' => $validacion['errores']
                ];
            }

            $examen = $this->examenRepository->crearExamenCompleto($dto->toArray());

            return [
                'success' => true,
                'message' => 'Examen creado exitosamente.',
                'data' => $this->formatearExamen($examen)
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al crear el examen.',
                'error' => $e->getMessage()
            ];
        }
    }
    public function obtenerExamen(int $idExamen): array
    {
        try {
            $examen = $this->examenRepository->obtenerPorId($idExamen);

            if (!$examen) {
                return [
                    'success' => false,
                    'message' => 'Examen no encontrado.'
                ];
            }

            return [
                'success' => true,
                'data' => $this->formatearExamen($examen)
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener el examen.',
                'error' => $e->getMessage()
            ];
        }
    }

    private function validarDatosExamen(array $datos): array
    {
        $errores = [];

        if (empty($datos['titulo'])) {
            $errores[] = 'El título del examen es requerido.';
        }

        if (!isset($datos['preguntas']) || !is_array($datos['preguntas']) || empty($datos['preguntas'])) {
            $errores[] = 'El examen debe tener al menos una pregunta.';
        } else {
            foreach ($datos['preguntas'] as $index => $pregunta) {
                $numPregunta = $index + 1;

                if (empty($pregunta['texto'])) {
                    $errores[] = "La pregunta #{$numPregunta} debe tener texto.";
                }

                if (!isset($pregunta['respuestas']) || !is_array($pregunta['respuestas']) || empty($pregunta['respuestas'])) {
                    $errores[] = "La pregunta #{$numPregunta} debe tener al menos una respuesta.";
                } else {
                    $tieneRespuestaCorrecta = false;
                    $cantidadRespuestas = count($pregunta['respuestas']);

                    if ($cantidadRespuestas < 2) {
                        $errores[] = "La pregunta #{$numPregunta} debe tener al menos 2 respuestas.";
                    }

                    foreach ($pregunta['respuestas'] as $respIndex => $respuesta) {
                        $numRespuesta = $respIndex + 1;

                        if (empty($respuesta['texto'])) {
                            $errores[] = "La respuesta #{$numRespuesta} de la pregunta #{$numPregunta} debe tener texto.";
                        }

                        if (!isset($respuesta['es_correcta'])) {
                            $errores[] = "La respuesta #{$numRespuesta} de la pregunta #{$numPregunta} debe especificar si es correcta.";
                        }

                        if (isset($respuesta['es_correcta']) && $respuesta['es_correcta'] === true) {
                            $tieneRespuestaCorrecta = true;
                        }
                    }

                    if (!$tieneRespuestaCorrecta) {
                        $errores[] = "La pregunta #{$numPregunta} debe tener al menos una respuesta correcta.";
                    }
                }
            }
        }

        return [
            'valido' => empty($errores),
            'errores' => $errores
        ];
    }

    private function formatearExamen($examen): array
    {
        return [
            'id_examen' => $examen->id_examen,
            'titulo' => $examen->titulo,
            'id_curso' => $examen->id_curso,
            'curso' => [
                'id_curso' => $examen->curso->id_curso,
                'titulo' => $examen->curso->titulo
            ],
            'total_preguntas' => $examen->preguntas->count(),
            'preguntas' => $examen->preguntas->map(function ($pregunta) {
                return [
                    'id_pregunta' => $pregunta->id_pregunta,
                    'texto' => $pregunta->texto,
                    'respuestas' => $pregunta->respuestas->map(function ($respuesta) {
                        return [
                            'id_respuesta' => $respuesta->id_respuesta,
                            'texto' => $respuesta->texto,
                            'es_correcta' => $respuesta->es_correcta
                        ];
                    })
                ];
            })
        ];
    }
    public function agregarPreguntas(int $idExamen, AgregarPreguntasDTO $dto): array
    {
        try {
            $examen = $this->examenRepository->obtenerPorId($idExamen);
            
            if (!$examen) {
                return [
                    'success' => false,
                    'message' => 'El examen especificado no existe.'
                ];
            }

            $validacion = $this->validarDatosExamen([
                'titulo' => $examen->titulo,
                'preguntas' => $dto->preguntas
            ]);

            if (!$validacion['valido']) {
                return [
                    'success' => false,
                    'message' => 'Datos de preguntas inválidos.',
                    'errores' => $validacion['errores']
                ];
            }

            $examenActualizado = $this->examenRepository->agregarPreguntas($idExamen, $dto->preguntas);

            return [
                'success' => true,
                'message' => 'Preguntas agregadas exitosamente.',
                'data' => $this->formatearExamen($examenActualizado)
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al agregar preguntas al examen.',
                'error' => $e->getMessage()
            ];
        }
    }

    public function actualizarExamen(int $idExamen, ActualizarExamenDTO $dto): array
    {
        try {
            $examen = $this->examenRepository->obtenerPorId($idExamen);
            
            if (!$examen) {
                return [
                    'success' => false,
                    'message' => 'El examen especificado no existe.'
                ];
            }

            $examenActualizado = $this->examenRepository->actualizarExamen($idExamen, $dto->toArray());

            return [
                'success' => true,
                'message' => 'Examen actualizado exitosamente.',
                'data' => $this->formatearExamen($examenActualizado)
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al actualizar el examen.',
                'error' => $e->getMessage()
            ];
        }
    }    public function eliminarPregunta(int $idExamen, int $idPregunta): array
    {
        try {
            $examen = $this->examenRepository->obtenerPorId($idExamen);
            
            if (!$examen) {
                return [
                    'success' => false,
                    'message' => 'El examen especificado no existe.'
                ];
            }

            if (!$this->examenRepository->preguntaPerteneceAExamen($idPregunta, $idExamen)) {
                return [
                    'success' => false,
                    'message' => 'La pregunta no pertenece a este examen.'
                ];
            }

            $eliminado = $this->examenRepository->eliminarPregunta($idPregunta);

            if (!$eliminado) {
                return [
                    'success' => false,
                    'message' => 'No se pudo eliminar la pregunta.'
                ];
            }

            $examenActualizado = $this->examenRepository->obtenerPorId($idExamen);

            return [
                'success' => true,
                'message' => 'Pregunta eliminada exitosamente.',
                'data' => $this->formatearExamen($examenActualizado)
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al eliminar la pregunta.',
                'error' => $e->getMessage()
            ];
        }
    }

    public function obtenerExamenesPorCurso(int $idCurso): array
    {
        try {
            if (!$this->examenRepository->cursoExiste($idCurso)) {
                return [
                    'success' => false,
                    'message' => 'El curso especificado no existe.'
                ];
            }

            $examenes = $this->examenRepository->obtenerPorCurso($idCurso);

            return [
                'success' => true,
                'data' => $examenes->map(function ($examen) {
                    return $this->formatearExamen($examen);
                })->values()->all()
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener los exámenes del curso.',
                'error' => $e->getMessage()
            ];
        }
    }

    public function listarExamenesConCursos(): array
    {
        try {
            $examenes = $this->examenRepository->listarExamenesJuntoConCursos();

            return [
                'success' => true,
                'data' => $examenes->map(function ($examen) {
                    return $this->formatearExamen($examen);
                })->values()->all()
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al listar los exámenes con sus cursos.',
                'error' => $e->getMessage()
            ];
        }
    }

    public function agregarRespuestas(int $idPregunta, AgregarRespuestasDTO $dto): array
    {
        try {
            $pregunta = $this->examenRepository->obtenerPreguntaPorId($idPregunta);

            if (!$pregunta) {
                return [
                    'success' => false,
                    'message' => 'Pregunta no encontrada.'
                ];
            }

            $tieneCorrecta = collect($dto->respuestas)->contains('es_correcta', true);
            $respuestasActuales = $pregunta->respuestas;
            $yaCorrecta = $respuestasActuales->where('es_correcta', true)->count();
            $nuevasCorrectas = collect($dto->respuestas)->where('es_correcta', true)->count();

            // Solo bloquear si NO hay ninguna respuesta correcta en BD ni en el request
            if (!$tieneCorrecta && $yaCorrecta === 0) {
                return [
                    'success' => false,
                    'message' => 'Debe haber al menos una respuesta correcta.',
                    'errors' => [
                        'respuestas' => ['Debe haber al menos una respuesta correcta.']
                    ]
                ];
            }

            if (($yaCorrecta + $nuevasCorrectas) > 1) {
                return [
                    'success' => false,
                    'message' => 'Solo puede haber una respuesta correcta por pregunta.'
                ];
            }

            $respuestasCreadas = $this->examenRepository->agregarRespuestasAPregunta($idPregunta, $dto->respuestas);

            $preguntaActualizada = $this->examenRepository->obtenerPreguntaPorId($idPregunta);

            return [
                'success' => true,
                'message' => 'Respuestas agregadas exitosamente.',
                'data' => [
                    'id_pregunta' => $preguntaActualizada->id_pregunta,
                    'texto' => $preguntaActualizada->texto,
                    'respuestas' => $preguntaActualizada->respuestas->map(function ($respuesta) {
                        return [
                            'id_respuesta' => $respuesta->id_respuesta,
                            'texto' => $respuesta->texto,
                            'es_correcta' => $respuesta->es_correcta
                        ];
                    })->values()->all()
                ]
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al agregar respuestas.',
                'error' => $e->getMessage()
            ];
        }
    }

    public function eliminarRespuesta(int $idPregunta, int $idRespuesta): array
    {
        try {
            $pregunta = $this->examenRepository->obtenerPreguntaPorId($idPregunta);

            if (!$pregunta) {
                return [
                    'success' => false,
                    'message' => 'Pregunta no encontrada.'
                ];
            }

            $respuesta = $this->examenRepository->obtenerRespuestaPorId($idRespuesta);

            if (!$respuesta || $respuesta->id_pregunta !== $idPregunta) {
                return [
                    'success' => false,
                    'message' => 'Respuesta no encontrada o no pertenece a esta pregunta.'
                ];
            }

            // Permitir eliminar cualquier respuesta sin restricciones

            $this->examenRepository->eliminarRespuesta($idRespuesta);

            return [
                'success' => true,
                'message' => 'Respuesta eliminada exitosamente.'
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al eliminar la respuesta.',
                'error' => $e->getMessage()
            ];
        }
    }
}
