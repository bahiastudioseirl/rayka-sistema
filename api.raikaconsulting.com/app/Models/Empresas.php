<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empresas extends Model
{
    use HasFactory;

    protected $table = 'empresas';
    protected $primaryKey = 'id_empresa';
    public $timestamps = false;
    
    protected $fillable = [
        'nombre',
        'creado_por',
        'fecha_creacion'
    ];

    protected $casts = [
        'fecha_creacion' => 'datetime',
    ];

    // Una empresa pertenece a un creador (usuario administrador)
    public function creador()
    {
        return $this->belongsTo(Usuarios::class, 'creado_por', 'id_usuario');
    }

    // Una empresa tiene muchos solicitantes
    public function solicitantes()
    {
        return $this->hasMany(Solicitantes::class, 'id_empresa', 'id_empresa');
    }
}