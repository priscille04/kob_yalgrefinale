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
        Schema::table('produits', function (Blueprint $table) {
            if (!Schema::hasColumn('produits', 'boutique_id')) {
                $table->foreignId('boutique_id')->nullable()->after('producteur_id')->constrained('boutiques')->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produits', function (Blueprint $table) {
            if (Schema::hasColumn('produits', 'boutique_id')) {
                $table->dropForeignKeyIfExists(['boutique_id']);
                $table->dropColumn('boutique_id');
            }
        });
    }
};
