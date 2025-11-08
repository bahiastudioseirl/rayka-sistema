<?php

namespace App\Http\Controllers;

use App\Http\Request\Solicitante\ActualizarSolicitanteRequest;
use App\Http\Request\Solicitante\CrearSolicitanteRequest;
use App\Http\Responses\SolicitanteResponse;
use App\Services\SolicitanteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class SolicitanteController extends Controller
{
    public function __construct(
        private readonly SolicitanteService $solicitanteService
    ) {}

    public function crearSolicitante(CrearSolicitanteRequest $request): JsonResponse
    {
        try {
            $solicitante = $this->solicitanteService->crearSolicitante(
                $request->validated()
            );

            return SolicitanteResponse::solicitanteCreado($solicitante);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function actualizarSolicitante(ActualizarSolicitanteRequest $request, int $id): JsonResponse
    {
        try {
            $actualizado = $this->solicitanteService->actualizarSolicitante(
                $id,
                $request->validated()
            );

            if (!$actualizado) {
                return response()->json([
                    'message' => 'No se pudo actualizar el solicitante'
                ], 400);
            }

            $solicitante = $this->solicitanteService->obtenerSolicitantePorId($id);
            return SolicitanteResponse::solicitanteActualizado($solicitante);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function obtenerSolicitantePorId(int $id): JsonResponse
    {
        try {
            $solicitante = $this->solicitanteService->obtenerSolicitantePorId($id);

            return SolicitanteResponse::solicitanteObtenido($solicitante);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function listarSolicitantes(): JsonResponse
    {
        try {
            $solicitantes = $this->solicitanteService->listarTodosLosSolicitantes();

            return SolicitanteResponse::listarSolicitantes($solicitantes);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function listarSolicitantesPorEmpresa(int $empresaId): JsonResponse
    {
        try {
            $solicitantes = $this->solicitanteService->listarSolicitantesPorEmpresa($empresaId);

            return SolicitanteResponse::listarSolicitantes($solicitantes);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    
}