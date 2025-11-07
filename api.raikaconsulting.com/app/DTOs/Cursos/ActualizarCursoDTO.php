<?php

namespace App\DTOs\Cursos;

class ActualizarCursoDTO
{
    public function __construct(
        public readonly ?string $titulo = null,
        public readonly ?string $contenido = null,
        public readonly ?string $tipo_contenido = null,
        public readonly ?bool $activo = null
    ) {}
    
    public static function fromArray(array $data): self
    {
        return new self(
            titulo: isset($data['titulo']) ? trim($data['titulo']) : null,
            contenido: isset($data['contenido']) ? trim($data['contenido']) : null,
            tipo_contenido: $data['tipo_contenido'] ?? null,
            activo: isset($data['activo']) ? (bool) $data['activo'] : null,
        );
    }

    public static function fromRequest(array $data): self
    {
        return self::fromArray($data);
    }

    public function toArray(): array
    {
        $result = [];
        if ($this->titulo !== null) {
            $result['titulo'] = $this->titulo;
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