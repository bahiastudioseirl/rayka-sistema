<?php

namespace App\Utils;

enum RolesEnum: int
{
    case ADMINISTRADOR = 1;
    case ESTUDIANTE = 2;

    public function getName(): string
    {
        return match($this) {
            self::ADMINISTRADOR => 'Administrador',
            self::ESTUDIANTE => 'Estudiante',
        };
    }

    public function getDescription(): string
    {
        return match($this) {
            self::ADMINISTRADOR => 'Administrador del sistema con todos los permisos',
            self::ESTUDIANTE => 'Estudiante con acceso limitado a cursos y contenidos',
        };
    }

    public static function fromId(int $id): ?self
    {
        return match($id) {
            1 => self::ADMINISTRADOR,
            2 => self::ESTUDIANTE,
            default => null,
        };
    }

    public static function getAll(): array
    {
        return [
            self::ADMINISTRADOR->value => self::ADMINISTRADOR->getName(),
            self::ESTUDIANTE->value => self::ESTUDIANTE->getName(),
        ];
    }

    public function isAdmin(): bool
    {
        return $this === self::ADMINISTRADOR;
    }

    public function isStudent(): bool
    {
        return $this === self::ESTUDIANTE;
    }
}