<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_filters', function (Blueprint $table) {
            $table->id();
            $table->string('key', 64)->unique();
            $table->string('name_en');
            $table->string('name_ro');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_searchable')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('portfolio_item_property_filter_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_item_id')->constrained()->cascadeOnDelete();
            $table->foreignId('property_filter_id')->constrained()->cascadeOnDelete();
            $table->string('value', 255);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['portfolio_item_id', 'sort_order'], 'pfv_item_sort_idx');
            $table->index(['property_filter_id', 'value'], 'pfv_filter_value_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_item_property_filter_values');
        Schema::dropIfExists('property_filters');
    }
};
