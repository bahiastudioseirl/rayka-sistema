<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResultadosExamenes extends Model
{
    use HasFactory;

    protected $table = 'resultados_examenes';
    protected $primaryKey = 'id_resultado_examen';
    
    // Definir nombre de columna de timestamp personalizada
    const CREATED_AT = 'fecha_realizado';
    const UPDATED_AT = null; // No hay columna updated_at en esta tabla
    
    protected $fillable = [
        'id_usuario',
        'id_examen',
        'puntaje_obtenido'
    ];

    // Un resultado pertenece a un usuario
    public function usuario()
    {
        return $this->belongsTo(Usuarios::class, 'id_usuario', 'id_usuario');
    }

    // Un resultado pertenece a un examen
    public function examen()
    {
        return $this->belongsTo(Examenes::class, 'id_examen', 'id_examen');
    }
}
