<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('producteurs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('utilisateur_id')->constrained()->onDelete('cascade');

            $table->string('type_culture')->nullable();
            $table->string('localisation')->nullable();

            // id de la boutique associée 
            $table->foreignId('boutique_id')->nullable()->constrained()->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('producteurs');
    }
};