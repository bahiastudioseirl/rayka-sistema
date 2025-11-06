<?php

namespace App\Repositories;

use App\Models\Usuarios;
use Illuminate\Database\Eloquent\Collection;

class UsuarioRepository
{

    public function obtenerPorCorreo(string $correo): ?Usuarios
    {
        return Usuarios::with('rol')
            ->where('correo', $correo)
            ->first();
    }

    public function crear(array $datos): Usuarios
    {
        return Usuarios::create($datos);
    }

    public function obtenerPorId(int $id): ?Usuarios
    {
        return Usuarios::with('rol')->find($id);
    }

    public function listarPorRol(int $idRol): Collection
    {
        return Usuarios::with('rol')
            ->where('id_rol', $idRol)
            ->get();
    }

    public function listarTodos(): Collection
    {
        return Usuarios::with('rol')->get();
    }

    public function actualizar(int $id, array $datos): bool
    {
        return Usuarios::where('id_usuario', $id)->update($datos);
    }

    public function eliminar(int $id): bool
    {
        return Usuarios::where('id_usuario', $id)->delete();
    }

}