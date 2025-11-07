<?php

namespace App\Http\Request\Usuarios;

use Illuminate\Foundation\Http\FormRequest;

class ActualizarUsuarioRequest extends FormRequest
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
                'min:2',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'
            ],
            'apellido' => [
                'sometimes',
                'string',
                'max:255',
                'min:2',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'
            ],
            'num_documento' => [
                'sometimes',
                'string',
                'max:50',
                'min:5',
                'unique:usuarios,num_documento,' . $this->route('id')
            ],
            'correo' => [
                'sometimes',
                'string',
                'email:rfc,dns',
                'max:255',
                'unique:usuarios,correo,' . $this->route('id')
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.min' => 'El nombre debe tener al menos 2 caracteres.',
            'nombre.max' => 'El nombre no puede exceder 255 caracteres.',
            'nombre.regex' => 'El nombre solo puede contener letras, espacios y acentos.',
            
            'apellido.min' => 'El apellido debe tener al menos 2 caracteres.',
            'apellido.max' => 'El apellido no puede exceder 255 caracteres.',
            'apellido.regex' => 'El apellido solo puede contener letras, espacios y acentos.',
            
            'num_documento.min' => 'El número de documento debe tener al menos 5 caracteres.',
            'num_documento.max' => 'El número de documento no puede exceder 50 caracteres.',
            'num_documento.unique' => 'Este número de documento ya está registrado.',
            
            'correo.email' => 'El correo debe ser una dirección de correo válida.',
            'correo.max' => 'El correo no puede exceder 255 caracteres.',
            'correo.unique' => 'El correo ya está registrado.'
        ];
    }
}