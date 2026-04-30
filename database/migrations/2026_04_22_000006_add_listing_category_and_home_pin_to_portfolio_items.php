<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->string('listing_category', 64)->nullable()->after('locale')->index();
            $table->boolean('pinned_home')->default(false)->after('is_published');
            $table->unsignedInteger('pinned_home_order')->nullable()->after('pinned_home');
        });
    }

    public function down(): void
    {
        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->dropColumn(['listing_category', 'pinned_home', 'pinned_home_order']);
        });
    }
};
