<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Examenes extends Model
{
    use HasFactory;

    protected $table = 'examenes';
    protected $primaryKey = 'id_examen';
    
    // Definir nombre de columna de timestamp personalizada
    const CREATED_AT = 'fecha_creacion';
    const UPDATED_AT = null; // No hay columna updated_at en esta tabla
    
    protected $fillable = [
        'nombre',
        'puntaje_total',
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

    // Un examen tiene muchos resultados
    public function resultados()
    {
        return $this->hasMany(ResultadosExamenes::class, 'id_examen', 'id_examen');
    }
}
