<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Progresos extends Model
{
    use HasFactory;

    protected $table = 'progresos';
    protected $primaryKey = 'id_progreso';
    
    // Definir nombre de columna de timestamp personalizada
    const CREATED_AT = 'fecha_completado';
    const UPDATED_AT = null; // No hay columna updated_at en esta tabla
    
    protected $fillable = [
        'id_usuario',
        'id_curso',
        'id_modulo',
        'id_sesion',
        'completado'
    ];

    protected $casts = [
        'completado' => 'boolean'
    ];

    // Un progreso pertenece a un usuario
    public function usuario()
    {
        return $this->belongsTo(Usuarios::class, 'id_usuario', 'id_usuario');
    }

    // Un progreso puede pertenecer a un curso
    public function curso()
    {
        return $this->belongsTo(Cursos::class, 'id_curso', 'id_curso');
    }

    // Un progreso puede pertenecer a un módulo
    public function modulo()
    {
        return $this->belongsTo(Modulos::class, 'id_modulo', 'id_modulo');
    }

    // Un progreso puede pertenecer a una sesión
    public function sesion()
    {
        return $this->belongsTo(Sesion::class, 'id_sesion', 'id_sesion');
    }
}
