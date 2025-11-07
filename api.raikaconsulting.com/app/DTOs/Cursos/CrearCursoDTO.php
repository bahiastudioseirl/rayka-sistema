<?php

namespace App\DTOs\Cursos;

class CrearCursoDTO
{
    public function __construct(
        public readonly string $titulo,
        public readonly string $contenido,
        public readonly string $tipo_contenido,
        public readonly bool $activo = true,
        public readonly int $creado_por
    ) {}
    
    public static function fromRequest(array $validatedData, int $creado_por): self
    {
        return new self(
            titulo: trim($validatedData['titulo']),
            contenido: trim($validatedData['contenido']),
            tipo_contenido: $validatedData['tipo_contenido'],
            activo: $validatedData['activo'] ?? true,
            creado_por: $creado_por
        );
    }

    public static function fromArray(array $data, int $creado_por): self
    {
        return new self(
            titulo: trim($data['titulo']),
            contenido: trim($data['contenido']),
            tipo_contenido: $data['tipo_contenido'],
            activo: $data['activo'] ?? true,
            creado_por: $creado_por
        );
    }

    public function toArray(): array
    {
        return [
            'titulo' => $this->titulo,
            'contenido' => $this->contenido,
            'tipo_contenido' => $this->tipo_contenido,
            'activo' => $this->activo,
            'creado_por' => $this->creado_por,
            'fecha_creacion' => now(),
        ];
    }

}