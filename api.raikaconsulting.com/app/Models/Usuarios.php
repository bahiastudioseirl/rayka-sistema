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
        'correo',
        'contrasenia',
        'activo',
        'id_rol'
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'contrasenia',
    ];

    /**
     * Get the attributes that should be cast.
     */
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

    /**
     * Get the username attribute name for authentication.
     */
    public function getAuthIdentifierName()
    {
        return 'correo';
    }

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

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     */
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
