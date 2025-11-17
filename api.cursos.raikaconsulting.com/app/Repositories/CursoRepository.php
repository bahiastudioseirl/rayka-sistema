<?php

namespace App\Repositories;

use App\Models\Cursos;
use Illuminate\Database\Eloquent\Collection;

class CursoRepository
{
    public function obtenerPorNombre(string $titulo): ?Cursos
    {
        return Cursos::where('titulo', $titulo)->first();
    }
    
    public function crear(array $datos): Cursos
    {
        return Cursos::create($datos);
    }
    
    public function actualizar(int $id, array $datos): bool
    {
        return Cursos::where('id_curso', $id)->update($datos);
    }
    
    public function obtenerPorId(int $id): ?Cursos
    {
        return Cursos::with('creador')->find($id);
    }

    public function listarTodos(): Collection
    {
        return Cursos::with('creador')->orderBy('fecha_creacion', 'desc')->get();
    }

    
}