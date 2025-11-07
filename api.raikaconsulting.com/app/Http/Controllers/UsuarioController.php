<?php

namespace App\Http\Controllers;

use App\DTOs\Usuarios\ActualizarUsuarioDTO;
use App\Http\Request\Usuarios\CrearAdministradorRequest;
use App\Http\Request\Usuarios\CrearEstudianteRequest;
use App\DTOs\Usuarios\CrearAdministradorDTO;
use App\DTOs\Usuarios\CrearEstudianteDTO;
use App\Http\Request\Usuarios\ActualizarContrasenia;
use App\Http\Request\Usuarios\ActualizarContraseniaRequest;
use App\Http\Request\Usuarios\ActualizarUsuarioRequest;
use App\Services\UsuarioService;
use Illuminate\Http\JsonResponse;
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
            $dto = CrearAdministradorDTO::fromRequest($request->validated());
            $usuario = $this->usuarioService->crearAdministrador($dto);
            
            return response()->json([
                'message' => 'Usuario administrador creado exitosamente',
                'data' => $usuario
            ], 201);
            
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error al crear usuario administrador: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function crearEstudiante(CrearEstudianteRequest $request): JsonResponse
    {
        try {
            $dto = CrearEstudianteDTO::fromRequest($request->validated());
            $usuario = $this->usuarioService->crearEstudiante($dto);
            
            return response()->json([
                'message' => 'Usuario estudiante creado exitosamente',
                'data' => $usuario
            ], 201);
            
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error al crear usuario estudiante: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function listarEstudiantes(): JsonResponse
    {
        try {
            $estudiantes = $this->usuarioService->listarEstudiantes();
            
            return response()->json([
                'message' => 'Estudiantes obtenidos exitosamente',
                'data' => $estudiantes
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Error al listar estudiantes: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function listarAdministradores(): JsonResponse
    {
        try {
            $administradores = $this->usuarioService->listarAdministradores();
            
            return response()->json([
                'message' => 'Administradores obtenidos exitosamente',
                'data' => $administradores
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Error al listar administradores: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function listarUsuarioPorNumDocumento(string $numDocumento): JsonResponse
    {
        try {
            $usuario = $this->usuarioService->verUsuarioPorNumDocumento($numDocumento);

            return response()->json([
                'message' => 'Usuario obtenido exitosamente',
                'data' => $usuario
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Error al obtener usuario por número de documento: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function cambiarEstado(int $id): JsonResponse
    {
        try {
            $usuario = $this->usuarioService->cambiarEstadoUsuario($id);
            
            $mensaje = $usuario->activo ? 'Usuario activado exitosamente' : 'Usuario desactivado exitosamente';
            
            return response()->json([
                'message' => $mensaje,
                'data' => $usuario
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Error al cambiar estado del usuario: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function actualizarUsuario(int $id, ActualizarUsuarioRequest $request): JsonResponse
    {
        try {
            $dto = ActualizarUsuarioDTO::fromRequest($request->validated());
            $usuario = $this->usuarioService->actualizarUsuario($id, $dto->toArray());
            
            return response()->json([
                'message' => 'Usuario actualizado exitosamente',
                'data' => $usuario
            ], 200);
            
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error al actualizar usuario: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function actualizarContrasenia(int $id, ActualizarContraseniaRequest $request): JsonResponse
    {
        try {
            $nuevaContrasenia = $request->input('contrasenia');
            $usuario = $this->usuarioService->actualizarContrasenia($id, $nuevaContrasenia);
            
            return response()->json([
                'message' => 'Contraseña actualizada exitosamente',
                'data' => $usuario
            ], 200);
            
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error al actualizar contraseña del usuario: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
