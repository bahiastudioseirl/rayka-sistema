<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cursos extends Model
{
    use HasFactory;

    protected $table = 'cursos';
    protected $primaryKey = 'id_curso';
    public $timestamps = false;
    
    protected $fillable = [
        'titulo',
        'contenido',
        'tipo_contenido',
        'activo',
        'creado_por',
        'fecha_creacion'
    ];

    protected $casts = [
        'activo' => 'boolean',
        'fecha_creacion' => 'datetime',
        'tipo_contenido' => 'string'
    ];

    // Un curso pertenece a un creador (usuario administrador)
    public function creador()
    {
        return $this->belongsTo(Usuarios::class, 'creado_por', 'id_usuario');
    }

    // Un curso puede estar en muchas capacitaciones
    public function capacitaciones()
    {
        return $this->belongsToMany(Capacitaciones::class, 'capacitaciones_cursos', 'id_curso', 'id_capacitacion');
    }

    // Un curso tiene muchos progresos
    public function progresos()
    {
        return $this->hasMany(Progresos::class, 'id_curso', 'id_curso');
    }

    // Un curso tiene muchos exámenes
    public function examenes()
    {
        return $this->hasMany(Examenes::class, 'id_curso', 'id_curso');
    }
}
