<?php

namespace App\Repositories;

use App\Models\Solicitantes;
use Illuminate\Database\Eloquent\Collection;

class SolicitanteRepository
{
    public function crear(array $data): Solicitantes
    {
        $solicitante = Solicitantes::create($data);
        return Solicitantes::with('empresa')->find($solicitante->id_solicitante);
    }

    public function actualizar(int $id, array $data): bool
    {
        return Solicitantes::where('id_solicitante', $id)->update($data);
    }

    public function obtenerPorId(int $id): ?Solicitantes
    {
        return Solicitantes::with('empresa')->find($id);
    }

    public function listarTodos(): Collection
    {
        return Solicitantes::with('empresa:id_empresa,nombre')
            ->orderBy('id_solicitante', 'desc')
            ->get();
    }

    public function listarPorEmpresa(int $idEmpresa): Collection
    {
        return Solicitantes::with('empresa:id_empresa,nombre')
            ->where('id_empresa', $idEmpresa)
            ->orderBy('id_solicitante', 'desc')
            ->get();
    }
}
