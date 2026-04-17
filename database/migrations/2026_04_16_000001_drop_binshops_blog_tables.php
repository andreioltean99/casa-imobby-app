<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('binshops_blog_post_tags');
        Schema::dropIfExists('binshops_blog_post_categories');
        Schema::dropIfExists('binshops_blog_comments');
        Schema::dropIfExists('binshops_blog_uploaded_photos');
        Schema::dropIfExists('binshops_blog_comment_email_blacklist');
        Schema::dropIfExists('binshops_blog_posts');
        Schema::dropIfExists('binshops_blog_categories');
        Schema::dropIfExists('binshops_blog_tags');
        Schema::dropIfExists('laravel_fulltext');

        Schema::enableForeignKeyConstraints();
    }

    public function down(): void
    {
        //
    }
};
