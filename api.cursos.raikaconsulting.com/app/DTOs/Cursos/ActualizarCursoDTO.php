<?php

namespace App\DTOs\Cursos;

class ActualizarCursoDTO
{
    public function __construct(
        public readonly ?string $titulo = null,
        public readonly ?string $descripcion = null,
        public readonly ?string $url_imagen = null,
        public readonly ?string $contenido = null,
        public readonly ?string $tipo_contenido = null,
        public readonly ?bool $activo = null
    ) {}
    
    public static function fromArray(array $data, ?string $url_imagen = null): self
    {
        return new self(
            titulo: isset($data['titulo']) ? trim($data['titulo']) : null,
            descripcion: isset($data['descripcion']) ? trim($data['descripcion']) : null,
            url_imagen: $url_imagen,
            contenido: isset($data['contenido']) ? trim($data['contenido']) : null,
            tipo_contenido: $data['tipo_contenido'] ?? null,
            activo: isset($data['activo']) ? (bool) $data['activo'] : null,
        );
    }

    public static function fromRequest(array $data, ?string $url_imagen = null): self
    {
        return self::fromArray($data, $url_imagen);
    }

    public function toArray(): array
    {
        $result = [];
        if ($this->titulo !== null) {
            $result['titulo'] = $this->titulo;
        }
        if ($this->descripcion !== null) {
            $result['descripcion'] = $this->descripcion;
        }
        if ($this->url_imagen !== null) {
            $result['url_imagen'] = $this->url_imagen;
        }
        if ($this->contenido !== null) {
            $result['contenido'] = $this->contenido;
        }
        if ($this->tipo_contenido !== null) {
            $result['tipo_contenido'] = $this->tipo_contenido;
        }
        if ($this->activo !== null) {
            $result['activo'] = $this->activo;
        }
        return $result;
    }

}