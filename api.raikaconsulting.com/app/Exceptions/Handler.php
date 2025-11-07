<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $e): JsonResponse|\Symfony\Component\HttpFoundation\Response
    {
        // Si la petición espera JSON (API)
        if ($request->expectsJson() || $request->is('api/*')) {
            return $this->handleApiException($request, $e);
        }

        return parent::render($request, $e);
    }

    /**
     * Manejar excepciones específicas para API
     */
    protected function handleApiException($request, Throwable $e): JsonResponse
    {
        // Manejo de errores JWT
        if ($e instanceof TokenExpiredException) {
            return response()->json([
                'success' => false,
                'message' => 'El token ha expirado. Por favor, inicia sesión nuevamente.',
                'code' => 'TOKEN_EXPIRED'
            ], 401);
        }

        if ($e instanceof TokenInvalidException) {
            return response()->json([
                'success' => false,
                'message' => 'El token es inválido. Por favor, inicia sesión nuevamente.',
                'code' => 'TOKEN_INVALID'
            ], 401);
        }

        if ($e instanceof JWTException) {
            return response()->json([
                'success' => false,
                'message' => 'No se pudo procesar el token. Por favor, inicia sesión nuevamente.',
                'code' => 'TOKEN_ERROR'
            ], 401);
        }

        // Manejo de error 401 - No autenticado
        if ($e instanceof UnauthorizedHttpException) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes autorización para acceder a este recurso. Por favor, inicia sesión.',
                'code' => 'UNAUTHORIZED'
            ], 401);
        }

        // Manejo de error 403 - Sin permisos suficientes
        if ($e instanceof AccessDeniedHttpException) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos suficientes para realizar esta acción.',
                'code' => 'FORBIDDEN'
            ], 403);
        }

        // Manejo de errores de validación
        if ($e instanceof \Illuminate\Validation\ValidationException) {
            return response()->json([
                'success' => false,
                'message' => 'Los datos proporcionados no son válidos.',
                'errors' => $e->errors(),
                'code' => 'VALIDATION_ERROR'
            ], 422);
        }

        // Manejo de modelo no encontrado
        if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => 'El recurso solicitado no fue encontrado.',
                'code' => 'NOT_FOUND'
            ], 404);
        }

        // Manejo de errores de base de datos
        if ($e instanceof \Illuminate\Database\QueryException) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la base de datos. Por favor, inténtalo más tarde.',
                'code' => 'DATABASE_ERROR'
            ], 500);
        }

        // Para errores generales en producción
        if (app()->environment('production')) {
            return response()->json([
                'success' => false,
                'message' => 'Ha ocurrido un error interno del servidor.',
                'code' => 'INTERNAL_ERROR'
            ], 500);
        }

        // En desarrollo, mostrar detalles del error
        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
            'code' => 'DEVELOPMENT_ERROR',
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTrace()
        ], 500);
    }
}