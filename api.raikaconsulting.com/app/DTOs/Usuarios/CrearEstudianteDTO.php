<?php

namespace App\DTOs\Usuarios;

use App\Utils\RolesEnum;

class CrearEstudianteDTO
{
    public function __construct(
        public readonly string $nombre,
        public readonly string $apellido,
        public readonly string $num_documento,
        public readonly ?string $correo = null,
        public readonly ?string $contrasenia = null,
        public readonly bool $activo = true,
        public readonly int $id_rol = RolesEnum::ESTUDIANTE->value
    ) {}
    
    public static function fromRequest(array $validatedData): self
    {
        return new self(
            nombre: trim($validatedData['nombre']),
            apellido: trim($validatedData['apellido']),
            num_documento: trim($validatedData['num_documento']),
            correo: isset($validatedData['correo']) ? strtolower(trim($validatedData['correo'])) : null,
            contrasenia: null,
            activo: $validatedData['activo'] ?? true,
            id_rol: RolesEnum::ESTUDIANTE->value 
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            nombre: trim($data['nombre']),
            apellido: trim($data['apellido']),
            num_documento: trim($data['num_documento']),
            correo: isset($data['correo']) ? strtolower(trim($data['correo'])) : null,
            contrasenia: null,
            activo: $data['activo'] ?? true,
            id_rol: $data['id_rol'] ?? RolesEnum::ESTUDIANTE->value
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'nombre' => $this->nombre,
            'apellido' => $this->apellido,
            'num_documento' => $this->num_documento,
            'correo' => $this->correo,
            'contrasenia' => $this->contrasenia,
            'activo' => $this->activo,
            'id_rol' => $this->id_rol,
        ], function($value) {
            return $value !== null;
        });
    }
}