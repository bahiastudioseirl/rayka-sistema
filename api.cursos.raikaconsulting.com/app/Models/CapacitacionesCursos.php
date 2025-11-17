<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CapacitacionesCursos extends Model
{
    use HasFactory;

    protected $table = 'capacitaciones_cursos';
    protected $primaryKey = 'id_capacitacion_curso';
    public $timestamps = false;
    
    protected $fillable = [
        'id_curso',
        'id_capacitacion'
    ];

    // Pertenece a un curso
    public function curso()
    {
        return $this->belongsTo(Cursos::class, 'id_curso', 'id_curso');
    }

    // Pertenece a una capacitación
    public function capacitacion()
    {
        return $this->belongsTo(Capacitaciones::class, 'id_capacitacion', 'id_capacitacion');
    }
}