<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cursos extends Model
{
    use HasFactory;

    protected $table = 'cursos';
    protected $primaryKey = 'id_curso';
    
    protected $fillable = [
        'nombre',
        'descripcion',
        'activo'
    ];

    // Un curso tiene muchos módulos
    public function modulos()
    {
        return $this->hasMany(Modulos::class, 'id_curso', 'id_curso');
    }

    // Un curso puede tener muchos usuarios inscritos (relación muchos a muchos)
    public function usuarios()
    {
        return $this->belongsToMany(Usuarios::class, 'usuariosxcursos', 'id_curso', 'id_usuario')
                    ->withTimestamps();
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
