<?php

namespace App\DTOs\Capacitaciones;

class CrearCapacitacionDTO
{
    public function __construct(
        public readonly int $duracion_examen_min,
        public readonly ?int $max_intentos,
        public readonly string $link_login_unico,
        public readonly string $estado,
        public readonly int $id_solicitante,
        public readonly array $cursos = [], // IDs de cursos
        public readonly array $estudiantes = [] // IDs de estudiantes
    ) {}
    
    public static function fromRequest(array $validatedData): self
    {
        // Generar link único automáticamente
        $linkUnico = 'capacitacion-' . uniqid() . '-' . time();
        
        return new self(
            duracion_examen_min: (int) $validatedData['duracion_examen_min'],
            max_intentos: isset($validatedData['max_intentos']) ? (int) $validatedData['max_intentos'] : null,
            link_login_unico: $linkUnico,
            estado: $validatedData['estado'] ?? 'activa',
            id_solicitante: (int) $validatedData['id_solicitante'],
            cursos: $validatedData['cursos'] ?? [],
            estudiantes: $validatedData['estudiantes'] ?? []
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            duracion_examen_min: (int) $data['duracion_examen_min'],
            max_intentos: isset($data['max_intentos']) ? (int) $data['max_intentos'] : null,
            link_login_unico: $data['link_login_unico'],
            estado: $data['estado'] ?? 'activa',
            id_solicitante: (int) $data['id_solicitante'],
            cursos: $data['cursos'] ?? [],
            estudiantes: $data['estudiantes'] ?? []
        );
    }

    public function toArray(): array
    {
        return [
            'duracion_examen_min' => $this->duracion_examen_min,
            'max_intentos' => $this->max_intentos,
            'link_login_unico' => $this->link_login_unico,
            'estado' => $this->estado,
            'id_solicitante' => $this->id_solicitante,
        ];
    }

    public function toArrayWithRelations(): array
    {
        return [
            'capacitacion' => $this->toArray(),
            'cursos' => $this->cursos,
            'estudiantes' => $this->estudiantes,
        ];
    }
}