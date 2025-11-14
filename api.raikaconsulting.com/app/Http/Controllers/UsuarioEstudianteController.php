<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UsuarioEstudianteService;
use App\Http\Responses\UsuarioEstudianteResponse;
use App\Http\Request\Progresos\ActualizarProgresoVideoRequest;
use App\Http\Request\Progresos\RendirExamenRequest;
use Illuminate\Http\JsonResponse;

class UsuarioEstudianteController extends Controller
{
    protected $usuarioEstudianteService;

    public function __construct(UsuarioEstudianteService $usuarioEstudianteService)
    {
        $this->usuarioEstudianteService = $usuarioEstudianteService;
    }

    public function listarMisCursos(Request $request): JsonResponse
    {
        try {
            $usuario = $request->get('authenticated_user');
            $idCapacitacion = $request->get('id_capacitacion');

            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            if (!$idCapacitacion) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se pudo identificar la capacitación'
                ], 400);
            }

            $data = $this->usuarioEstudianteService->obtenerCursosDeCapacitacion(
                $usuario->id_usuario, 
                $idCapacitacion
            );

            if (isset($data['success']) && $data['success'] === false) {
                return UsuarioEstudianteResponse::accesoNoAutorizado();
            }

            return UsuarioEstudianteResponse::cursosDeCapacitacion($data);

        } catch (\Exception $e) {
            return UsuarioEstudianteResponse::error('Error al obtener los cursos: ' . $e->getMessage());
        }
    }

    public function mostrarCursoPorId(int $id, Request $request): JsonResponse
    {
        try {
            $usuario = $request->get('authenticated_user');

            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            $data = $this->usuarioEstudianteService->obtenerCursoPorId(
                $usuario->id_usuario,
                $id
            );

            if (isset($data['success']) && $data['success'] === false) {
                if ($data['message'] === 'No tienes acceso a este curso') {
                    return UsuarioEstudianteResponse::accesoNoAutorizadoCurso();
                }
                return UsuarioEstudianteResponse::cursoNoEncontrado();
            }

            return UsuarioEstudianteResponse::cursoDetalle($data);

        } catch (\Exception $e) {
            return UsuarioEstudianteResponse::error('Error al obtener el curso: ' . $e->getMessage());
        }
    }

    public function marcarVideoFinalizado(int $id, ActualizarProgresoVideoRequest $request): JsonResponse
    {
        try {
            $usuario = $request->get('authenticated_user');

            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            $data = $this->usuarioEstudianteService->marcarVideoFinalizado(
                $usuario->id_usuario,
                $id
            );

            if (isset($data['success']) && $data['success'] === false) {
                if ($data['message'] === 'No tienes acceso a este curso') {
                    return UsuarioEstudianteResponse::accesoNoAutorizadoCurso();
                }
                return UsuarioEstudianteResponse::error($data['message']);
            }

            return UsuarioEstudianteResponse::videoFinalizado($data);

        } catch (\Exception $e) {
            return UsuarioEstudianteResponse::error('Error al marcar el video como finalizado: ' . $e->getMessage());
        }
    }

    public function rendirExamen(int $id, RendirExamenRequest $request): JsonResponse
    {
        try {
            $usuario = $request->get('authenticated_user');

            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            $data = $this->usuarioEstudianteService->rendirExamen(
                $usuario->id_usuario,
                $id,
                $request->input('respuestas')
            );

            if (isset($data['success']) && $data['success'] === false) {
                // Manejo específico de errores con códigos HTTP apropiados
                if ($data['message'] === 'No tienes acceso a este curso') {
                    return UsuarioEstudianteResponse::accesoNoAutorizadoCurso();
                }
                
                if ($data['message'] === 'Debes finalizar el video del curso antes de rendir el examen') {
                    return UsuarioEstudianteResponse::videoNoFinalizado();
                }
                
                if (str_contains($data['message'], 'Has alcanzado el máximo de intentos')) {
                    preg_match('/\((\d+)\)/', $data['message'], $matches);
                    $maxIntentos = isset($matches[1]) ? (int)$matches[1] : 0;
                    return UsuarioEstudianteResponse::intentosAgotados($maxIntentos);
                }
                
                // Otros errores relacionados con el examen (400 Bad Request)
                return UsuarioEstudianteResponse::examenNoDisponible($data['message']);
            }

            return UsuarioEstudianteResponse::resultadoExamen($data);

        } catch (\Exception $e) {
            return UsuarioEstudianteResponse::error('Error al procesar el examen: ' . $e->getMessage());
        }
    }

    public function obtenerHistorialIntentos(int $id, Request $request): JsonResponse
    {
        try {
            $usuario = $request->get('authenticated_user');

            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            $data = $this->usuarioEstudianteService->obtenerHistorialIntentos(
                $usuario->id_usuario,
                $id
            );

            if (isset($data['success']) && $data['success'] === false) {
                if ($data['message'] === 'No tienes acceso a este curso') {
                    return UsuarioEstudianteResponse::accesoNoAutorizadoCurso();
                }
                return UsuarioEstudianteResponse::error($data['message']);
            }

            return UsuarioEstudianteResponse::historialIntentos($data);

        } catch (\Exception $e) {
            return UsuarioEstudianteResponse::error('Error al obtener el historial: ' . $e->getMessage());
        }
    }
}
