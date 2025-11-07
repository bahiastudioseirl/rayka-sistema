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
                'num_documento' => '00000000',
                'correo' => 'admin@rayka.com',
                'contrasenia' => 'admin@rayka.com',
                'id_rol' => 1
            ]
        ];

        foreach ($usuarios as $usuario) {
            Usuarios::create($usuario);
        }
    }
}