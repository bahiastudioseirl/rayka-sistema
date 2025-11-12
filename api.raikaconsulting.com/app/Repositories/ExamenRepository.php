<?php

namespace App\Repositories;

use App\Models\Examenes;
use App\Models\Preguntas;
use App\Models\Respuestas;
use Illuminate\Support\Facades\DB;

class ExamenRepository
{
    public function crearExamenCompleto(array $datosExamen): Examenes
    {
        return DB::transaction(function () use ($datosExamen) {
            $examen = Examenes::create([
                'titulo' => $datosExamen['titulo'],
                'id_curso' => $datosExamen['id_curso']
            ]);

            if (isset($datosExamen['preguntas']) && is_array($datosExamen['preguntas'])) {
                foreach ($datosExamen['preguntas'] as $preguntaData) {
                    $pregunta = Preguntas::create([
                        'texto' => $preguntaData['texto'],
                        'id_examen' => $examen->id_examen
                    ]);

                    if (isset($preguntaData['respuestas']) && is_array($preguntaData['respuestas'])) {
                        foreach ($preguntaData['respuestas'] as $respuestaData) {
                            Respuestas::create([
                                'texto' => $respuestaData['texto'],
                                'es_correcta' => $respuestaData['es_correcta'],
                                'id_pregunta' => $pregunta->id_pregunta
                            ]);
                        }
                    }
                }
            }

            return Examenes::with(['preguntas.respuestas', 'curso'])->find($examen->id_examen);
        });
    }

    public function obtenerPorId(int $idExamen): ?Examenes
    {
        return Examenes::with(['preguntas.respuestas', 'curso'])->find($idExamen);
    }

    public function obtenerPorCurso(int $idCurso)
    {
        return Examenes::with(['preguntas.respuestas'])
            ->where('id_curso', $idCurso)
            ->get();
    }

    public function cursoExiste(int $idCurso): bool
    {
        return DB::table('cursos')->where('id_curso', $idCurso)->exists();
    }

    public function agregarPreguntas(int $idExamen, array $preguntas): Examenes
    {
        return DB::transaction(function () use ($idExamen, $preguntas) {
            $examen = Examenes::find($idExamen);
            
            if (!$examen) {
                throw new \Exception("El examen con ID {$idExamen} no existe.");
            }

            foreach ($preguntas as $preguntaData) {
                $pregunta = Preguntas::create([
                    'texto' => $preguntaData['texto'],
                    'id_examen' => $idExamen
                ]);

                if (isset($preguntaData['respuestas']) && is_array($preguntaData['respuestas'])) {
                    foreach ($preguntaData['respuestas'] as $respuestaData) {
                        Respuestas::create([
                            'texto' => $respuestaData['texto'],
                            'es_correcta' => $respuestaData['es_correcta'],
                            'id_pregunta' => $pregunta->id_pregunta
                        ]);
                    }
                }
            }

            return Examenes::with(['preguntas.respuestas', 'curso'])->find($idExamen);
        });
    }

    public function actualizarExamen(int $idExamen, array $datos): ?Examenes
    {
        $examen = Examenes::find($idExamen);
        
        if (!$examen) {
            return null;
        }

        $examen->update($datos);
        
        return Examenes::with(['preguntas.respuestas', 'curso'])->find($idExamen);
    }

    public function eliminarPregunta(int $idPregunta): bool
    {
        return DB::transaction(function () use ($idPregunta) {
            $pregunta = Preguntas::find($idPregunta);
            
            if (!$pregunta) {
                return false;
            }

            Respuestas::where('id_pregunta', $idPregunta)->delete();
            
            return $pregunta->delete();
        });
    }

    public function preguntaExiste(int $idPregunta): bool
    {
        return Preguntas::where('id_pregunta', $idPregunta)->exists();
    }

    public function preguntaPerteneceAExamen(int $idPregunta, int $idExamen): bool
    {
        return Preguntas::where('id_pregunta', $idPregunta)
            ->where('id_examen', $idExamen)
            ->exists();
    }
}
