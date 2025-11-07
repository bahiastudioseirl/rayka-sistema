<?php

namespace App\Http\Responses;

use App\Models\Cursos;
use Illuminate\Http\JsonResponse;

class CursoResponse
{

    public static function cursoCreado(Cursos $curso): JsonResponse
    {
        $datoCurso = [
            'id' => $curso->id_curso,
            'titulo' => $curso->titulo,
            'tipo_contenido' => $curso->tipo_contenido,
            'contenido' => $curso->contenido,
            'activo' => $curso->activo,
            'creador' => [
                'id' => $curso->creador->id_usuario ?? null,
                'nombre' => $curso->creador->nombre ?? null,
                'apellido' => $curso->creador->apellido ?? null
            ],
            'fecha_creacion' => $curso->fecha_creacion?->format('Y-m-d H:i:s'),
        ];

        return response()->json([
            'success' => true,
            'message' => 'Curso creado exitosamente',
            'data' => [
                'curso' => $datoCurso
            ]
        ], 201);
    }

    public static function cursoActualizado(Cursos $curso): JsonResponse
    {
        $datoCurso = [
            'id' => $curso->id_curso,
            'titulo' => $curso->titulo,
            'tipo_contenido' => $curso->tipo_contenido,
            'contenido' => $curso->contenido,
            'activo' => $curso->activo,
            'creador' => [
                'id' => $curso->creador->id_usuario ?? null,
                'nombre' => $curso->creador->nombre ?? null,
                'apellido' => $curso->creador->apellido ?? null
            ],
            'fecha_creacion' => $curso->fecha_creacion?->format('Y-m-d H:i:s'),
        ];

        return response()->json([
            'success' => true,
            'message' => 'Curso actualizado exitosamente',
            'data' => [
                'curso' => $datoCurso
            ]
        ], 200);
    }

}