<?php

namespace App\Repositories;

use App\Models\Solicitantes;
use Illuminate\Database\Eloquent\Collection;

class SolicitanteRepository
{
    public function crear(array $data): Solicitantes
    {
        return Solicitantes::create($data);
    }

    public function actualizar(int $id, array $data): bool
    {
        return Solicitantes::where('id_solicitante', $id)->update($data);
    }

    public function obtenerPorId(int $id): ?Solicitantes
    {
        return Solicitantes::find($id);
    }

    public function listarTodos(): Collection
    {
        return Solicitantes::orderBy('id_solicitante', 'desc')->get();
    }

    public function listarPorEmpresa(int $idEmpresa): Collection
    {
        return Solicitantes::where('id_empresa', $idEmpresa)
            ->orderBy('id_solicitante', 'desc')
            ->get();
    }
}
