<?php

namespace App\DTOs\Usuarios;

use App\Utils\RolesEnum;

class CrearAdministradorDTO
{
    public function __construct(
        public readonly string $nombre,
        public readonly string $apellido,
        public readonly string $correo,
        public readonly string $contrasenia,
        public readonly bool $activo = true,
        public readonly int $id_rol = RolesEnum::ADMINISTRADOR->value
    ) {}
    
    public static function fromRequest(array $validatedData): self
    {
        return new self(
            nombre: trim($validatedData['nombre']),
            apellido: trim($validatedData['apellido']),
            correo: strtolower(trim($validatedData['correo'])),
            contrasenia: $validatedData['contrasenia'],
            activo: $validatedData['activo'] ?? true,
            id_rol: RolesEnum::ADMINISTRADOR->value 
        );
    }

    public static function fromArray(array $data): self
    {
        return self::fromRequest($data);
    }

    public function toArray(): array
    {
        return [
            'nombre' => $this->nombre,
            'apellido' => $this->apellido,
            'correo' => $this->correo,
            'contrasenia' => $this->contrasenia,
            'activo' => $this->activo,
            'id_rol' => $this->id_rol,
        ];
    }

}
