<?php

namespace App\Http\Request\Capacitaciones;

use Illuminate\Foundation\Http\FormRequest;

class ActualizarCapacitacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'duracion_examen_min' => [
                'sometimes',
                'integer',
                'min:1',
                'max:600'
            ],
            'max_intentos' => [
                'sometimes',
                'nullable',
                'integer',
                'min:1',
                'max:10'
            ],
            'fecha_inicio' => [
                'sometimes',
                'date'
            ],
            'fecha_fin' => [
                'sometimes',
                'date'
            ],
            'estado' => [
                'sometimes',
                'in:activa,inactiva,finalizada'
            ],
            'observaciones' => [
                'nullable',
                'string',
                'max:1000'
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'duracion_examen_min.integer' => 'La duración debe ser un número entero.',
            'duracion_examen_min.min' => 'La duración mínima del examen es 1 minuto.',
            'duracion_examen_min.max' => 'La duración máxima del examen es 600 minutos (10 horas).',
            
            'max_intentos.integer' => 'Los intentos máximos deben ser un número entero.',
            'max_intentos.min' => 'Debe permitir al menos 1 intento.',
            'max_intentos.max' => 'Máximo 10 intentos permitidos.',
            
            'fecha_inicio.date' => 'La fecha de inicio debe ser una fecha válida.',
            
            'fecha_fin.date' => 'La fecha de fin debe ser una fecha válida.',
            
            'estado.in' => 'El estado debe ser: activa, inactiva o finalizada.',
            
            'observaciones.max' => 'Las observaciones no pueden exceder 1000 caracteres.'
        ];
    }
}
