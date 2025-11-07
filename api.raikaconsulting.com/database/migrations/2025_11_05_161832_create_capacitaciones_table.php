<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('capacitaciones', function (Blueprint $table) {
            $table->id('id_capacitacion');
            $table->integer('duracion_examen_min');
            $table->integer('max_intentos')->nullable();
            $table->string('link_login_unico')->unique();
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->enum('estado', ['activa', 'inactiva', 'finalizada'])->default('activa');
            $table->unsignedBigInteger('id_solicitante');
            
            $table->foreign('id_solicitante')->references('id_solicitante')->on('solicitantes');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('capacitaciones');
    }
};