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

}