<?php

namespace App\Http\Request\Examen;

use Illuminate\Foundation\Http\FormRequest;

class ActualizarExamenRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'titulo' => 'nullable|string|max:255',
            'id_curso' => 'nullable|integer|exists:cursos,id_curso'
        ];
    }

    public function messages(): array
    {
        return [
            'titulo.max' => 'El título no puede exceder 255 caracteres.',
            'id_curso.integer' => 'El ID del curso debe ser un número entero.',
            'id_curso.exists' => 'El curso especificado no existe.'
        ];
    }
}
