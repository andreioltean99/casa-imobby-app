<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contact_settings', function (Blueprint $table) {
            $table->string('contact_person_name')->nullable()->after('email');
            $table->string('contact_person_photo_path')->nullable()->after('contact_person_name');
            $table->string('phone', 64)->nullable()->after('contact_person_photo_path');
        });
    }

    public function down(): void
    {
        Schema::table('contact_settings', function (Blueprint $table) {
            $table->dropColumn(['contact_person_name', 'contact_person_photo_path', 'phone']);
        });
    }
};
