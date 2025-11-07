<?php

namespace App\Http\Responses;

use App\Models\Solicitantes;
use Illuminate\Http\JsonResponse;

class SolicitanteResponse
{
    public static function solicitanteCreado(Solicitantes $solicitante): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Solicitante creado exitosamente',
            'data' => [
                'solicitante' => [
                    'id' => $solicitante->id_solicitante,
                    'nombre' => $solicitante->nombre,
                    'apellido' => $solicitante->apellido,
                    'correo' => $solicitante->correo,
                    'telefono' => $solicitante->telefono,
                    'empresa_id' => $solicitante->id_empresa
                ]
            ]
        ], 201);
    }   

    public static function solicitanteActualizado(Solicitantes $solicitante): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Solicitante actualizado exitosamente',
            'data' => [
                'solicitante' => [
                    'id' => $solicitante->id_solicitante,
                    'nombre' => $solicitante->nombre,
                    'apellido' => $solicitante->apellido,
                    'correo' => $solicitante->correo,
                    'telefono' => $solicitante->telefono,
                    'empresa_id' => $solicitante->id_empresa
                ]
            ]
        ], 200);
    }
}