<?php

namespace App\Services;

use App\DTOs\Usuarios\CrearAdministradorDTO;
use App\DTOs\Usuarios\CrearEstudianteDTO;
use App\Models\Usuarios;
use App\Models\Roles;
use App\Repositories\UsuarioRepository;
use App\Utils\RolesEnum;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

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

        if ($this->usuarioRepository->obtenerPorNumDocumento($dto->num_documento)) {
            throw ValidationException::withMessages([
                'num_documento' => ['El número de documento ya está registrado.']
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

    public function crearEstudiante(CrearEstudianteDTO $dto): Usuarios
    {
        return DB::transaction(function () use ($dto) {
            if ($this->usuarioRepository->obtenerPorNumDocumento($dto->num_documento)) {
                throw ValidationException::withMessages([
                    'num_documento' => ['El número de documento ya está registrado.']
                ]);
            }
            
            $rolEstudiante = Roles::find($dto->id_rol);
            if (!$rolEstudiante) {
                throw new ModelNotFoundException('El rol especificado no existe');
            }

            if ($rolEstudiante->nombre !== RolesEnum::ESTUDIANTE->getName()) {
                throw ValidationException::withMessages([
                    'id_rol' => ['Solo se puede crear usuarios con rol de estudiante en este endpoint']
                ]);
            }

            return $this->usuarioRepository->crear($dto->toArray());
        });
    }

    public function listarEstudiantes(): array
    {
        $rolEstudiante = Roles::where('nombre', RolesEnum::ESTUDIANTE->getName())->first();
        if (!$rolEstudiante) {
            throw new ModelNotFoundException('Rol de estudiante no encontrado');
        }

        $estudiantes = $this->usuarioRepository->listarPorRol($rolEstudiante->id_rol);
        return $estudiantes->toArray();
    }

    public function listarAdministradores(): array
    {
        $rolAdmin = Roles::where('nombre', RolesEnum::ADMINISTRADOR->getName())->first();
        if (!$rolAdmin) {
            throw new ModelNotFoundException('Rol de administrador no encontrado');
        }

        $administradores = $this->usuarioRepository->listarPorRol($rolAdmin->id_rol);
        return $administradores->toArray();
    }

    public function cambiarEstadoUsuario(int $id): Usuarios
    {
        $usuario = $this->usuarioRepository->obtenerPorId($id);
        if (!$usuario) {
            throw new ModelNotFoundException('Usuario no encontrado');
        }

        $nuevoEstado = !$usuario->activo;

        $actualizado = $this->usuarioRepository->actualizar($id, ['activo' => $nuevoEstado]);
        
        if (!$actualizado) {
            throw new \Exception('Error al actualizar el estado del usuario');
        }

        return $this->usuarioRepository->obtenerPorId($id);
    }

    public function actualizarUsuario(int $id, array $datos): Usuarios
    {
        $usuario = $this->usuarioRepository->obtenerPorId($id);
        if (!$usuario) {
            throw new ModelNotFoundException('Usuario no encontrado');
        }

        $actualizado = $this->usuarioRepository->actualizar($id, $datos);
        
        if (!$actualizado) {
            throw new \Exception('Error al actualizar el usuario');
        }

        return $this->usuarioRepository->obtenerPorId($id);
    }

    public function actualizarContrasenia(int $id, string $contraseniaActual, string $contraseniaNueva): Usuarios
    {
        $usuario = $this->usuarioRepository->obtenerPorId($id);
        if (!$usuario) {
            throw new ModelNotFoundException('Usuario no encontrado');
        }

        if (!Hash::check($contraseniaActual, $usuario->contrasenia)) {
            throw new \Exception('La contraseña actual es incorrecta');
        }

        $contraseniaHasheada = bcrypt($contraseniaNueva);
        
        $actualizado = $this->usuarioRepository->actualizar($id, ['contrasenia' => $contraseniaHasheada]);
        
        if (!$actualizado) {
            throw new \Exception('Error al actualizar la contraseña del usuario');
        }

        return $this->usuarioRepository->obtenerPorId($id);
    }

    public function verUsuarioPorNumDocumento(string $numDocumento): Usuarios
    {
        $usuario = $this->usuarioRepository->obtenerPorNumDocumento($numDocumento);
        if (!$usuario) {
            throw new ModelNotFoundException('Usuario no encontrado');
        }

        return $usuario;
    }
}