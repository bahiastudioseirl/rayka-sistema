<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Preguntas extends Model
{
    use HasFactory;

    protected $table = 'preguntas';
    protected $primaryKey = 'id_pregunta';
    public $timestamps = false;
    
    protected $fillable = [
        'texto',
        'id_examen'
    ];

    // Una pregunta pertenece a un examen
    public function examen()
    {
        return $this->belongsTo(Examenes::class, 'id_examen', 'id_examen');
    }

    // Una pregunta tiene muchas respuestas
    public function respuestas()
    {
        return $this->hasMany(Respuestas::class, 'id_pregunta', 'id_pregunta');
    }
}
