<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IntentosExamen extends Model
{
    use HasFactory;

    protected $table = 'intentos_examen';
    protected $primaryKey = 'id_intento_examen';
    public $timestamps = false;
    
    protected $fillable = [
        'id_progreso',
        'num_intento',
        'nota',
        'respuestas_correctas',
        'total_preguntas',
        'resultado',
        'fecha_intento'
    ];

    protected $casts = [
        'nota' => 'float',
        'num_intento' => 'integer',
        'respuestas_correctas' => 'integer',
        'total_preguntas' => 'integer',
        'fecha_intento' => 'datetime',
    ];

    // Un intento pertenece a un progreso
    public function progreso()
    {
        return $this->belongsTo(Progresos::class, 'id_progreso', 'id_progreso');
    }
}
