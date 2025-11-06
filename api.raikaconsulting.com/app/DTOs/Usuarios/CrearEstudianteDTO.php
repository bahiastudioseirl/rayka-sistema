<?php

namespace App\DTOs\Usuarios;

use App\Utils\RolesEnum;

class CrearEstudianteDTO
{
    public function __construct(
        public readonly string $nombre,
        public readonly string $apellido,
        public readonly string $correo,
        public readonly string $contrasenia,
        public readonly bool $activo = true,
        public readonly int $id_rol = RolesEnum::ESTUDIANTE->value
    ) {}
    
    public static function fromRequest(array $validatedData): self
    {
        $contrasenia = $validatedData['contrasenia'] ?? self::generateRandomPassword();
        
        return new self(
            nombre: trim($validatedData['nombre']),
            apellido: trim($validatedData['apellido']),
            correo: strtolower(trim($validatedData['correo'])),
            contrasenia: $contrasenia,
            activo: $validatedData['activo'] ?? true,
            id_rol: RolesEnum::ESTUDIANTE->value 
        );
    }

    public static function fromArray(array $data): self
    {
        $contrasenia = $data['contrasenia'] ?? self::generateRandomPassword();
        
        return new self(
            nombre: trim($data['nombre']),
            apellido: trim($data['apellido']),
            correo: strtolower(trim($data['correo'])),
            contrasenia: $contrasenia,
            activo: $data['activo'] ?? true,
            id_rol: $data['id_rol'] ?? RolesEnum::ESTUDIANTE->value
        );
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


    /**
     * Generar una contraseña aleatoria segura
     */
    private static function generateRandomPassword(): string
    {
        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&';
        $password = '';
        
        $password .= chr(rand(97, 122)); // minúscula
        $password .= chr(rand(65, 90));  // mayúscula
        $password .= chr(rand(48, 57));  // número
        $password .= '@$!%*?&'[rand(0, 7)]; // símbolo
        
        // Completar hasta 10 caracteres
        for ($i = 4; $i < 10; $i++) {
            $password .= $chars[rand(0, strlen($chars) - 1)];
        }
        
        return str_shuffle($password);
    }
}