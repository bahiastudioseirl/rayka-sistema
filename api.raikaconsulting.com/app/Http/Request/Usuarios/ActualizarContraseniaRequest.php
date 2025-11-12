<?php

namespace App\Http\Request\Usuarios;

use Illuminate\Foundation\Http\FormRequest;

class ActualizarContraseniaRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        return [
            'contrasenia_actual' => [
                'required',
                'string'
            ],
            'contrasenia_nueva' => [
                'required',
                'string',
                'min:8',
                'max:255',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/',
                'different:contrasenia_actual'
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'contrasenia_actual.required' => 'La contraseña actual es obligatoria.',
            
            'contrasenia_nueva.required' => 'La nueva contraseña es obligatoria.',
            'contrasenia_nueva.min' => 'La nueva contraseña debe tener al menos 8 caracteres.',
            'contrasenia_nueva.max' => 'La nueva contraseña no puede exceder 255 caracteres.',
            'contrasenia_nueva.regex' => 'La nueva contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.',
            'contrasenia_nueva.different' => 'La nueva contraseña debe ser diferente a la contraseña actual.'
        ];
    }
}