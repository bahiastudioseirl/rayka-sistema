<?php

namespace App\Http\Request\Capacitaciones;

use Illuminate\Foundation\Http\FormRequest;

class EliminarCursosCapacitacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cursos' => [
                'required',
                'array',
                'min:1'
            ],
            'cursos.*' => [
                'required',
                'integer',
                'exists:cursos,id_curso'
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'cursos.required' => 'Se requiere al menos un curso para eliminar.',
            'cursos.array' => 'Los cursos deben ser un array.',
            'cursos.min' => 'Se requiere al menos un curso para eliminar.',
            'cursos.*.required' => 'Cada curso es requerido.',
            'cursos.*.integer' => 'Cada ID de curso debe ser un número entero.',
            'cursos.*.exists' => 'El curso seleccionado no existe.',
        ];
    }
}