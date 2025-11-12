<?php

namespace App\Http\Request\Examen;

use Illuminate\Foundation\Http\FormRequest;

class AgregarPreguntasRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'preguntas' => 'required|array|min:1',
            'preguntas.*.texto' => 'required|string|max:1000',
            'preguntas.*.respuestas' => 'required|array|min:2',
            'preguntas.*.respuestas.*.texto' => 'required|string|max:500',
            'preguntas.*.respuestas.*.es_correcta' => 'required|boolean'
        ];
    }

    public function messages(): array
    {
        return [
            'preguntas.required' => 'Debe proporcionar al menos una pregunta.',
            'preguntas.min' => 'Debe proporcionar al menos una pregunta.',
            'preguntas.*.texto.required' => 'El texto de la pregunta es obligatorio.',
            'preguntas.*.texto.max' => 'El texto de la pregunta no puede exceder 1000 caracteres.',
            'preguntas.*.respuestas.required' => 'Cada pregunta debe tener respuestas.',
            'preguntas.*.respuestas.min' => 'Cada pregunta debe tener al menos 2 respuestas.',
            'preguntas.*.respuestas.*.texto.required' => 'El texto de la respuesta es obligatorio.',
            'preguntas.*.respuestas.*.texto.max' => 'El texto de la respuesta no puede exceder 500 caracteres.',
            'preguntas.*.respuestas.*.es_correcta.required' => 'Debe especificar si la respuesta es correcta.',
            'preguntas.*.respuestas.*.es_correcta.boolean' => 'El campo es_correcta debe ser verdadero o falso.'
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->has('preguntas')) {
                foreach ($this->preguntas as $index => $pregunta) {
                    $numPregunta = $index + 1;
                    
                    if (isset($pregunta['respuestas'])) {
                        $tieneRespuestaCorrecta = collect($pregunta['respuestas'])
                            ->contains('es_correcta', true);
                        
                        if (!$tieneRespuestaCorrecta) {
                            $validator->errors()->add(
                                "preguntas.{$index}.respuestas",
                                "La pregunta #{$numPregunta} debe tener al menos una respuesta correcta."
                            );
                        }

                        $todasCorrectas = collect($pregunta['respuestas'])
                            ->every(fn($r) => isset($r['es_correcta']) && $r['es_correcta'] === true);
                        
                        if ($todasCorrectas && count($pregunta['respuestas']) > 1) {
                            $validator->errors()->add(
                                "preguntas.{$index}.respuestas",
                                "La pregunta #{$numPregunta} no puede tener todas las respuestas como correctas."
                            );
                        }
                    }
                }
            }
        });
    }
}
