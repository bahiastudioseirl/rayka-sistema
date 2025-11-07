<?php

namespace App\Services;

use App\DTOs\Empresas\CrearEmpresaDTO;
use App\Models\Empresas;
use App\Repositories\EmpresaRepository;
use Illuminate\Validation\ValidationException;

class EmpresaService{
    public function __construct(
        private readonly EmpresaRepository $empresaRepository
    )
    {}

    public function crearEmpresa(array $datosValidados, $usuarioAutenticado): Empresas
    {
        if (!$usuarioAutenticado) {
            throw ValidationException::withMessages([
                'auth' => ['Usuario no autenticado.']
            ]);
        }

        $creado_por = $usuarioAutenticado->id_usuario;

        if($this->empresaRepository->obtenerPorNombre($datosValidados['nombre'])){
            throw ValidationException::withMessages([
                'nombre' => ['El nombre de la empresa ya está registrado.']
            ]);
        }
        
        $dto = new CrearEmpresaDTO(
            nombre: trim($datosValidados['nombre']),
            creado_por: $creado_por
        );

        return $this->empresaRepository->crear($dto->toArray());
    }

    public function actualizarEmpresa(int $idEmpresa, array $datosValidados): Empresas
    {
        $empresa = $this->empresaRepository->obtenerPorId($idEmpresa);
        if (!$empresa) {
            throw ValidationException::withMessages([
                'empresa' => ['La empresa especificada no existe.']
            ]);
        }

        if (isset($datosValidados['nombre']) && $datosValidados['nombre'] !== $empresa->nombre) {
            if ($this->empresaRepository->obtenerPorNombre($datosValidados['nombre'])) {
                throw ValidationException::withMessages([
                    'nombre' => ['El nombre de la empresa ya está registrado.']
                ]);
            }
        }

        $actualizado = $this->empresaRepository->actualizar($idEmpresa, $datosValidados);
        
        if (!$actualizado) {
            throw ValidationException::withMessages([
                'empresa' => ['No se pudo actualizar la empresa.']
            ]);
        }
        
        return $this->empresaRepository->obtenerPorId($idEmpresa);
    }

    public function listarEmpresas(): array
    {
        $empresas = $this->empresaRepository->listarTodos();
        return $empresas->toArray();
    }


    public function obtenerEmpresaPorId(int $idEmpresa): ?Empresas
    {
        return $this->empresaRepository->obtenerPorId($idEmpresa);
    }


}