<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->decimal('price', 12, 2)->nullable()->after('duration');
        });

        Schema::create('portfolio_price_alert_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_item_id')->constrained('portfolio_items')->cascadeOnDelete();
            $table->string('email');
            $table->decimal('reference_price', 12, 2)->nullable();
            $table->timestamps();

            $table->unique(['portfolio_item_id', 'email'], 'portfolio_price_alert_item_email_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_price_alert_subscriptions');

        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->dropColumn('price');
        });
    }
};
