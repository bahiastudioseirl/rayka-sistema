<?php

namespace App\Http\Request\Solicitante;

use Illuminate\Foundation\Http\FormRequest;

class CrearSolicitanteRequest extends FormRequest
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
                'min:2',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'
            ],
            'apellido' => [
                'required',
                'string',
                'max:255',
                'min:2',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'
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
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.min' => 'El nombre debe tener al menos 2 caracteres.',
            'nombre.max' => 'El nombre no puede exceder 255 caracteres.',
            'nombre.regex' => 'El nombre solo puede contener letras y espacios.',

            'apellido.required' => 'El apellido es obligatorio.',
            'apellido.min' => 'El apellido debe tener al menos 2 caracteres.',
            'apellido.max' => 'El apellido no puede exceder 255 caracteres.',
            'apellido.regex' => 'El apellido solo puede contener letras y espacios.',

            'cargo.min' => 'El cargo debe tener al menos 2 caracteres.',
            'cargo.max' => 'El cargo no puede exceder 255 caracteres.',

            'correo.string' => 'El correo debe ser un texto válido.',
            'correo.email' => 'El correo debe tener un formato válido.',
            'correo.max' => 'El correo no puede exceder 255 caracteres.',
            'correo.unique' => 'El correo ya está en uso.',

            'telefono.min' => 'El teléfono debe tener al menos 7 caracteres.',
            'telefono.max' => 'El teléfono no puede exceder 20 caracteres.',

            'id_empresa.integer' => 'El ID de la empresa debe ser un número entero.',
            'id_empresa.exists' => 'La empresa especificada no existe.'
        ];
    }
}