<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Respuestas extends Model
{
    use HasFactory;

    protected $table = 'respuestas';
    protected $primaryKey = 'id_respuesta';
    public $timestamps = false;
    
    protected $fillable = [
        'texto',
        'es_correcta',
        'id_pregunta'
    ];

    protected $casts = [
        'es_correcta' => 'boolean'
    ];

    // Una respuesta pertenece a una pregunta
    public function pregunta()
    {
        return $this->belongsTo(Preguntas::class, 'id_pregunta', 'id_pregunta');
    }
}
