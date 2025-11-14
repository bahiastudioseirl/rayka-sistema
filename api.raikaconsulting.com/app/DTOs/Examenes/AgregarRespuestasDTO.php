<?php

namespace App\DTOs\Examenes;

class AgregarRespuestasDTO
{
    public function __construct(
        public readonly array $respuestas
    ) {}

    public static function fromRequest(array $validatedData): self
    {
        return new self(
            respuestas: $validatedData['respuestas']
        );
    }
}
