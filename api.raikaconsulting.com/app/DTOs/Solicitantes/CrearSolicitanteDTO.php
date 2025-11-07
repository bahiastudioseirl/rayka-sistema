<?php

namespace App\DTOs\Solicitantes;

class CrearSolicitanteDTO
{
    public function __construct(
        public readonly string $nombre,
        public readonly string $apellido,
        public readonly string $cargo,
        public readonly string $correo,
        public readonly string $telefono,
        public readonly int $id_empresa
    ) {}
    
    public static function fromRequest(array $validatedData): self
    {
        return new self(
            nombre: trim($validatedData['nombre']),
            apellido: trim($validatedData['apellido']),
            cargo: trim($validatedData['cargo']),
            correo: strtolower(trim($validatedData['correo'])),
            telefono: trim($validatedData['telefono']),
            id_empresa: (int) $validatedData['id_empresa']
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            nombre: trim($data['nombre']),
            apellido: trim($data['apellido']),
            cargo: trim($data['cargo']),
            correo: strtolower(trim($data['correo'])),
            telefono: trim($data['telefono']),
            id_empresa: (int) $data['id_empresa']
        );
    }

    public function toArray(): array
    {
        return [
            'nombre' => $this->nombre,
            'apellido' => $this->apellido,
            'cargo' => $this->cargo,
            'correo' => $this->correo,
            'telefono' => $this->telefono,
            'id_empresa' => $this->id_empresa,
        ];
    }
}