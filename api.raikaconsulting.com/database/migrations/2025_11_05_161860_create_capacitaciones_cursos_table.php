<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('capacitaciones_cursos', function (Blueprint $table) {
            $table->id('id_capacitacion_curso');
            $table->unsignedBigInteger('id_curso');
            $table->unsignedBigInteger('id_capacitacion');
            
            $table->foreign('id_curso')->references('id_curso')->on('cursos');
            $table->foreign('id_capacitacion')->references('id_capacitacion')->on('capacitaciones');
            
            $table->unique(['id_curso', 'id_capacitacion']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('capacitaciones_cursos');
    }
};