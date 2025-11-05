<?php

namespace App\Http\Request\Usuarios;

use Illuminate\Foundation\Http\FormRequest;

class CrearAdministradorRequest extends FormRequest
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
            'correo' => [
                'required',
                'string',
                'email:rfc,dns',
                'max:255',
                'unique:usuarios,correo'
            ],
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
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.min' => 'El nombre debe tener al menos 2 caracteres.',
            'nombre.max' => 'El nombre no puede exceder 255 caracteres.',
            'nombre.regex' => 'El nombre solo puede contener letras, espacios y acentos.',
            
            'apellido.required' => 'El apellido es obligatorio.',
            'apellido.min' => 'El apellido debe tener al menos 2 caracteres.',
            'apellido.max' => 'El apellido no puede exceder 255 caracteres.',
            'apellido.regex' => 'El apellido solo puede contener letras, espacios y acentos.',
            
            'correo.required' => 'El correo electrónico es obligatorio.',
            'correo.email' => 'El correo electrónico debe tener un formato válido.',
            'correo.unique' => 'Este correo electrónico ya está registrado.',
            'correo.max' => 'El correo electrónico no puede exceder 255 caracteres.',
            
            'contrasenia.required' => 'La contraseña es obligatoria.',
            'contrasenia.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'contrasenia.max' => 'La contraseña no puede exceder 255 caracteres.',
            'contrasenia.regex' => 'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 símbolo especial.',
            
        ];
    }
}
