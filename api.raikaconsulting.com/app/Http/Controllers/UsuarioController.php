<?php

namespace App\Http\Controllers;

use App\Http\Request\Usuarios\CrearAdministradorRequest;
use App\DTOs\Usuarios\CrearAdministradorDTO;
use App\Services\Usuarios\UsuarioService;
use App\Http\Responses\Usuarios\UsuarioResponse;
use App\Utils\RolesEnum;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Usuarios;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class UsuarioController extends Controller
{
    public function __construct(
        private readonly UsuarioService $usuarioService
    ) {}


    public function crearAdministrador(CrearAdministradorRequest $request): JsonResponse
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

            // VERIFICACIÓN DE ROL ADMINISTRADOR MANUAL
            if ($usuario->rol->nombre !== RolesEnum::ADMINISTRADOR->getName()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Acceso denegado: Se requieren permisos de administrador'
                ], 403);
            }

            $dto = CrearAdministradorDTO::fromRequest($request->validated());
            $nuevoUsuario = $this->usuarioService->crearAdministrador($dto);
            
            return response()->json([
                'message' => 'Usuario administrador creado exitosamente',
                'data' => $nuevoUsuario
            ], 201);
            
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
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
            Log::error('Error al crear usuario administrador: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
