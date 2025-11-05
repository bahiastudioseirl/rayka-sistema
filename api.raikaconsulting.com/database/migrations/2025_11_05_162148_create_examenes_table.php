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
        Schema::create('examenes', function (Blueprint $table) {
            $table->id('id_examen');
            $table->string('nombre');
            $table->integer('puntaje_total')->default(20);
            $table->unsignedBigInteger('id_curso');            

            $table->timestamp('fecha_creacion')->useCurrent();

            $table->foreign('id_curso')->references('id_curso')->on('cursos');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('examenes');
    }
};
