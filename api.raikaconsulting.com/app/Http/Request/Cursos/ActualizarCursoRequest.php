<?php

namespace App\Http\Request\Cursos;
use Illuminate\Foundation\Http\FormRequest;

class ActualizarCursoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules():array
    {
        return [
            'titulo' => [
                'sometimes',
                'string',
                'max:255',
                'min:2'
            ],
            'descripcion' => [
                'sometimes',
                'nullable',
                'string',
                'max:1000'
            ],
            'contenido' => [
                'sometimes',
                'nullable',
                'string',
                'min:10'
            ],
            'archivo' => [
                'sometimes',
                'nullable',
                'file',
                'mimes:mp4,avi,mov,wmv,flv,webm,mkv',
                'max:500000' // 500MB máximo
            ],
            'imagen' => [
                'sometimes',
                'nullable',
                'image',
                'mimes:jpeg,jpg,png,webp',
                'max:5120' // 5MB máximo
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
            'titulo.min' => 'El título debe tener al menos 2 caracteres.',
            'titulo.max' => 'El título no puede exceder 255 caracteres.',

            'descripcion.max' => 'La descripción no puede exceder 1000 caracteres.',

            'contenido.min' => 'El contenido debe tener al menos 10 caracteres.',

            'archivo.file' => 'Debe ser un archivo válido.',
            'archivo.mimes' => 'El archivo debe ser un video (mp4, avi, mov, wmv, flv, webm, mkv).',
            'archivo.max' => 'El archivo no puede exceder 500MB.',

            'imagen.image' => 'Debe ser una imagen válida.',
            'imagen.mimes' => 'La imagen debe ser formato jpeg, jpg, png o webp.',
            'imagen.max' => 'La imagen no puede exceder 5MB.',
        ];
    }

}