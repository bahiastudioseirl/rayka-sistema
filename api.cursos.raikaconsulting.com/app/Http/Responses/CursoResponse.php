<?php

namespace App\Http\Responses;

use App\Models\Cursos;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;

class CursoResponse
{

    public static function cursoCreado(Cursos $curso): JsonResponse
    {
        $datoCurso = [
            'id_curso' => $curso->id_curso,
            'titulo' => $curso->titulo,
            'descripcion' => $curso->descripcion,
            'url_imagen' => $curso->url_imagen,
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
            'id_curso' => $curso->id_curso,
            'titulo' => $curso->titulo,
            'descripcion' => $curso->descripcion,
            'url_imagen' => $curso->url_imagen,
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

    public static function listarCursos(Collection $cursos): JsonResponse
    {
        $datosCursos = $cursos->map(function (Cursos $curso) {
            return [
                'id_curso' => $curso->id_curso,
                'titulo' => $curso->titulo,
                'descripcion' => $curso->descripcion,
                'url_imagen' => $curso->url_imagen,
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
        })->toArray();

        return response()->json([
            'success' => true,
            'data' => $datosCursos
        ], 200);
    }

}