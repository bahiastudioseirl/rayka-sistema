<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Solicitantes extends Model
{
    use HasFactory;

    protected $table = 'solicitantes';
    protected $primaryKey = 'id_solicitante';
    public $timestamps = false;
    
    protected $fillable = [
        'nombre',
        'apellido',
        'cargo',
        'correo',
        'telefono',
        'id_empresa'
    ];

    // Un solicitante pertenece a una empresa
    public function empresa()
    {
        return $this->belongsTo(Empresas::class, 'id_empresa', 'id_empresa');
    }

    // Un solicitante puede tener muchas capacitaciones
    public function capacitaciones()
    {
        return $this->hasMany(Capacitaciones::class, 'id_solicitante', 'id_solicitante');
    }

    // Un solicitante puede estar en muchas capacitaciones (tabla pivot)
    public function capacitacionesSolicitadas()
    {
        return $this->belongsToMany(Capacitaciones::class, 'capacitacion_solicitantes', 'id_solicitante', 'id_capacitacion')
                    ->withPivot('fecha_inicio', 'fecha_fin', 'observaciones');
    }
}