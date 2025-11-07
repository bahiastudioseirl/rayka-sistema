<?php

namespace App\Http\Controllers;

use App\Http\Request\Empresas\CrearEmpresaRequest;
use App\Http\Responses\EmpresaResponse;
use App\Services\EmpresaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class EmpresaController extends Controller
{
    public function __construct(
        private readonly EmpresaService $empresaService
    )
    {}
    public function crearEmpresa(CrearEmpresaRequest $request): JsonResponse
    {
        try{
            $usuarioAutenticado = $request->input('authenticated_user');

            $empresa = $this->empresaService->crearEmpresa(
                $request->validated(),
                $usuarioAutenticado
            );

            return EmpresaResponse::empresaCreada($empresa);

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

    public function actualizarEmpresa(int $id, CrearEmpresaRequest $request): JsonResponse
    {
        try{
            $empresa = $this->empresaService->actualizarEmpresa(
                $id,
                $request->validated()
            );

            return EmpresaResponse::empresaActualizada($empresa);

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

    public function listarEmpresas(): JsonResponse
    {
        try {
            $empresas = $this->empresaService->listarEmpresas();
            return response()->json([
                'message' => 'Empresas obtenidas exitosamente',
                'data' => $empresas
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function obtenerEmpresaPorId(int $id): JsonResponse
    {
        try {
            $empresa = $this->empresaService->obtenerEmpresaPorId($id);
            if (!$empresa) {
                return response()->json([
                    'message' => 'Empresa no encontrada'
                ], 404);
            }

            return response()->json([
                'message' => 'Empresa obtenida exitosamente',
                'data' => $empresa
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    


}