<?php

namespace App\Http\Responses;

use App\Models\Solicitantes;
use Illuminate\Database\Eloquent\Collection;
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
                    'id_solicitante' => $solicitante->id_solicitante,
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
                'id_solicitante' => [
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

    public static function listarSolicitantes(Collection $solicitantes): JsonResponse
    {
        $datosSolicitantes = $solicitantes->map(function (Solicitantes $solicitante) {
            return [
                'id_solicitante' => $solicitante->id_solicitante,
                'nombre' => $solicitante->nombre,
                'apellido' => $solicitante->apellido,
                'cargo' => $solicitante->cargo,
                'correo' => $solicitante->correo,
                'telefono' => $solicitante->telefono,
                'empresa' => [
                    'id_empresa' => $solicitante->empresa->id_empresa ?? null,
                    'nombre' => $solicitante->empresa->nombre ?? null
                ]
            ];
        })->toArray();

        return response()->json([
            'success' => true,
            'message' => 'Solicitantes obtenidos exitosamente',
            'data' => $datosSolicitantes
        ], 200);
    }

    public static function solicitanteObtenido(Solicitantes $solicitante): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Solicitante obtenido exitosamente',
            'data' => [
                'id_solicitante' => $solicitante->id_solicitante,
                'nombre' => $solicitante->nombre,
                'apellido' => $solicitante->apellido,
                'cargo' => $solicitante->cargo,
                'correo' => $solicitante->correo,
                'telefono' => $solicitante->telefono,
                'empresa' => [
                    'id_empresa' => $solicitante->empresa->id_empresa ?? null,
                    'nombre' => $solicitante->empresa->nombre ?? null
                ]
            ]
        ], 200);
    }
}