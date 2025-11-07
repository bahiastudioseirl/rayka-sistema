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
            'contrasenia' => [
                'required',
                'string',
                'min:8',
                'max:255',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/'
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'contrasenia.required' => 'La contraseña es obligatoria.',
            'contrasenia.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'contrasenia.max' => 'La contraseña no puede exceder 255 caracteres.',
            'contrasenia.regex' => 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.'
        ];
    }
}