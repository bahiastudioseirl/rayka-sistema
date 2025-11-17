<?php

namespace App\Http\Responses;

use App\Models\Empresas;
use Illuminate\Http\JsonResponse;

class EmpresaResponse
{
    public static function empresaCreada(Empresas $empresa): JsonResponse
    {
        $datoEmpresa = [
            'id_empresa' => $empresa->id_empresa,
            'nombre' => $empresa->nombre,
            'creado_por' => $empresa->creado_por,
            'fecha_creacion' => $empresa->fecha_creacion?->format('Y-m-d H:i:s'),
        ];

        return response()->json([
            'success' => true,
            'message' => 'Empresa creada exitosamente',
            'data' => [
                'empresa' => $datoEmpresa
            ]
        ], 201);
    }

    public static function empresaActualizada(Empresas $empresa): JsonResponse
    {
        $datoEmpresa = [
            'id_empresa' => $empresa->id_empresa,
            'nombre' => $empresa->nombre,
            'creado_por' => $empresa->creado_por,
            'fecha_creacion' => $empresa->fecha_creacion?->format('Y-m-d H:i:s'),
        ];

        return response()->json([
            'success' => true,
            'message' => 'Empresa actualizada exitosamente',
            'data' => [
                'empresa' => $datoEmpresa
            ]
        ], 200);
    }
}