<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsuariosCapacitaciones extends Model
{
    use HasFactory;

    protected $table = 'usuarios_capacitaciones';
    protected $primaryKey = 'id_usuario_capacitacion';
    public $timestamps = false;
    
    protected $fillable = [
        'id_usuario',
        'id_capacitacion'
    ];

    // Pertenece a un usuario
    public function usuario()
    {
        return $this->belongsTo(Usuarios::class, 'id_usuario', 'id_usuario');
    }

    // Pertenece a una capacitación
    public function capacitacion()
    {
        return $this->belongsTo(Capacitaciones::class, 'id_capacitacion', 'id_capacitacion');
    }
}