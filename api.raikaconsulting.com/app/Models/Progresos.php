<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Progresos extends Model
{
    use HasFactory;

    protected $table = 'progresos';
    protected $primaryKey = 'id_progreso';
    public $timestamps = false;
    
    protected $fillable = [
        'completado',
        'nota',
        'intentos_usados',
        'fecha_ultimo_intento',
        'id_usuario',
        'id_curso',
        'fecha_completado'
    ];

    protected $casts = [
        'completado' => 'boolean',
        'nota' => 'float',
        'intentos_usados' => 'integer',
        'fecha_ultimo_intento' => 'datetime',
        'fecha_completado' => 'datetime',
    ];

    // Un progreso pertenece a un usuario
    public function usuario()
    {
        return $this->belongsTo(Usuarios::class, 'id_usuario', 'id_usuario');
    }

    // Un progreso pertenece a un curso
    public function curso()
    {
        return $this->belongsTo(Cursos::class, 'id_curso', 'id_curso');
    }
}
