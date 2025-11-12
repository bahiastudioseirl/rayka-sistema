<?php

namespace App\DTOs\Examenes;

class CrearExamenDTO
{
    public function __construct(
        public readonly string $titulo,
        public readonly int $id_curso,
        public readonly array $preguntas
    ) {}
    
    public static function fromRequest(array $validatedData): self
    {
        return new self(
            titulo: trim($validatedData['titulo']),
            id_curso: $validatedData['id_curso'],
            preguntas: $validatedData['preguntas']
        );
    }

    public function toArray(): array
    {
        return [
            'titulo' => $this->titulo,
            'id_curso' => $this->id_curso,
            'preguntas' => $this->preguntas
        ];
    }
}
