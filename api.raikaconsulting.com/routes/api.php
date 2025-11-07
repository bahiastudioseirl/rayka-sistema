<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CursoController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\EmpresaController;

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
    //Usuarios endpoints para administradores
    Route::post('usuarios/administrador', [UsuarioController::class, 'crearAdministrador']);
    Route::post('usuarios/estudiante', [UsuarioController::class, 'crearEstudiante']);
    Route::get('usuarios/ver-estudiantes', [UsuarioController::class, 'listarEstudiantes']);
    Route::get('usuarios/ver-administradores', [UsuarioController::class, 'listarAdministradores']);
    Route::get('usuarios/{numDocumento}', [UsuarioController::class, 'listarUsuarioPorNumDocumento']);
    Route::patch('usuarios/{id}/cambiar-estado', [UsuarioController::class, 'cambiarEstado']);
    Route::patch('usuarios/{id}', [UsuarioController::class, 'actualizarUsuario']);
    Route::patch('usuarios/{id}/actualizar-contrasenia', [UsuarioController::class, 'actualizarContrasenia']);

    //Cursos endpoints para administradores
    Route::post('cursos', [CursoController::class, 'crearCurso']);
    Route::post('cursos/{id}', [CursoController::class, 'actualizarCurso']);
    Route::get('cursos', [CursoController::class, 'listarCursos']);
    Route::get('cursos/{id}', [CursoController::class, 'obtenerCursoPorId']);
    Route::patch('cursos/{id}/cambiar-estado', [CursoController::class, 'cambiarEstadoCurso']);
    
    // Ruta para servir archivos de cursos (privados pero autenticados)
    Route::get('cursos/archivos/{filename}', [CursoController::class, 'servirArchivoCurso'])->where('filename', '.*');

    //Empresas endpoints para administradores
    Route::post('empresas', [EmpresaController::class, 'crearEmpresa']);
    Route::patch('empresas/{id}', [EmpresaController::class, 'actualizarEmpresa']);
    Route::get('empresas', [EmpresaController::class, 'listarEmpresas']);
    Route::get('empresas/{id}', [EmpresaController::class, 'obtenerEmpresaPorId']);

});