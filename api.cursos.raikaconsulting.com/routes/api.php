<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentAuthController;
use App\Http\Controllers\UsuarioEstudianteController;
use App\Http\Controllers\CursoController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\SolicitanteController;
use App\Http\Controllers\CapacitacionController;
use App\Http\Controllers\ExamenController;
use App\Http\Controllers\ReporteController;

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

// Rutas públicas para acceder a archivos de cursos
Route::get('cursos/imagenes/{filename}', [CursoController::class, 'servirImagenCurso'])->where('filename', '.*');

// Rutas para estudiantes autenticados
Route::middleware('auth.estudiante')->prefix('estudiantes')->group(function () {
    Route::get('cursos', [UsuarioEstudianteController::class, 'listarMisCursos']);
    Route::get('cursos/{id}', [UsuarioEstudianteController::class, 'mostrarCursoPorId']);
    Route::patch('cursos/{id}/marcar-video-finalizado', [UsuarioEstudianteController::class, 'marcarVideoFinalizado']);
    Route::post('cursos/{id}/rendir-examen', [UsuarioEstudianteController::class, 'rendirExamen']);
    Route::get('cursos/{id}/historial-intentos', [UsuarioEstudianteController::class, 'obtenerHistorialIntentos']);
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
    Route::get('cursos/{id}/examenes', [ExamenController::class, 'listarPorCurso']);
    
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
    Route::patch('capacitaciones/{id}', [CapacitacionController::class, 'actualizarCapacitacion']);
    Route::get('capacitaciones/{id}/estudiantes', [CapacitacionController::class, 'verEstudiantesConResultados']);
    Route::post('capacitaciones/{id}/estudiantes/agregar', [CapacitacionController::class, 'agregarEstudiantes']);
    Route::delete('capacitaciones/{id}/estudiantes/eliminar', [CapacitacionController::class, 'eliminarEstudiantes']);
    Route::post('capacitaciones/{id}/cursos/agregar', [CapacitacionController::class, 'agregarCursos']);
    Route::delete('capacitaciones/{id}/cursos/eliminar', [CapacitacionController::class, 'eliminarCursos']);
    Route::patch('capacitaciones/{id}/cambiar-estado', [CapacitacionController::class, 'cambiarEstado']);

    //Examenes endpoints para administradores
    Route::post('examenes', [ExamenController::class, 'crear']);
    Route::get('examenes/{id}', [ExamenController::class, 'obtenerPorId']);
    Route::patch('examenes/{id}', [ExamenController::class, 'actualizar']);
    Route::post('examenes/{id}/preguntas', [ExamenController::class, 'agregarPreguntas']);
    Route::delete('examenes/{idExamen}/preguntas/{idPregunta}', [ExamenController::class, 'eliminarPregunta']);
    Route::post('examenes/{idExamen}/preguntas/{idPregunta}/respuestas', [ExamenController::class, 'agregarRespuestas']);
    Route::delete('examenes/{idExamen}/preguntas/{idPregunta}/respuestas/{idRespuesta}', [ExamenController::class, 'eliminarRespuesta']);
    Route::get('examenes', [ExamenController::class, 'listarExamenesConCursos']);

    //Reportes endpoints para administradores
    Route::get('reportes/capacitaciones/{id}/excel', [ReporteController::class, 'generarReporteCapacitacion']);

});