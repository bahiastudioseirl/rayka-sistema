<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UsuarioController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Rutas de la API para el sistema Rayka
|
*/

// Rutas de autenticación
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    // LOGOUT SIN MIDDLEWARE - maneja autenticación internamente
    Route::post('logout', [AuthController::class, 'logout']);
    Route::middleware('jwt.auth')->post('refresh', [AuthController::class, 'refresh']);
});

// Rutas para administradores - SIN MIDDLEWARE, maneja autenticación internamente
Route::post('usuarios/administrador', [UsuarioController::class, 'crearAdministrador']);