<?php

namespace App\DTOs\Solicitantes;

class ActualizarSolicitanteDTO
{
    public function __construct(
        public readonly ?string $nombre = null,
        public readonly ?string $apellido = null,
        public readonly ?string $cargo = null,
        public readonly ?string $correo = null,
        public readonly ?string $telefono = null,
        public readonly ?int $id_empresa = null
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            nombre: isset($data['nombre']) ? trim($data['nombre']) : null,
            apellido: isset($data['apellido']) ? trim($data['apellido']) : null,
            cargo: isset($data['cargo']) ? trim($data['cargo']) : null,
            correo: isset($data['correo']) ? strtolower(trim($data['correo'])) : null,
            telefono: isset($data['telefono']) ? trim($data['telefono']) : null,
            id_empresa: isset($data['id_empresa']) ? (int) $data['id_empresa'] : null
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
        if ($this->cargo !== null) {
            $result['cargo'] = $this->cargo;
        }
        if ($this->correo !== null) {
            $result['correo'] = $this->correo;
        }
        if ($this->telefono !== null) {
            $result['telefono'] = $this->telefono;
        }
        if ($this->id_empresa !== null) {
            $result['id_empresa'] = $this->id_empresa;
        }
        return $result;
    }

}