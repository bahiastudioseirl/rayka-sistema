<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Examenes extends Model
{
    use HasFactory;

    protected $table = 'examenes';
    protected $primaryKey = 'id_examen';
    
    protected $fillable = [
        'titulo',
        'id_curso'
    ];

    // Un examen pertenece a un curso
    public function curso()
    {
        return $this->belongsTo(Cursos::class, 'id_curso', 'id_curso');
    }

    // Un examen tiene muchas preguntas
    public function preguntas()
    {
        return $this->hasMany(Preguntas::class, 'id_examen', 'id_examen');
    }


}
