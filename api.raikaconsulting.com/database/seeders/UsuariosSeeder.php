<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuarios;

class UsuariosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $usuarios = [
            [
                'nombre' => 'Admin',
                'apellido' => 'Test',
                'correo' => 'admin@rayka.com',
                'contrasenia' => 'admin@rayka.com',
                'id_rol' => 1
            ],
            [
                'nombre' => 'Daniel',
                'apellido' => 'Carrasco',
                'correo' => 'daniel@bahia.pe',
                'contrasenia' => 'daniel@bahia.pe', 
                'id_rol' => 2,
            ],
        ];

        foreach ($usuarios as $usuario) {
            Usuarios::create($usuario);
        }
    }
}