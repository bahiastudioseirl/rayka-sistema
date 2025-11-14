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
        public readonly string $fecha_inicio,
        public readonly string $fecha_fin,
        public readonly array $cursos = [], // IDs de cursos
        public readonly array $usuarios_estudiantes = [], // IDs de estudiantes
        public readonly ?string $observaciones = null
    ) {}
    
    public static function fromRequest(array $validatedData): self
    {
        // Generar link único automáticamente
        $linkUnico = uniqid('cap_') . '_' . time();
        
        return new self(
            duracion_examen_min: (int) $validatedData['duracion_examen_min'],
            max_intentos: isset($validatedData['max_intentos']) ? (int) $validatedData['max_intentos'] : null,
            link_login_unico: $linkUnico,
            estado: $validatedData['estado'] ?? 'activa',
            id_solicitante: (int) $validatedData['id_solicitante'],
            fecha_inicio: $validatedData['fecha_inicio'],
            fecha_fin: $validatedData['fecha_fin'],
            cursos: $validatedData['cursos'] ?? [],
            usuarios_estudiantes: $validatedData['usuarios_estudiantes'] ?? [],
            observaciones: $validatedData['observaciones'] ?? null
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
            fecha_inicio: $data['fecha_inicio'],
            fecha_fin: $data['fecha_fin'],
            cursos: $data['cursos'] ?? [],
            usuarios_estudiantes: $data['usuarios_estudiantes'] ?? [],
            observaciones: $data['observaciones'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'duracion_examen_min' => $this->duracion_examen_min,
            'max_intentos' => $this->max_intentos,
            'link_login_unico' => $this->link_login_unico,
            'fecha_creacion' => now(),
            'fecha_inicio' => $this->fecha_inicio,
            'fecha_fin' => $this->fecha_fin,
            'estado' => $this->estado,
            'id_solicitante' => $this->id_solicitante,
        ];
    }

    public function toArrayWithRelations(): array
    {
        return [
            'capacitacion' => $this->toArray(),
            'cursos' => $this->cursos,
            'usuarios_estudiantes' => $this->usuarios_estudiantes,
            'observaciones' => $this->observaciones,
        ];
    }
}