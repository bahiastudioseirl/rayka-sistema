<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Agregar middleware para forzar respuestas JSON en rutas API
        $middleware->group('api', [
            \App\Http\Middleware\ForceJsonResponse::class,
        ]);
        
        // Registrar middleware personalizado
        $middleware->alias([
            'jwt.auth' => \App\Http\Middleware\JWTAuthMiddleware::class,
            'admin' => \App\Http\Middleware\AdminRoleMiddleware::class,
            'auth.admin' => \App\Http\Middleware\AuthAdminMiddleware::class,
        ]);
        
        // BLOQUEAR COMPLETAMENTE todos los middleware automáticos de JWT
        $middleware->remove(\Tymon\JWTAuth\Http\Middleware\Authenticate::class);
        $middleware->remove(\Tymon\JWTAuth\Http\Middleware\RefreshToken::class);
        $middleware->remove(\Tymon\JWTAuth\Http\Middleware\Check::class);
        $middleware->remove('Tymon\JWTAuth\Http\Middleware\Authenticate');
        $middleware->remove('Tymon\JWTAuth\Http\Middleware\RefreshToken'); 
        $middleware->remove('Tymon\JWTAuth\Http\Middleware\Check');
        
        // Interceptar y reemplazar cualquier middleware de JWT que se registre automáticamente
        $middleware->replace('jwt.auth', \App\Http\Middleware\JWTAuthMiddleware::class);
        $middleware->replace('jwt.refresh', \App\Http\Middleware\JWTAuthMiddleware::class);
        $middleware->replace('jwt.check', \App\Http\Middleware\JWTAuthMiddleware::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Manejar excepciones de autenticación para rutas API
        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'error' => 'No autenticado',
                    'message' => 'Token de acceso requerido'
                ], 401);
            }
        });
    })->create();
