<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('solicitantes', function (Blueprint $table) {
            $table->id('id_solicitante');
            $table->string('nombre');
            $table->string('apellido');
            $table->string('cargo')->nullable();
            $table->string('correo')->nullable();
            $table->string('telefono')->nullable();
            $table->unsignedBigInteger('id_empresa');
            
            $table->foreign('id_empresa')->references('id_empresa')->on('empresas');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('solicitantes');
    }
};