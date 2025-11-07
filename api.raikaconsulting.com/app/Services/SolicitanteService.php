<?php

namespace App\Services;

use App\DTOs\Solicitantes\CrearSolicitanteDTO;
use App\Repositories\EmpresaRepository;
use App\Repositories\SolicitanteRepository;
use Illuminate\Validation\ValidationException;

class SolicitanteService
{
    public function __construct(
        private readonly SolicitanteRepository $solicitanteRepository,
        private readonly EmpresaRepository $empresaRepository
    ){}

    public function crearSolicitante(array $data)
    {
        if($this->empresaRepository->obtenerPorId($data['id_empresa']) === null){
            throw ValidationException::withMessages([
                'id_empresa' => ['La empresa especificada no existe.']
            ]);
        }

       $dto = new CrearSolicitanteDTO(
            nombre: trim($data['nombre']),
            apellido: trim($data['apellido']),
            cargo: trim($data['cargo']),
            correo: strtolower(trim($data['correo'])),
            telefono: trim($data['telefono']),
            id_empresa: (int) $data['id_empresa']
       );

       return $this->solicitanteRepository->crear($dto->toArray());
    }

    public function actualizarSolicitante(int $idSolicitante, array $data)
    {
        $solicitante = $this->solicitanteRepository->obtenerPorId($idSolicitante);
        if(!$solicitante){
            throw ValidationException::withMessages([
                'solicitante' => ['El solicitante especificado no existe.']
            ]);
        }

        if (isset($data['id_empresa'])) {
            if ($this->empresaRepository->obtenerPorId($data['id_empresa']) === null) {
                throw ValidationException::withMessages([
                    'id_empresa' => ['La empresa especificada no existe.']
                ]);
            }
        }

        return $this->solicitanteRepository->actualizar($idSolicitante, $data);
    }

    public function listarSolicitantesPorEmpresa(int $idEmpresa)
    {
        if($this->empresaRepository->obtenerPorId($idEmpresa) === null){
            throw ValidationException::withMessages([
                'id_empresa' => ['La empresa especificada no existe.']
            ]);
        }

        return $this->solicitanteRepository->listarPorEmpresa($idEmpresa);
    }

    public function listarTodosLosSolicitantes()
    {
        return $this->solicitanteRepository->listarTodos();
    }

    public function obtenerSolicitantePorId(int $idSolicitante)
    {
        $solicitante = $this->solicitanteRepository->obtenerPorId($idSolicitante);
        if(!$solicitante){
            throw ValidationException::withMessages([
                'solicitante' => ['El solicitante especificado no existe.']
            ]);
        }

        return $solicitante;
    }

    
}