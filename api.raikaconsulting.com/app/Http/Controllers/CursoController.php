<?php

namespace App\Http\Controllers;

use App\Http\Request\Cursos\CrearCursoRequest;
use App\Http\Request\Cursos\ActualizarCursoRequest;
use App\Http\Responses\CursoResponse;
use App\Services\CursoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;

class CursoController extends Controller
{
    public function __construct
    (
       private readonly CursoService $cursoService
    ){}

    public function crearCurso(CrearCursoRequest $request): JsonResponse
    {
        try {
            $usuarioAutenticado = $request->input('authenticated_user');
            
            $curso = $this->cursoService->crearCurso(
                $request->validated(),
                $usuarioAutenticado
            );

            return CursoResponse::cursoCreado($curso);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error al crear el curso',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function actualizarCurso(int $id, ActualizarCursoRequest $request): JsonResponse
    {
        try {
            $actualizado = $this->cursoService->actualizarCurso($id, $request->validated());
            
            if (!$actualizado) {
                return response()->json([
                    'message' => 'No se pudo actualizar el curso'
                ], 400);
            }

            $curso = $this->cursoService->obtenerCursoPorId($id);
            return CursoResponse::cursoActualizado($curso);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error al actualizar el curso',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function listarCursos(): JsonResponse
    {
        try {
            $cursos = $this->cursoService->listarCursos();
            return CursoResponse::listarCursos($cursos);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function obtenerCursoPorId(int $id): JsonResponse
    {
        try {
            $curso = $this->cursoService->obtenerCursoPorId($id);
            if (!$curso) {
                return response()->json([
                    'message' => 'Curso no encontrado'
                ], 404);
            }

            return response()->json([
                'message' => 'Curso obtenido exitosamente',
                'data' => $curso
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function cambiarEstadoCurso(int $id): JsonResponse
    {
        try {
            $curso = $this->cursoService->cambiarEstadoCurso($id);
            return response()->json([
                'message' => 'Estado del curso cambiado exitosamente',
                'data' => $curso
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error al cambiar el estado del curso',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function servirArchivoCurso(string $filename)
    {
        try {
            $rutaArchivo = 'cursos/videos/' . $filename;
            
            if (!Storage::disk('private')->exists($rutaArchivo)) {
                return response()->json([
                    'message' => 'Archivo no encontrado'
                ], 404);
            }

            $archivo = Storage::disk('private')->get($rutaArchivo);
            $extension = pathinfo($filename, PATHINFO_EXTENSION);
            
            $tiposMime = [
                'mp4' => 'video/mp4',
                'avi' => 'video/x-msvideo', 
                'mov' => 'video/quicktime',
                'wmv' => 'video/x-ms-wmv',
                'flv' => 'video/x-flv',
                'webm' => 'video/webm',
                'mkv' => 'video/x-matroska'
            ];
            
            $tipoMime = $tiposMime[strtolower($extension)] ?? 'video/mp4';
            
            return response($archivo, 200)
                ->header('Content-Type', $tipoMime)
                ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
                
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al acceder al archivo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}