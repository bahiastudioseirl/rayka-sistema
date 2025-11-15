<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Capacitaciones extends Model
{
    use HasFactory;

    protected $table = 'capacitaciones';
    protected $primaryKey = 'id_capacitacion';
    public $timestamps = false;
    
    protected $fillable = [
        'duracion_examen_min',
        'max_intentos',
        'link_login_unico',
        'fecha_creacion',
        'fecha_inicio',
        'fecha_fin',
        'estado',
        'id_solicitante'
    ];

    protected $casts = [
        'fecha_creacion' => 'datetime',
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
        'duracion_examen_min' => 'integer',
        'max_intentos' => 'integer',
    ];

    // Una capacitación pertenece a un solicitante
    public function solicitante()
    {
        return $this->belongsTo(Solicitantes::class, 'id_solicitante', 'id_solicitante');
    }

    // Una capacitación puede tener muchos usuarios estudiantes
    public function usuarios()
    {
        return $this->belongsToMany(Usuarios::class, 'usuarios_capacitaciones', 'id_capacitacion', 'id_usuario');
    }

    // Una capacitación puede tener muchos cursos
    public function cursos()
    {
        return $this->belongsToMany(Cursos::class, 'capacitaciones_cursos', 'id_capacitacion', 'id_curso');
    }

    // Una capacitación puede tener muchos solicitantes (tabla pivot)
    public function solicitantes()
    {
        return $this->belongsToMany(Solicitantes::class, 'capacitacion_solicitantes', 'id_capacitacion', 'id_solicitante')
                    ->withPivot('fecha_inicio', 'fecha_fin', 'observaciones');
    }
}