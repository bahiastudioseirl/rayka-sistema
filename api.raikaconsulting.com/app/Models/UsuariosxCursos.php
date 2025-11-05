<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsuariosxCursos extends Model
{
    use HasFactory;

    protected $table = 'usuariosxcursos';
    protected $primaryKey = 'id_usuario_curso';
    
    // Definir nombre de columna de timestamp personalizada
    const CREATED_AT = 'fecha_asignado';
    const UPDATED_AT = null; // No hay columna updated_at en esta tabla
    
    protected $fillable = [
        'id_usuario',
        'id_curso'
    ];

    // Relación con Usuario
    public function usuario()
    {
        return $this->belongsTo(Usuarios::class, 'id_usuario', 'id_usuario');
    }

    // Relación con Curso
    public function curso()
    {
        return $this->belongsTo(Cursos::class, 'id_curso', 'id_curso');
    }
}
