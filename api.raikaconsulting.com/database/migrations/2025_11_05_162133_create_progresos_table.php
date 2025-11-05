<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('progresos', function (Blueprint $table) {
            $table->id('id_progreso');
            $table->unsignedBigInteger('id_usuario');
            $table->unsignedBigInteger('id_curso')->nullable();
            $table->unsignedBigInteger('id_modulo')->nullable();
            $table->unsignedBigInteger('id_sesion')->nullable();
            $table->boolean('completado')->default(false);

            $table->foreign('id_usuario')->references('id_usuario')->on('usuarios');
            $table->foreign('id_curso')->references('id_curso')->on('cursos');
            $table->foreign('id_modulo')->references('id_modulo')->on('modulos');
            $table->foreign('id_sesion')->references('id_sesion')->on('sesion');

            $table->timestamp('fecha_completado')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('progresos');
    }
};
