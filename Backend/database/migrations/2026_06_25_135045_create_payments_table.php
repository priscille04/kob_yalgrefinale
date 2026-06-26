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
    Schema::create('payments', function (Blueprint $table) {

        $table->id();

        $table->foreignId('subscription_id')
            ->constrained()
            ->cascadeOnDelete();

        $table->string('methode');

        $table->string('telephone');

        $table->enum('status', [
            'pending',
            'success',
            'failed'
        ])->default('pending');

        $table->timestamps();
    });
}
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
