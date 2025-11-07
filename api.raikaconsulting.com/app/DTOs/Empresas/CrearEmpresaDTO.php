<?php

namespace App\DTOs\Empresas;

class CrearEmpresaDTO
{
    public function __construct(
        public readonly string $nombre,
        public readonly int $creado_por
    ) {}
    
    public static function fromRequest(array $validatedData, int $creado_por): self
    {
        return new self(
            nombre: trim($validatedData['nombre']),
            creado_por: $creado_por
        );
    }

    public static function fromArray(array $data, int $creado_por): self
    {
        return new self(
            nombre: trim($data['nombre']),
            creado_por: $creado_por
        );
    }

    public function toArray(): array
    {
        return [
            'nombre' => $this->nombre,
            'creado_por' => $this->creado_por,
        ];
    }
}