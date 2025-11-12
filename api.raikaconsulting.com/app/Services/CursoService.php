<?php

namespace App\Services;

use App\DTOs\Cursos\CrearCursoDTO;
use App\Models\Cursos;
use App\Repositories\CursoRepository;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\UploadedFile;

class CursoService
{
    public function __construct(
        private readonly CursoRepository $cursoRepository
    ) {}


    public function crearCurso(array $datosValidados, $usuarioAutenticado): Cursos
    {
        if (!$usuarioAutenticado) {
            throw ValidationException::withMessages([
                'auth' => ['Usuario no autenticado.']
            ]);
        }

        $creado_por = $usuarioAutenticado->id_usuario;

        if($this->cursoRepository->obtenerPorNombre($datosValidados['titulo'])){
            throw ValidationException::withMessages([
                'titulo' => ['El título del curso ya está registrado.']
            ]);
        }

        $urlImagen = null;
        if (isset($datosValidados['imagen']) && $datosValidados['imagen']) {
            $imagen = $datosValidados['imagen'];
            $nombreImagen = time() . '_' . $imagen->getClientOriginalName();
            $rutaImagen = $imagen->storeAs('cursos/imagenes', $nombreImagen, 'public');
            $urlImagen = '/storage/' . $rutaImagen;
        }

        $contenido = '';
        $tipoContenido = '';

        if (isset($datosValidados['contenido']) && !empty(trim($datosValidados['contenido']))) {
            $contenido = trim($datosValidados['contenido']);
            $tipoContenido = 'link';
            $this->validarUrlVideo($contenido);
        }
        else if (isset($datosValidados['archivo']) && $datosValidados['archivo']) {
            $archivo = $datosValidados['archivo'];
            $this->validarArchivoVideo($archivo);
            $rutaArchivo = $archivo->store('cursos/videos', 'private');
            
            $nombreArchivo = basename($rutaArchivo);
            $contenido = url("api/cursos/archivos/{$nombreArchivo}");
            $tipoContenido = 'carga_archivo';
        }
        else {
            throw ValidationException::withMessages([
                'contenido' => ['Debe proporcionar un link de video o subir un archivo.']
            ]);
        }

        $dto = new CrearCursoDTO(
            titulo: trim($datosValidados['titulo']),
            descripcion: isset($datosValidados['descripcion']) ? trim($datosValidados['descripcion']) : null,
            url_imagen: $urlImagen,
            contenido: $contenido,
            tipo_contenido: $tipoContenido,
            activo: $datosValidados['activo'] ?? true,
            creado_por: $creado_por
        );

        return $this->cursoRepository->crear($dto->toArray());
    }

