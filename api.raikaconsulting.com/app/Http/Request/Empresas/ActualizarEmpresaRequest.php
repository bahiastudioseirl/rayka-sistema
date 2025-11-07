<?php

namespace App\Http\Request\Empresas;
use Illuminate\Foundation\Http\FormRequest;

class ActualizarEmpresaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => [
                'sometimes',
                'string',
                'max:255',
                'min:2'
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.min' => 'El nombre debe tener al menos 2 caracteres.',
            'nombre.max' => 'El nombre no puede exceder 255 caracteres.'
        ];
    }

}