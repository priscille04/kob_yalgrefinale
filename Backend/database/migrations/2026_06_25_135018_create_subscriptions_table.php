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
    Schema::create('subscriptions', function (Blueprint $table) {
        $table->id();

        $table->string('nom');
        $table->string('numero');

        $table->string('code_abonnement')->unique();

        $table->enum('type', ['jour', 'semaine', 'mois']);

        $table->integer('montant');

        $table->enum('status', [
            'pending',
            'active',
            'expired'
        ])->default('pending');

        $table->timestamp('date_debut')->nullable();
        $table->timestamp('date_fin')->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};