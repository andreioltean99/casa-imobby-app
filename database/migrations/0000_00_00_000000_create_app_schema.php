<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->text('two_factor_secret')->nullable();
            $table->text('two_factor_recovery_codes')->nullable();
            $table->timestamp('two_factor_confirmed_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        Schema::create('cache', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->mediumText('value');
            $table->integer('expiration')->index();
        });

        Schema::create('cache_locks', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->string('owner');
            $table->integer('expiration')->index();
        });

        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('queue')->index();
            $table->longText('payload');
            $table->unsignedTinyInteger('attempts');
            $table->unsignedInteger('reserved_at')->nullable();
            $table->unsignedInteger('available_at');
            $table->unsignedInteger('created_at');
        });

        Schema::create('job_batches', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->integer('total_jobs');
            $table->integer('pending_jobs');
            $table->integer('failed_jobs');
            $table->longText('failed_job_ids');
            $table->mediumText('options')->nullable();
            $table->integer('cancelled_at')->nullable();
            $table->integer('created_at');
            $table->integer('finished_at')->nullable();
        });

        Schema::create('failed_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique();
            $table->text('connection');
            $table->text('queue');
            $table->longText('payload');
            $table->longText('exception');
            $table->timestamp('failed_at')->useCurrent();
        });

        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug');
            $table->string('locale', 10)->default('ro');
            $table->string('excerpt')->nullable();
            $table->longText('body')->nullable();
            $table->string('image_path')->nullable();
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('sort_order')->nullable();
            $table->timestamps();

            $table->unique(['slug', 'locale'], 'services_slug_locale_unique');
        });

        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role')->nullable();
            $table->text('quote');
            $table->string('image_path')->nullable();
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('sort_order')->nullable();
            $table->timestamps();
        });

        Schema::create('about', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 10)->default('ro');
            $table->string('title');
            $table->text('body');
            $table->string('principles_heading')->nullable();
            $table->timestamps();
            $table->unique('locale');
        });

        Schema::create('about_items', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 10)->default('ro');
            $table->string('label');
            $table->string('text', 500);
            $table->unsignedInteger('sort_order')->nullable();
            $table->timestamps();
        });

        Schema::create('principles', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 10)->default('ro');
            $table->text('text');
            $table->unsignedInteger('sort_order')->nullable();
            $table->timestamps();
        });

        Schema::create('portfolio_items', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug');
            $table->string('locale', 10)->default('ro');
            $table->text('short_description')->nullable();
            $table->text('description')->nullable();
            $table->string('image_path')->nullable();
            $table->string('date')->nullable();
            $table->string('duration')->nullable();
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('sort_order')->nullable();
            $table->timestamps();

            $table->unique(['slug', 'locale'], 'portfolio_items_slug_locale_unique');
        });

        Schema::create('portfolio_item_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_item_id')->constrained('portfolio_items')->cascadeOnDelete();
            $table->string('image_path');
            $table->unsignedInteger('sort_order')->nullable();
            $table->timestamps();
        });

        Schema::create('legal_pages', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('locale', 10)->default('en');
            $table->string('title');
            $table->text('body');
            $table->timestamps();

            $table->unique(['type', 'locale'], 'legal_pages_type_locale_unique');
        });

        Schema::create('contact_settings', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 10)->default('en')->unique();
            $table->string('section_title')->default('Get in touch today');
            $table->longText('section_body')->nullable();
            $table->string('contact_details_title')->default('Contact details');
            $table->text('address')->nullable();
            $table->string('email')->nullable();
            $table->string('map_placeholder')->default('Embedded map / site photo placeholder');
            $table->timestamps();
        });

        Schema::create('landing_hero_settings', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 10)->default('en')->unique();
            $table->string('eyebrow')->nullable();
            $table->string('title')->nullable();
            $table->longText('body')->nullable();
            $table->string('primary_cta')->nullable();
            $table->string('secondary_cta')->nullable();
            $table->string('end_to_end_heading')->nullable();
            $table->string('years_experience')->nullable();
            $table->unsignedInteger('years_experience_value')->default(25);
            $table->string('completed_projects')->nullable();
            $table->unsignedInteger('completed_projects_value')->default(200);
            $table->string('industries_served')->nullable();
            $table->string('industries_list')->nullable();
            $table->string('step1_title')->nullable();
            $table->longText('step1_body')->nullable();
            $table->string('step2_title')->nullable();
            $table->longText('step2_body')->nullable();
            $table->string('step3_title')->nullable();
            $table->longText('step3_body')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('landing_hero_settings');
        Schema::dropIfExists('contact_settings');
        Schema::dropIfExists('legal_pages');
        Schema::dropIfExists('portfolio_item_images');
        Schema::dropIfExists('portfolio_items');
        Schema::dropIfExists('principles');
        Schema::dropIfExists('about_items');
        Schema::dropIfExists('about');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('services');
        Schema::dropIfExists('failed_jobs');
        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('cache_locks');
        Schema::dropIfExists('cache');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
