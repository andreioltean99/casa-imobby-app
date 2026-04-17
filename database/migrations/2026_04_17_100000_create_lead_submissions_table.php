<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('lead_submissions')) {
            return;
        }

        Schema::create('lead_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('phone', 80);
            $table->string('email');
            $table->string('budget', 120)->nullable();
            $table->boolean('newsletter')->default(false);
            $table->boolean('terms_accepted');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lead_submissions');
    }
};
