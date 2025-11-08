<?php

namespace App\Http\Controllers;

use App\Http\Request\Capacitaciones\CrearCapacitacionRequest;
use App\Http\Request\Capacitaciones\AgregarEstudiantesCapacitacionRequest;
use App\Http\Request\Capacitaciones\EliminarEstudiantesCapacitacionRequest;
use App\Http\Request\Capacitaciones\AgregarCursosCapacitacionRequest;
use App\Http\Request\Capacitaciones\EliminarCursosCapacitacionRequest;
use App\DTOs\Capacitaciones\CrearCapacitacionDTO;
use App\Services\CapacitacionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Exception;

class CapacitacionController extends Controller
{
    public function __construct(
        private readonly CapacitacionService $capacitacionService
    ) {}

    public function crear(CrearCapacitacionRequest $request): JsonResponse
    {
        try {
            $capacitacionDTO = CrearCapacitacionDTO::fromRequest($request->validated());
            $resultado = $this->capacitacionService->crearCapacitacion($capacitacionDTO);
            
            if ($resultado['success']) {
                return response()->json([
                    'success' => true,
                    'message' => $resultado['message'],
                    'data' => $resultado['data']
                ], 201);
            }
            
            return response()->json([
                'success' => false,
                'message' => $resultado['message'],
                'error' => $resultado['error'] ?? null
            ], 400);
            
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación.',
                'errors' => $e->errors()
            ], 422);
            
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function verCapacitaciones(): JsonResponse
    {
        try {
            $resultado = $this->capacitacionService->obtenerCapacitaciones();
            
            if ($resultado['success']) {
                return response()->json([
                    'success' => true,
                    'data' => $resultado['data']
                ], 200);
            }
            
            return response()->json([
                'success' => false,
                'message' => $resultado['message']
            ], 400);
            
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function verCapacitacionPorId(int $id): JsonResponse
    {
        try {
            $resultado = $this->capacitacionService->obtenerCapacitacion($id);
            
            if ($resultado['success']) {
                return response()->json([
                    'success' => true,
                    'data' => $resultado['data']
                ], 200);
            }
            
            return response()->json([
                'success' => false,
                'message' => $resultado['message']
            ], 404);
            
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function agregarEstudiantes(AgregarEstudiantesCapacitacionRequest $request, int $id): JsonResponse
    {
        try {
            $resultado = $this->capacitacionService->agregarEstudiantes($id, $request->validated()['usuarios_estudiantes']);
            return response()->json($resultado, 200);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        } catch (Exception $e) {
            return response()->json(['error' => 'Error interno del servidor'], 500);
        }
    }

    public function eliminarEstudiantes(EliminarEstudiantesCapacitacionRequest $request, int $id): JsonResponse
    {
        try {
            $resultado = $this->capacitacionService->eliminarEstudiantes($id, $request->validated()['usuarios_estudiantes']);
            return response()->json($resultado, 200);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        } catch (Exception $e) {
            return response()->json(['error' => 'Error interno del servidor'], 500);
        }
    }

    public function agregarCursos(AgregarCursosCapacitacionRequest $request, int $id): JsonResponse
    {
        try {
            $resultado = $this->capacitacionService->agregarCursos($id, $request->validated()['cursos']);
            return response()->json($resultado, 200);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        } catch (Exception $e) {
            return response()->json(['error' => 'Error interno del servidor'], 500);
        }
    }

    public function eliminarCursos(EliminarCursosCapacitacionRequest $request, int $id): JsonResponse
    {
        try {
            $resultado = $this->capacitacionService->eliminarCursos($id, $request->validated()['cursos']);
            return response()->json($resultado, 200);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        } catch (Exception $e) {
            return response()->json(['error' => 'Error interno del servidor'], 500);
        }
    }

}