<?php

namespace App\Repositories;

use App\Models\Empresas;
use Illuminate\Database\Eloquent\Collection;

class EmpresaRepository
{
    public function obtenerPorNombre(string $nombre): ?Empresas
    {
        return Empresas::where('nombre', $nombre)->first();
    }
    
    public function crear(array $datos): Empresas
    {
        return Empresas::create($datos);
    }
    
    public function actualizar(int $id, array $datos): bool
    {
        return Empresas::where('id_empresa', $id)->update($datos);
    }
    
    public function obtenerPorId(int $id): ?Empresas
    {
        return Empresas::find($id);
    }

    public function listarTodos(): Collection
    {
        return Empresas::orderBy('fecha_creacion', 'desc')->get();
    }

}