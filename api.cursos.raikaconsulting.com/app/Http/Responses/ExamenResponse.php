<?php

namespace App\Http\Responses;

use App\Models\Examenes;

class ExamenResponse
{
    public static function created(Examenes $examen): array
    {
        return [
            'success' => true,
            'message' => 'Examen creado exitosamente.',
            'data' => self::formatExamen($examen)
        ];
    }

    public static function show(Examenes $examen): array
    {
        return [
            'success' => true,
            'data' => self::formatExamen($examen)
        ];
    }

    public static function preguntasAgregadas(Examenes $examen, int $cantidadAgregadas): array
    {
        return [
            'success' => true,
            'message' => "Se agregaron {$cantidadAgregadas} pregunta(s) exitosamente.",
            'data' => self::formatExamen($examen)
        ];
    }

    public static function error(string $message, array $errores = []): array
    {
        $response = [
            'success' => false,
            'message' => $message
        ];

        if (!empty($errores)) {
            $response['errores'] = $errores;
        }

        return $response;
    }

    private static function formatExamen(Examenes $examen): array
    {
        $data = [
            'id_examen' => $examen->id_examen,
            'titulo' => $examen->titulo,
            'id_curso' => $examen->id_curso,
            'total_preguntas' => $examen->preguntas->count()
        ];

        if ($examen->relationLoaded('curso') && $examen->curso) {
            $data['curso'] = [
                'id_curso' => $examen->curso->id_curso,
                'titulo' => $examen->curso->titulo,
                'tipo_contenido' => $examen->curso->tipo_contenido ?? null,
                'activo' => $examen->curso->activo ?? true
            ];
        }

        if ($examen->relationLoaded('preguntas')) {
            $data['preguntas'] = $examen->preguntas->map(function ($pregunta) {
                return self::formatPregunta($pregunta);
            })->values()->all();
        }

        return $data;
    }

    private static function formatPregunta($pregunta): array
    {
        $data = [
            'id_pregunta' => $pregunta->id_pregunta,
            'texto' => $pregunta->texto,
            'id_examen' => $pregunta->id_examen
        ];

        // Agregar respuestas si están cargadas
        if ($pregunta->relationLoaded('respuestas')) {
            $data['respuestas'] = $pregunta->respuestas->map(function ($respuesta) {
                return [
                    'id_respuesta' => $respuesta->id_respuesta,
                    'texto' => $respuesta->texto,
                    'es_correcta' => $respuesta->es_correcta
                ];
            })->values()->all();
            
            $data['total_respuestas'] = $pregunta->respuestas->count();
        }

        return $data;
    }

    public static function index($examenes): array
    {
        return [
            'success' => true,
            'data' => $examenes->map(function ($examen) {
                return [
                    'id_examen' => $examen->id_examen,
                    'titulo' => $examen->titulo,
                    'id_curso' => $examen->id_curso,
                    'total_preguntas' => $examen->preguntas->count()
                ];
            })->values()->all()
        ];
    }
}
