<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UsuarioEstudianteService;
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
                return response()->json([
                    'success' => false,
                    'message' => $data['message']
                ], 403);
            }

            return response()->json([
                'success' => true,
                'message' => 'Cursos obtenidos exitosamente',
                'data' => $data
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los cursos',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
