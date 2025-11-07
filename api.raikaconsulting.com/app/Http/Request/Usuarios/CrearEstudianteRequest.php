<?php

namespace App\Http\Request\Usuarios;

use Illuminate\Foundation\Http\FormRequest;

class CrearEstudianteRequest extends FormRequest
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
            'num_documento' => [
                'required',
                'string',
                'max:50',
                'min:5',
                'unique:usuarios,num_documento'
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
            
            'num_documento.required' => 'El número de documento es obligatorio.',
            'num_documento.min' => 'El número de documento debe tener al menos 5 caracteres.',
            'num_documento.max' => 'El número de documento no puede exceder 50 caracteres.',
            'num_documento.unique' => 'Este número de documento ya está registrado.'
        ];
    }
}
