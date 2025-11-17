<?php

namespace App\Http\Request\Progresos;

use Illuminate\Foundation\Http\FormRequest;

class RendirExamenRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'respuestas' => ['required', 'array', 'min:1'],
            'respuestas.*.id_pregunta' => ['required', 'integer', 'exists:preguntas,id_pregunta'],
            'respuestas.*.id_respuesta' => ['required', 'integer', 'exists:respuestas,id_respuesta'],
        ];
    }

    public function messages(): array
    {
        return [
            'respuestas.required' => 'Debe proporcionar las respuestas del examen.',
            'respuestas.array' => 'El formato de respuestas es inválido.',
            'respuestas.min' => 'Debe responder al menos una pregunta.',
            'respuestas.*.id_pregunta.required' => 'El ID de la pregunta es obligatorio.',
            'respuestas.*.id_pregunta.exists' => 'La pregunta no existe.',
            'respuestas.*.id_respuesta.required' => 'El ID de la respuesta es obligatorio.',
            'respuestas.*.id_respuesta.exists' => 'La respuesta no existe.',
        ];
    }
}
