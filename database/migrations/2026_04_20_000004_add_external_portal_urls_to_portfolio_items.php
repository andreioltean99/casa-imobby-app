<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->string('external_storia_url', 2048)->nullable()->after('external_listing_ref');
            $table->string('external_imobiliare_url', 2048)->nullable()->after('external_storia_url');
        });
    }

    public function down(): void
    {
        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->dropColumn(['external_storia_url', 'external_imobiliare_url']);
        });
    }
};
