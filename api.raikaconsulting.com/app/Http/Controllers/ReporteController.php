<?php

namespace App\Http\Controllers;

use App\Services\ReporteService;
use Illuminate\Http\JsonResponse;
use Exception;

class ReporteController extends Controller
{
    public function __construct(
        private readonly ReporteService $reporteService
    ) {}

    /**
     * Generar reporte Excel de una capacitación
     */
    public function generarReporteCapacitacion(int $id): JsonResponse
    {
        try {
            $resultado = $this->reporteService->generarReporteCapacitacion($id);
            
            if ($resultado['success']) {
                return response()->json([
                    'success' => true,
                    'message' => $resultado['message'],
                    'data' => $resultado['data']
                ], 200);
            }
            
            return response()->json([
                'success' => false,
                'message' => $resultado['message'],
                'error' => $resultado['error'] ?? null
            ], 400);
            
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}