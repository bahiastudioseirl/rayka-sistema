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
    Route::post('logout', [AuthController::class, 'logout']);
    Route::middleware('jwt.auth')->post('refresh', [AuthController::class, 'refresh']);
});

// Rutas para administradores autenticados
Route::middleware('auth.admin')->group(function () {
    Route::post('usuarios/administrador', [UsuarioController::class, 'crearAdministrador']);
    Route::post('usuarios/estudiante', [UsuarioController::class, 'crearEstudiante']);
    Route::get('usuarios/ver-estudiantes', [UsuarioController::class, 'listarEstudiantes']);
    Route::get('usuarios/ver-administradores', [UsuarioController::class, 'listarAdministradores']);
    Route::patch('usuarios/{id}/cambiar-estado', [UsuarioController::class, 'cambiarEstado']);
    Route::patch('usuarios/{id}', [UsuarioController::class, 'actualizarUsuario']);
    Route::patch('usuarios/{id}/actualizar-contrasenia', [UsuarioController::class, 'actualizarContrasenia']);
});