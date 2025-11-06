<?php

namespace App\DTOs\Usuarios;

class ActualizarUsuarioDTO
{
    public function __construct(
        public readonly ?string $nombre = null,
        public readonly ?string $apellido = null,
        public readonly ?string $correo = null,
        public readonly ?string $contrasenia = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            nombre: isset($data['nombre']) ? trim($data['nombre']) : null,
            apellido: isset($data['apellido']) ? trim($data['apellido']) : null,
            correo: isset($data['correo']) ? strtolower(trim($data['correo'])) : null,
            contrasenia: $data['contrasenia'] ?? null,
        );
    }

    public static function fromRequest(array $data): self
    {
        return self::fromArray($data);
    }

    public function toArray(): array
    {
        $result = [];
        if ($this->nombre !== null) {
            $result['nombre'] = $this->nombre;
        }
        if ($this->apellido !== null) {
            $result['apellido'] = $this->apellido;
        }
        if ($this->correo !== null) {
            $result['correo'] = $this->correo;
        }
        if ($this->contrasenia !== null) {
            $result['contrasenia'] = $this->contrasenia;
        }
        return $result;
    }
}