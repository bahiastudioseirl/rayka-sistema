<?php

namespace App\Http\Request\Progresos;

use Illuminate\Foundation\Http\FormRequest;

class ActualizarProgresoVideoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // No requiere validaciones adicionales ya que el id_curso viene por la URL
            // y el id_usuario viene del middleware de autenticación
        ];
    }

    public function messages(): array
    {
        return [];
    }
}
