<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
            $table->foreignId('producteur_id')->constrained('producteurs')->cascadeOnDelete();
            $table->foreignId('produit_id')->nullable()->constrained('produits')->nullOnDelete();
            $table->timestamps();

            $table->unique(['client_id', 'producteur_id', 'produit_id']);
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('expediteur_id')->constrained('utilisateurs')->cascadeOnDelete();
            $table->text('contenu');
            $table->boolean('lu')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
        Schema::dropIfExists('conversations');
    }
};
