<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuarios_capacitaciones', function (Blueprint $table) {
            $table->id('id_usuario_capacitacion');
            $table->unsignedBigInteger('id_usuario');
            $table->unsignedBigInteger('id_capacitacion');
            
            $table->foreign('id_usuario')->references('id_usuario')->on('usuarios');
            $table->foreign('id_capacitacion')->references('id_capacitacion')->on('capacitaciones');
            
            $table->unique(['id_usuario', 'id_capacitacion']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuarios_capacitaciones');
    }
};