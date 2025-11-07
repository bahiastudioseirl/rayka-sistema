<?php

namespace App\Http\Responses\Usuarios;

use App\Models\Usuarios;
use Illuminate\Http\JsonResponse;

class UsuarioResponse
{

    public static function usuarioCreado(Usuarios $usuario): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Usuario creado exitosamente',
            'data' => [
                'usuario' => [
                    'id' => $usuario->id_usuario,
                    'nombre' => $usuario->nombre,
                    'apellido' => $usuario->apellido,
                    'num_documento' => $usuario->num_documento,
                    'correo' => $usuario->correo,
                    'activo' => $usuario->activo,
                    'rol' => [
                        'id' => $usuario->rol->id_rol ?? null,
                        'nombre' => $usuario->rol->nombre ?? null
                    ],
                    'fecha_creacion' => $usuario->fecha_creacion?->format('Y-m-d H:i:s'),
                    'fecha_actualizacion' => $usuario->fecha_actualizacion?->format('Y-m-d H:i:s')
                ]
            ]
        ], 201);
    }

    public static function usuarioActualizado(Usuarios $usuario): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Usuario actualizado exitosamente',
            'data' => [
                'usuario' => [
                    'id' => $usuario->id_usuario,
                    'nombre' => $usuario->nombre,
                    'apellido' => $usuario->apellido,
                    'num_documento' => $usuario->num_documento,
                    'correo' => $usuario->correo,
                    'activo' => $usuario->activo,
                    'rol' => [
                        'id' => $usuario->rol->id_rol ?? null,
                        'nombre' => $usuario->rol->nombre ?? null
                    ],
                    'fecha_creacion' => $usuario->fecha_creacion?->format('Y-m-d H:i:s'),
                    'fecha_actualizacion' => $usuario->fecha_actualizacion?->format('Y-m-d H:i:s')
                ]
            ]
        ], 200);
    }

}