    public function actualizarCurso(int $id, array $datosValidados): bool
    {
        $curso = $this->cursoRepository->obtenerPorId($id);
        if (!$curso) {
            throw ValidationException::withMessages([
                'id_curso' => ['El curso especificado no existe.']
            ]);
        }

        $datosActualizacion = [];

        if (isset($datosValidados['titulo'])) {
            $cursoExistente = $this->cursoRepository->obtenerPorNombre($datosValidados['titulo']);
            if ($cursoExistente && $cursoExistente->id_curso !== $id) {
                throw ValidationException::withMessages([
                    'titulo' => ['El título del curso ya está registrado.']
                ]);
            }
            $datosActualizacion['titulo'] = trim($datosValidados['titulo']);
        }

        if (isset($datosValidados['descripcion'])) {
            $datosActualizacion['descripcion'] = trim($datosValidados['descripcion']);
        }

        if (isset($datosValidados['imagen']) && $datosValidados['imagen']) {
            if ($curso->url_imagen) {
                $rutaAntigua = str_replace('/storage/', '', $curso->url_imagen);
                if (Storage::disk('public')->exists($rutaAntigua)) {
                    Storage::disk('public')->delete($rutaAntigua);
                }
            }

            $imagen = $datosValidados['imagen'];
            $nombreImagen = time() . '_' . $imagen->getClientOriginalName();
            $rutaImagen = $imagen->storeAs('cursos/imagenes', $nombreImagen, 'public');
            $datosActualizacion['url_imagen'] = '/storage/' . $rutaImagen;
        }

        if (isset($datosValidados['archivo']) && $datosValidados['archivo']) {
            $archivo = $datosValidados['archivo'];
            $this->validarArchivoVideo($archivo);

            if ($curso->tipo_contenido === 'carga_archivo' && Storage::disk('private')->exists($curso->contenido)) {
                Storage::disk('private')->delete($curso->contenido);
            }

            $rutaArchivo = $archivo->store('cursos/videos', 'private');
            
            $nombreArchivo = basename($rutaArchivo);
            $datosActualizacion['contenido'] = url("api/cursos/archivos/{$nombreArchivo}");
            $datosActualizacion['tipo_contenido'] = 'carga_archivo';

        } else if (isset($datosValidados['contenido']) && $datosValidados['contenido']) {
            $this->validarUrlVideo($datosValidados['contenido']);

            if ($curso->tipo_contenido === 'carga_archivo' && Storage::disk('private')->exists($curso->contenido)) {
                Storage::disk('private')->delete($curso->contenido);
            }

            $datosActualizacion['contenido'] = $datosValidados['contenido'];
            $datosActualizacion['tipo_contenido'] = 'link';
        }

        if (isset($datosValidados['activo'])) {
            $datosActualizacion['activo'] = $datosValidados['activo'];
        }

        if (!empty($datosActualizacion)) {
            return $this->cursoRepository->actualizar($id, $datosActualizacion);
        }

        return true;
    }

    public function cambiarEstadoCurso(int $id): Cursos
    {
        $curso = $this->cursoRepository->obtenerPorId($id);
        if (!$curso) {
            throw ValidationException::withMessages([
                'id_curso' => ['El curso especificado no existe.']
            ]);
        }

        $nuevoEstado = !$curso->activo;
        $actualizado = $this->cursoRepository->actualizar($id, ['activo' => $nuevoEstado]);
        if (!$actualizado) {
            throw ValidationException::withMessages([
                'id_curso' => ['No se pudo cambiar el estado del curso.']
            ]);
        }

        return $this->cursoRepository->obtenerPorId($id);
    }

    public function listarCursos()
    {
        return $this->cursoRepository->listarTodos();
    }

    public function obtenerCursoPorId(int $id): ?Cursos
    {
        return $this->cursoRepository->obtenerPorId($id);
    }
    



    /**
     * Validar que sea una URL válida de video (YouTube, Vimeo, etc.)
     */
    private function validarUrlVideo(string $url): void
    {
        $validator = Validator::make(['url' => $url], [
            'url' => ['required', 'url', 'max:500']
        ]);

        if ($validator->fails()) {
            throw ValidationException::withMessages([
                'contenido' => ['Debe ser una URL válida.']
            ]);
        }

        $patronesVideo = [
            '/^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\/)/i'
        ];

        $esVideoValido = false;
        foreach ($patronesVideo as $patron) {
            if (preg_match($patron, $url)) {
                $esVideoValido = true;
                break;
            }
        }

        if (!$esVideoValido) {
            throw ValidationException::withMessages([
                'contenido' => ['La URL debe ser de YouTube o Vimeo.']
            ]);
        }
    }

    private function validarArchivoVideo(UploadedFile $archivo): void
    {
        $validator = Validator::make(['archivo' => $archivo], [
            'archivo' => [
                'required',
                'file',
                'mimes:mp4,avi,mov,wmv,flv,webm,mkv',
                'max:500000' // 500MB máximo
            ]
        ]);

        if ($validator->fails()) {
            throw ValidationException::withMessages([
                'archivo' => $validator->errors()->first('archivo')
            ]);
        }
    }
}

