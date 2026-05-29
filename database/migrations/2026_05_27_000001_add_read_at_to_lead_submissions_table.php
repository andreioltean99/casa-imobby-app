<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('lead_submissions')) {
            return;
        }

        if (Schema::hasColumn('lead_submissions', 'read_at')) {
            return;
        }

        Schema::table('lead_submissions', function (Blueprint $table) {
            $table->timestamp('read_at')->nullable()->after('terms_accepted');
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('lead_submissions') || ! Schema::hasColumn('lead_submissions', 'read_at')) {
            return;
        }

        Schema::table('lead_submissions', function (Blueprint $table) {
            $table->dropColumn('read_at');
        });
    }
};
