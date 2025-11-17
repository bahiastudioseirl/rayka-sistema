<?php

namespace App\DTOs\Capacitaciones;

class ActualizarCapacitacionDTO
{
    public function __construct(
        public readonly ?int $duracion_examen_min = null,
        public readonly ?int $max_intentos = null,
        public readonly ?string $fecha_inicio = null,
        public readonly ?string $fecha_fin = null,
        public readonly ?string $estado = null,
        public readonly ?string $observaciones = null
    ) {}
    
    public static function fromRequest(array $validatedData): self
    {
        return new self(
            duracion_examen_min: isset($validatedData['duracion_examen_min']) ? (int) $validatedData['duracion_examen_min'] : null,
            max_intentos: isset($validatedData['max_intentos']) ? (int) $validatedData['max_intentos'] : null,
            fecha_inicio: $validatedData['fecha_inicio'] ?? null,
            fecha_fin: $validatedData['fecha_fin'] ?? null,
            estado: $validatedData['estado'] ?? null,
            observaciones: $validatedData['observaciones'] ?? null
        );
    }

    public function toArray(): array
    {
        $data = [];
        
        if ($this->duracion_examen_min !== null) {
            $data['duracion_examen_min'] = $this->duracion_examen_min;
        }
        
        if ($this->max_intentos !== null) {
            $data['max_intentos'] = $this->max_intentos;
        }
        
        if ($this->fecha_inicio !== null) {
            $data['fecha_inicio'] = $this->fecha_inicio;
        }
        
        if ($this->fecha_fin !== null) {
            $data['fecha_fin'] = $this->fecha_fin;
        }
        
        if ($this->estado !== null) {
            $data['estado'] = $this->estado;
        }
        
        return $data;
    }
}
