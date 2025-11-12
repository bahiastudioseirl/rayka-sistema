<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Usuarios;
use App\Utils\RolesEnum;

class AuthStudentMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $token = $request->bearerToken();
            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token de acceso requerido'
                ], 401);
            }

            JWTAuth::setToken($token);
            
            $payload = JWTAuth::getPayload();
            $userId = $payload->get('sub');
            
            $usuario = Usuarios::with('rol')->find($userId);
            
            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ], 401);
            }

            if (!$usuario->activo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario desactivado'
                ], 401);
            }

            if ($usuario->rol->nombre !== RolesEnum::ESTUDIANTE->getName()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Acceso denegado: Se requieren permisos de estudiante'
                ], 403);
            }

            // Extraer el ID de capacitación del token
            $idCapacitacion = $payload->get('id_capacitacion');
            
            // Agregar usuario y capacitación al request para uso posterior
            $request->merge([
                'authenticated_user' => $usuario,
                'id_capacitacion' => $idCapacitacion
            ]);
            
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token expirado'
            ], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token inválido'
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de autenticación: ' . $e->getMessage()
            ], 500);
        }

        return $next($request);
    }
}
