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
        Schema::create('resultados_examenes', function (Blueprint $table) {
            $table->id('id_resultado_examen');
            $table->unsignedBigInteger('id_usuario');
            $table->unsignedBigInteger('id_examen');
            $table->float('puntaje_obtenido');

            $table->timestamp('fecha_realizado')->useCurrent();

            $table->foreign('id_usuario')->references('id_usuario')->on('usuarios');
            $table->foreign('id_examen')->references('id_examen')->on('examenes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resultados_examenes');
    }
};
