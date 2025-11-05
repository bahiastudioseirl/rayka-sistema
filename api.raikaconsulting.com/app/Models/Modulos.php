<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Modulos extends Model
{
    use HasFactory;

    protected $table = 'modulos';
    protected $primaryKey = 'id_modulo';
    
    // Definir nombres de columnas de timestamp personalizadas
    const CREATED_AT = 'fecha_creacion';
    const UPDATED_AT = 'fecha_actualizacion';
    
    protected $fillable = [
        'titulo',
        'descripcion',
        'id_curso'
    ];

    // Un módulo pertenece a un curso
    public function curso()
    {
        return $this->belongsTo(Cursos::class, 'id_curso', 'id_curso');
    }

    // Un módulo tiene muchas sesiones
    public function sesiones()
    {
        return $this->hasMany(Sesion::class, 'id_modulo', 'id_modulo');
    }

    // Un módulo tiene muchos progresos
    public function progresos()
    {
        return $this->hasMany(Progresos::class, 'id_modulo', 'id_modulo');
    }
}
