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
        if (! Schema::hasColumn('portfolio_items', 'short_description')) {
            Schema::table('portfolio_items', function (Blueprint $table) {
                $table->text('short_description')->nullable()->after('locale');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('portfolio_items', 'short_description')) {
            Schema::table('portfolio_items', function (Blueprint $table) {
                $table->dropColumn('short_description');
            });
        }
    }
};
