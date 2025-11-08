<?php

namespace App\Http\Request\Capacitaciones;

use Illuminate\Foundation\Http\FormRequest;

class AgregarEstudiantesCapacitacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'usuarios_estudiantes' => [
                'required',
                'array',
                'min:1'
            ],
            'usuarios_estudiantes.*' => [
                'required',
                'integer',
                'exists:usuarios,id_usuario'
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'usuarios_estudiantes.required' => 'La lista de estudiantes es obligatoria.',
            'usuarios_estudiantes.array' => 'Los estudiantes deben ser un array.',
            'usuarios_estudiantes.min' => 'Debe incluir al menos un estudiante.',
            'usuarios_estudiantes.*.required' => 'Cada estudiante debe tener un ID válido.',
            'usuarios_estudiantes.*.integer' => 'El ID del estudiante debe ser un número entero.',
            'usuarios_estudiantes.*.exists' => 'Uno o más usuarios no existen.'
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->has('usuarios_estudiantes')) {
                $usuariosEstudiantes = \App\Models\Usuarios::whereIn('id_usuario', $this->usuarios_estudiantes)
                    ->where('id_rol', 2) 
                    ->count();
                
                if ($usuariosEstudiantes !== count($this->usuarios_estudiantes)) {
                    $validator->errors()->add('usuarios_estudiantes', 'Todos los usuarios deben tener rol de estudiante.');
                }
            }
        });
    }
}