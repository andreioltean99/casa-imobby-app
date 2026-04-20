<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->json('listing_specs')->nullable()->after('description');
            $table->string('external_listing_ref', 120)->nullable()->after('listing_specs');
            $table->string('listing_pdf_path')->nullable()->after('external_listing_ref');
        });
    }

    public function down(): void
    {
        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->dropColumn(['listing_specs', 'external_listing_ref', 'listing_pdf_path']);
        });
    }
};
