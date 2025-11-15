<?php

namespace App\Http\Request\Capacitaciones;

use Illuminate\Foundation\Http\FormRequest;

class CrearCapacitacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'duracion_examen_min' => [
                'required',
                'integer',
                'min:1',
                'max:600' 
            ],
            'max_intentos' => [
                'nullable',
                'integer',
                'min:1',
                'max:10'
            ],
            'id_solicitante' => [
                'required',
                'integer',
                'exists:solicitantes,id_solicitante'
            ],
            'usuarios_estudiantes' => [
                'required',
                'array',
                'min:1'
            ],
            'usuarios_estudiantes.*' => [
                'required',
                'integer',
                'exists:usuarios,id_usuario'
            ],
            'cursos' => [
                'required',
                'array',
                'min:1'
            ],
            'cursos.*' => [
                'required',
                'integer',
                'exists:cursos,id_curso'
            ],
            'fecha_inicio' => [
                'required',
                'date',
                'after_or_equal:today'
            ],
            'fecha_fin' => [
                'required',
                'date',
                'after:fecha_inicio'
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
            'duracion_examen_min.required' => 'La duración del examen es obligatoria.',
            'duracion_examen_min.integer' => 'La duración debe ser un número entero.',
            'duracion_examen_min.min' => 'La duración mínima del examen es 1 minuto.',
            'duracion_examen_min.max' => 'La duración máxima del examen es 600 minutos (10 horas).',
            
            'max_intentos.integer' => 'Los intentos máximos deben ser un número entero.',
            'max_intentos.min' => 'Debe permitir al menos 1 intento.',
            'max_intentos.max' => 'Máximo 10 intentos permitidos.',
            
            'id_solicitante.required' => 'El solicitante es obligatorio.',
            'id_solicitante.exists' => 'El solicitante especificado no existe.',
            
            'usuarios_estudiantes.required' => 'Debe incluir al menos un estudiante.',
            'usuarios_estudiantes.array' => 'Los estudiantes deben ser un array.',
            'usuarios_estudiantes.min' => 'Debe incluir al menos un estudiante.',
            'usuarios_estudiantes.*.exists' => 'Uno o más usuarios no existen.',
            
            'cursos.required' => 'Debe incluir al menos un curso.',
            'cursos.array' => 'Los cursos deben ser un array.',
            'cursos.min' => 'Debe incluir al menos un curso.',
            'cursos.*.exists' => 'Uno o más cursos no existen.',
            
            'fecha_inicio.required' => 'La fecha de inicio es obligatoria.',
            'fecha_inicio.date' => 'La fecha de inicio debe ser una fecha válida.',
            'fecha_inicio.after_or_equal' => 'La fecha de inicio debe ser hoy o posterior.',
            
            'fecha_fin.required' => 'La fecha de fin es obligatoria.',
            'fecha_fin.date' => 'La fecha de fin debe ser una fecha válida.',
            'fecha_fin.after' => 'La fecha de fin debe ser posterior a la fecha de inicio.',
            
            'observaciones.max' => 'Las observaciones no pueden exceder 1000 caracteres.'
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
            
            if ($this->has('cursos')) {
                $cursosActivos = \App\Models\Cursos::whereIn('id_curso', $this->cursos)
                    ->where('activo', true)
                    ->count();
                    
                if ($cursosActivos !== count($this->cursos)) {
                    $validator->errors()->add('cursos', 'Todos los cursos deben estar activos.');
                }
            }
        });
    }
}