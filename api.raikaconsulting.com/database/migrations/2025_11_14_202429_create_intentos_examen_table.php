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
        Schema::create('intentos_examen', function (Blueprint $table) {
            $table->id('id_intento_examen');
            $table->unsignedBigInteger('id_progreso');
            $table->integer('num_intento');
            $table->float('nota');
            $table->integer('respuestas_correctas');
            $table->integer('total_preguntas');
            $table->enum('resultado', ['aprobado', 'desaprobado']);
            $table->dateTime('fecha_intento');

            $table->foreign('id_progreso')->references('id_progreso')->on('progresos')->onDelete('cascade');
            
            $table->index(['id_progreso', 'num_intento']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('intentos_examen');
    }
};
