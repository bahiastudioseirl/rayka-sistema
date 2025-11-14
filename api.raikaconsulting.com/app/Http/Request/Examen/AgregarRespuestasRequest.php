<?php

namespace App\Http\Request\Examen;

use Illuminate\Foundation\Http\FormRequest;

class AgregarRespuestasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'respuestas' => [
                'required',
                'array',
                'min:1'
            ],
            'respuestas.*.texto' => [
                'required',
                'string',
                'max:500'
            ],
            'respuestas.*.es_correcta' => [
                'required',
                'boolean'
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'respuestas.required' => 'Debe proporcionar al menos una respuesta.',
            'respuestas.array' => 'Las respuestas deben ser un array.',
            'respuestas.min' => 'Debe agregar al menos una respuesta.',
            'respuestas.*.texto.required' => 'El texto de la respuesta es obligatorio.',
            'respuestas.*.texto.string' => 'El texto debe ser una cadena de caracteres.',
            'respuestas.*.texto.max' => 'El texto no puede exceder 500 caracteres.',
            'respuestas.*.es_correcta.required' => 'Debe indicar si la respuesta es correcta.',
            'respuestas.*.es_correcta.boolean' => 'El campo es_correcta debe ser verdadero o falso.'
        ];
    }

}
