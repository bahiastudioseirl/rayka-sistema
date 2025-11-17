<?php

namespace App\Http\Controllers;

use App\DTOs\Examenes\ActualizarExamenDTO;
use App\DTOs\Examenes\AgregarPreguntasDTO;
use App\DTOs\Examenes\AgregarRespuestasDTO;
use App\DTOs\Examenes\CrearExamenDTO;
use App\Http\Request\Examen\AgregarPreguntasRequest;
use App\Http\Request\Examen\AgregarRespuestasRequest;
use App\Http\Request\Examen\ActualizarExamenRequest;
use App\Http\Request\Examen\CrearExamenRequest;
use App\Http\Responses\ExamenResponse;
use App\Services\ExamenService;
use Illuminate\Http\JsonResponse;

class ExamenController extends Controller
{
    protected $examenService;

    public function __construct(ExamenService $examenService)
    {
        $this->examenService = $examenService;
    }

    public function crear(CrearExamenRequest $request): JsonResponse
    {
        try {
            $dto = CrearExamenDTO::fromRequest($request->validated());
            $resultado = $this->examenService->crearExamen($dto);

            if ($resultado['success']) {
                return response()->json($resultado, 201);
            }

            return response()->json(
                ExamenResponse::error($resultado['message'], $resultado['errores'] ?? []),
                400
            );

        } catch (\Exception $e) {
            return response()->json(
                ExamenResponse::error('Error interno del servidor.'),
                500
            );
        }
    }

    public function obtenerPorId(int $id): JsonResponse
    {
        try {
            $resultado = $this->examenService->obtenerExamen($id);

            if ($resultado['success']) {
                return response()->json($resultado, 200);
            }

            return response()->json(
                ExamenResponse::error($resultado['message']),
                404
            );

        } catch (\Exception $e) {
            return response()->json(
                ExamenResponse::error('Error interno del servidor.'),
                500
            );
        }
    }

    public function agregarPreguntas(AgregarPreguntasRequest $request, int $id): JsonResponse
    {
        try {
            $dto = AgregarPreguntasDTO::fromRequest($request->validated());
            $resultado = $this->examenService->agregarPreguntas($id, $dto);

            if ($resultado['success']) {
                $cantidadAgregadas = count($dto->preguntas);
                return response()->json([
                    'success' => true,
                    'message' => "Se agregaron {$cantidadAgregadas} pregunta(s) exitosamente.",
                    'data' => $resultado['data']
                ], 200);
            }

            return response()->json(
                ExamenResponse::error($resultado['message'], $resultado['errores'] ?? []),
                400
            );

        } catch (\Exception $e) {
            return response()->json(
                ExamenResponse::error('Error interno del servidor.'),
                500
            );
        }
    }

    public function actualizar(ActualizarExamenRequest $request, int $id): JsonResponse
    {
        try {
            $dto = ActualizarExamenDTO::fromRequest($request->validated());
            $resultado = $this->examenService->actualizarExamen($id, $dto);

            if ($resultado['success']) {
                return response()->json($resultado, 200);
            }

            return response()->json(
                ExamenResponse::error($resultado['message']),
                404
            );

        } catch (\Exception $e) {
            return response()->json(
                ExamenResponse::error('Error interno del servidor.'),
                500
            );
        }
    }

    public function eliminarPregunta(int $idExamen, int $idPregunta): JsonResponse
    {
        try {
            $resultado = $this->examenService->eliminarPregunta($idExamen, $idPregunta);

            if ($resultado['success']) {
                return response()->json($resultado, 200);
            }

            return response()->json(
                ExamenResponse::error($resultado['message']),
                404
            );

        } catch (\Exception $e) {
            return response()->json(
                ExamenResponse::error('Error interno del servidor.'),
                500
            );
        }
    }

    public function listarPorCurso(int $idCurso): JsonResponse
    {
        try {
            $resultado = $this->examenService->obtenerExamenesPorCurso($idCurso);

            if ($resultado['success']) {
                return response()->json($resultado, 200);
            }

            return response()->json(
                ExamenResponse::error($resultado['message']),
                404
            );

        } catch (\Exception $e) {
            return response()->json(
                ExamenResponse::error('Error interno del servidor.'),
                500
            );
        }
    }

    public function listarExamenesConCursos(): JsonResponse
    {
        try {
            $resultado = $this->examenService->listarExamenesConCursos();

            return response()->json([
                'success' => true,
                'data' => $resultado
            ], 200);

        } catch (\Exception $e) {
            return response()->json(
                ExamenResponse::error('Error interno del servidor.'),
                500
            );
        }
    }

    public function agregarRespuestas(AgregarRespuestasRequest $request, int $idPregunta): JsonResponse
    {
        try {
            $dto = AgregarRespuestasDTO::fromRequest($request->validated());
            $resultado = $this->examenService->agregarRespuestas($idPregunta, $dto);

            if ($resultado['success']) {
                return response()->json($resultado, 201);
            }

            return response()->json($resultado, 400);

        } catch (\Exception $e) {
            return response()->json(
                ExamenResponse::error('Error interno del servidor.'),
                500
            );
        }
    }

    public function eliminarRespuesta(int $idPregunta, int $idRespuesta): JsonResponse
    {
        try {
            $resultado = $this->examenService->eliminarRespuesta($idPregunta, $idRespuesta);

            if ($resultado['success']) {
                return response()->json($resultado, 200);
            }

            return response()->json($resultado, 400);

        } catch (\Exception $e) {
            return response()->json(
                ExamenResponse::error('Error interno del servidor.'),
                500
            );
        }
    }
}
