<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Usuarios extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';
    
    // Definir nombres de columnas de timestamp personalizadas
    const CREATED_AT = 'fecha_creacion';
    const UPDATED_AT = 'fecha_actualizacion';
    
    protected $fillable = [
        'nombre',
        'apellido',
        'num_documento', 
        'correo',
        'contrasenia',
        'activo',
        'id_rol'
    ];

    protected $hidden = [
        'contrasenia',
    ];

    protected function casts(): array
    {
        return [
            'contrasenia' => 'hashed',
            'activo' => 'boolean',
        ];
    }

    /**
     * Get the password attribute name for authentication.
     */
    public function getAuthPassword()
    {
        return $this->contrasenia;
    }

    public function getAuthIdentifierName()
    {
        return 'correo';
    }

    // Un usuario pertenece a un rol
    public function rol()
    {
        return $this->belongsTo(Roles::class, 'id_rol', 'id_rol');
    }

    // Un usuario puede estar en muchas capacitaciones
    public function capacitaciones()
    {
        return $this->belongsToMany(Capacitaciones::class, 'usuarios_capacitaciones', 'id_usuario', 'id_capacitacion');
    }

    // Un usuario tiene muchos progresos
    public function progresos()
    {
        return $this->hasMany(Progresos::class, 'id_usuario', 'id_usuario');
    }

    // Un administrador puede crear muchas empresas
    public function empresasCreadas()
    {
        return $this->hasMany(Empresas::class, 'creado_por', 'id_usuario');
    }

    // Un administrador puede crear muchos cursos
    public function cursosCreados()
    {
        return $this->hasMany(Cursos::class, 'creado_por', 'id_usuario');
    }


    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'nombre' => $this->nombre,
            'apellido' => $this->apellido,
            'correo' => $this->correo,
            'id_rol' => $this->id_rol,
        ];
    }
}
