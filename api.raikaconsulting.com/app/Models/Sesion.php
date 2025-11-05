<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sesion extends Model
{
    use HasFactory;

    protected $table = 'sesion';
    protected $primaryKey = 'id_sesion';
    
    // Definir nombres de columnas de timestamp personalizadas
    const CREATED_AT = 'fecha_creacion';
    const UPDATED_AT = 'fecha_actualizacion';
    
    protected $fillable = [
        'titulo',
        'descripcion',
        'tipo_contenido',
        'contenido_url',
        'id_modulo'
    ];

    // Una sesión pertenece a un módulo
    public function modulo()
    {
        return $this->belongsTo(Modulos::class, 'id_modulo', 'id_modulo');
    }

    // Una sesión tiene muchos progresos
    public function progresos()
    {
        return $this->hasMany(Progresos::class, 'id_sesion', 'id_sesion');
    }
}
