<?php

namespace App\Http\Request\Empresas;

use Illuminate\Foundation\Http\FormRequest;

class ActualizarSolicitanteRequest extends FormRequest
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
            ],
            'apellido' => [
                'sometimes',
                'string',
                'max:255',
                'min:2'
            ],
            'cargo' => [
                'sometimes',
                'string',
                'max:255',
                'min:2'
            ],
            'correo' => [
                'sometimes',
                'string',
                'email:rfc,dns',
                'max:255',
                'unique:solicitantes,correo'
            ],
            'telefono' => [
                'sometimes',
                'string',
                'max:20',
                'min:7'
            ],
            'id_empresa' => [
                'sometimes',
                'integer',
                'exists:empresas,id_empresa'
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.min' => 'El nombre debe tener al menos 2 caracteres.',
            'nombre.max' => 'El nombre no puede exceder 255 caracteres.',
            'apellido.min' => 'El apellido debe tener al menos 2 caracteres.',
            'apellido.max' => 'El apellido no puede exceder 255 caracteres.',
            'cargo.min' => 'El cargo debe tener al menos 2 caracteres.',
            'cargo.max' => 'El cargo no puede exceder 255 caracteres.',
            'correo.email' => 'El correo debe ser una dirección de correo válida.',
            'correo.max' => 'El correo no puede exceder 255 caracteres.',
            'correo.unique' => 'El correo ya está en uso por otro solicitante.',
            'telefono.min' => 'El teléfono debe tener al menos 7 caracteres.',
            'telefono.max' => 'El teléfono no puede exceder 20 caracteres.',
            'id_empresa.exists' => 'La empresa seleccionada no existe.'
        ];
    }
}