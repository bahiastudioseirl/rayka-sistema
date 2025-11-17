<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Auth;

class JWTAuthMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // Verificar token Bearer
            $token = $request->bearerToken();
            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token de acceso requerido'
                ], 401);
            }

            // Setear el token manualmente en JWT
            JWTAuth::setToken($token);
            
            // Obtener el payload del token
            $payload = JWTAuth::getPayload();
            $userId = $payload->get('sub');
            
            // Buscar usuario por ID
            $user = \App\Models\Usuarios::find($userId);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ], 401);
            }

            if (!$user->activo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario desactivado'
                ], 401);
            }

            // Setear usuario en el guard
            Auth::guard('api')->setUser($user);
            
            // También setear en el request
            $request->setUserResolver(function () use ($user) {
                return $user;
            });
            
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
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de token: ' . $e->getMessage()
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
