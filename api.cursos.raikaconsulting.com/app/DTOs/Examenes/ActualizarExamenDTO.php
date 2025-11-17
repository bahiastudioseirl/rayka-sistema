<?php

namespace App\DTOs\Examenes;

class ActualizarExamenDTO
{
    public function __construct(
        public readonly ?string $titulo = null,
        public readonly ?int $id_curso = null
    ) {}
    
    public static function fromRequest(array $validatedData): self
    {
        return new self(
            titulo: isset($validatedData['titulo']) ? trim($validatedData['titulo']) : null,
            id_curso: $validatedData['id_curso'] ?? null
        );
    }

    public function toArray(): array
    {
        $data = [];
        
        if ($this->titulo !== null) {
            $data['titulo'] = $this->titulo;
        }
        
        if ($this->id_curso !== null) {
            $data['id_curso'] = $this->id_curso;
        }
        
        return $data;
    }
}
