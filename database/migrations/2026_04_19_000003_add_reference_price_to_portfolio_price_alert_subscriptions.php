<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('portfolio_price_alert_subscriptions')) {
            return;
        }

        if (Schema::hasColumn('portfolio_price_alert_subscriptions', 'reference_price')) {
            return;
        }

        Schema::table('portfolio_price_alert_subscriptions', function (Blueprint $table) {
            $table->decimal('reference_price', 12, 2)->nullable()->after('email');
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('portfolio_price_alert_subscriptions')) {
            return;
        }

        if (! Schema::hasColumn('portfolio_price_alert_subscriptions', 'reference_price')) {
            return;
        }

        Schema::table('portfolio_price_alert_subscriptions', function (Blueprint $table) {
            $table->dropColumn('reference_price');
        });
    }
};
