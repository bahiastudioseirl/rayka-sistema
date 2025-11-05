<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Roles;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'nombre' => 'Administrador'
            ],
            [
                'nombre' => 'Estudiante'
            ]
        ];

        foreach ($roles as $roles) {
            Roles::create($roles);
        }
    }
}