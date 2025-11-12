<?php

namespace App\DTOs\Examenes;

class AgregarPreguntasDTO
{
    public function __construct(
        public readonly array $preguntas
    ) {}
    
    public static function fromRequest(array $validatedData): self
    {
        return new self(
            preguntas: $validatedData['preguntas']
        );
    }

    public function toArray(): array
    {
        return [
            'preguntas' => $this->preguntas
        ];
    }
}
