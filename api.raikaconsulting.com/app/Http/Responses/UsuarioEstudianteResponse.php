<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;

class UsuarioEstudianteResponse
{
    public static function cursosDeCapacitacion(array $data): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Cursos de la capacitación obtenidos exitosamente',
            'data' => [
                'capacitacion' => $data['capacitacion'],
                'cursos' => $data['cursos'],
                'total_cursos' => $data['total_cursos']
            ]
        ], 200);
    }

    public static function cursosDisponibles(array $data): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Capacitaciones y cursos obtenidos exitosamente',
            'data' => [
                'total_capacitaciones' => $data['total_capacitaciones'],
                'total_cursos' => $data['total_cursos'],
                'capacitaciones' => $data['capacitaciones']
            ]
        ], 200);
    }

    public static function accesoNoAutorizado(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'No tienes acceso a esta capacitación'
        ], 403);
    }

    public static function accesoNoAutorizadoCurso(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'No tienes acceso a este curso'
        ], 403);
    }

    public static function cursoDetalle(array $data): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Curso obtenido exitosamente',
            'data' => $data['curso']
        ], 200);
    }

    public static function cursoNoEncontrado(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Curso no encontrado'
        ], 404);
    }

    public static function videoFinalizado(array $data): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $data['message'],
            'data' => $data['progreso']
        ], 200);
    }

    public static function resultadoExamen(array $data): JsonResponse
    {
        $statusCode = $data['resultado']['resultado'] === 'aprobado' ? 200 : 200;
        
        return response()->json([
            'success' => true,
            'message' => $data['message'],
            'data' => $data['resultado']
        ], $statusCode);
    }

    public static function videoNoFinalizado(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Debes finalizar el video del curso antes de rendir el examen'
        ], 403);
    }

    public static function intentosAgotados(int $maxIntentos): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => "Has alcanzado el máximo de intentos permitidos ({$maxIntentos})"
        ], 403);
    }

    public static function examenNoDisponible(string $message): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message
        ], 400);
    }

    public static function error(string $message = 'Error al procesar la solicitud'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message
        ], 500);
    }
}
