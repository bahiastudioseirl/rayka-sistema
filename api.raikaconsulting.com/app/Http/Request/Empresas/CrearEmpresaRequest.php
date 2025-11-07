<?php

namespace App\Http\Request\Empresas;

use Illuminate\Foundation\Http\FormRequest;

class CrearEmpresaRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        return [
            'nombre' => [
                'required',
                'string',
                'max:255',
                'min:2'
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre de la empresa es obligatorio.',
            'nombre.min' => 'El nombre de la empresa debe tener al menos 2 caracteres.',
            'nombre.max' => 'El nombre de la empresa no puede exceder 255 caracteres.'
        ];
    }
}