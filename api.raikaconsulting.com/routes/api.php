<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentAuthController;
use App\Http\Controllers\CursoController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\SolicitanteController;
use App\Http\Controllers\CapacitacionController;

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

// Rutas de autenticación para estudiantes
Route::prefix('estudiantes')->group(function () {
    Route::post('login/{link_login_unico}', [StudentAuthController::class, 'login']);
    Route::post('logout', [StudentAuthController::class, 'logout']);
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

    //Solicitantes endpoints para administradores
    Route::post('solicitantes', [SolicitanteController::class, 'crearSolicitante']);
    Route::patch('solicitantes/{id}', [SolicitanteController::class, 'actualizarSolicitante']);
    Route::get('solicitantes/{id}', [SolicitanteController::class, 'obtenerSolicitantePorId']);
    Route::get('solicitantes', [SolicitanteController::class, 'listarSolicitantes']);
    Route::get('empresas/{empresaId}/solicitantes', [SolicitanteController::class, 'listarSolicitantesPorEmpresa']);

        //Capacitaciones endpoints para administradores
    Route::post('capacitaciones', [CapacitacionController::class, 'crear']);
    Route::get('capacitaciones', [CapacitacionController::class, 'verCapacitaciones']);
    Route::get('capacitaciones/{id}', [CapacitacionController::class, 'verCapacitacionPorId']);
    Route::post('capacitaciones/{id}/estudiantes/agregar', [CapacitacionController::class, 'agregarEstudiantes']);
    Route::delete('capacitaciones/{id}/estudiantes/eliminar', [CapacitacionController::class, 'eliminarEstudiantes']);
    Route::post('capacitaciones/{id}/cursos/agregar', [CapacitacionController::class, 'agregarCursos']);
    Route::delete('capacitaciones/{id}/cursos/eliminar', [CapacitacionController::class, 'eliminarCursos']);
    Route::patch('capacitaciones/{id}/cambiar-estado', [CapacitacionController::class, 'cambiarEstado']);

});