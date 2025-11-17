<?php

namespace App\Http\Request\Cursos;

use Illuminate\Foundation\Http\FormRequest;

class CrearCursoRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        return [
            'titulo' => [
                'required',
                'string',
                'max:255',
                'min:2'
            ],
            'descripcion' => [
                'nullable',
                'string',
                'max:1000'
            ],
            'imagen' => [
                'nullable',
                'image',
                'mimes:jpeg,jpg,png,webp',
                'max:5120' // 5MB máximo
            ],
            'contenido' => [
                'nullable',
                'string',
                'min:10'
            ],
            'archivo' => [
                'nullable',
                'file',
                'mimes:mp4,avi,mov,wmv,flv,webm,mkv',
                'max:500000' // 500MB máximo
            ],
            'activo' => [
                'sometimes',
                'boolean'
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'titulo.required' => 'El título del curso es obligatorio.',
            'titulo.min' => 'El título del curso debe tener al menos 2 caracteres.',
            'titulo.max' => 'El título del curso no puede exceder 255 caracteres.',
            
            'descripcion.max' => 'La descripción no puede exceder 1000 caracteres.',
            
            'imagen.image' => 'El archivo debe ser una imagen.',
            'imagen.mimes' => 'La imagen debe ser de tipo: jpeg, jpg, png o webp.',
            'imagen.max' => 'La imagen no puede exceder 5MB.',
            
            'contenido.string' => 'El contenido del curso debe ser un texto.',
            'contenido.min' => 'El contenido del curso debe tener al menos 10 caracteres.',
            
            'archivo.file' => 'Debe ser un archivo válido.',
            'archivo.mimes' => 'El archivo debe ser un video (mp4, avi, mov, wmv, flv, webm, mkv).',
            'archivo.max' => 'El archivo no puede exceder 500MB.',
            
            'activo.boolean' => 'El campo activo debe ser verdadero o falso.'
        ];
    }
}