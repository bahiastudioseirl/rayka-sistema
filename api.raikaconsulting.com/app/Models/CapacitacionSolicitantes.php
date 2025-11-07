<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CapacitacionSolicitantes extends Model
{
    use HasFactory;

    protected $table = 'capacitacion_solicitantes';
    protected $primaryKey = 'id_capacitacion_solicitante';
    public $timestamps = false;
    
    protected $fillable = [
        'fecha_inicio',
        'fecha_fin',
        'observaciones',
        'id_solicitante',
        'id_capacitacion'
    ];

    protected $casts = [
        'fecha_inicio' => 'datetime',
        'fecha_fin' => 'datetime',
    ];

    // Pertenece a un solicitante
    public function solicitante()
    {
        return $this->belongsTo(Solicitantes::class, 'id_solicitante', 'id_solicitante');
    }

    // Pertenece a una capacitación
    public function capacitacion()
    {
        return $this->belongsTo(Capacitaciones::class, 'id_capacitacion', 'id_capacitacion');
    }
}