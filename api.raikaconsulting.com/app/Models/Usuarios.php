<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usuarios extends Model
{
    use HasFactory;

    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';
    
    // Definir nombres de columnas de timestamp personalizadas
    const CREATED_AT = 'fecha_creacion';
    const UPDATED_AT = 'fecha_actualizacion';
    
    protected $fillable = [
        'nombre',
        'apellido', 
        'correo',
        'contrasenia',
        'activo',
        'id_rol'
    ];

    // Un usuario pertenece a un rol
    public function rol()
    {
        return $this->belongsTo(Roles::class, 'id_rol', 'id_rol');
    }

    // Un usuario puede estar inscrito en muchos cursos (relación muchos a muchos)
    public function cursos()
    {
        return $this->belongsToMany(Cursos::class, 'usuariosxcursos', 'id_usuario', 'id_curso')
                    ->withTimestamps();
    }

    // Un usuario tiene muchos progresos
    public function progresos()
    {
        return $this->hasMany(Progresos::class, 'id_usuario', 'id_usuario');
    }

    // Un usuario tiene muchos resultados de exámenes
    public function resultadosExamenes()
    {
        return $this->hasMany(ResultadosExamenes::class, 'id_usuario', 'id_usuario');
    }
}
