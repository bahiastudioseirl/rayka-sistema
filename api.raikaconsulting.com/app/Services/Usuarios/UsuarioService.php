<?php

namespace App\Services\Usuarios;

use App\DTOs\Usuarios\CrearAdministradorDTO;
use App\Models\Usuarios;
use App\Models\Roles;
use App\Repositories\UsuarioRepository;
use App\Utils\RolesEnum;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class UsuarioService
{
    public function __construct(
        private readonly UsuarioRepository $usuarioRepository
    ) {}

    public function crearAdministrador(CrearAdministradorDTO $dto): Usuarios
    {
        if ($this->usuarioRepository->obtenerPorCorreo($dto->correo)) {
            throw ValidationException::withMessages([
                'correo' => ['El correo electrónico ya está registrado.']
            ]);
        }

        $rolAdmin = Roles::find($dto->id_rol);
        if (!$rolAdmin) {
            throw new ModelNotFoundException('El rol especificado no existe');
        }

        if ($rolAdmin->nombre !== RolesEnum::ADMINISTRADOR->getName()) {
            throw ValidationException::withMessages([
                'id_rol' => ['Solo se puede crear usuarios con rol de administrador en este endpoint']
            ]);
        }

        return $this->usuarioRepository->crear($dto->toArray());
    }
}