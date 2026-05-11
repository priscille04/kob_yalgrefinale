<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('boutiques', function (Blueprint $table) {
            if (!Schema::hasColumn('boutiques', 'ville')) {
                $table->string('ville')->nullable()->after('code_unique');
            }
        });
    }

    public function down(): void
    {
        Schema::table('boutiques', function (Blueprint $table) {
            if (Schema::hasColumn('boutiques', 'ville')) {
                $table->dropColumn('ville');
            }
        });
    }
};

