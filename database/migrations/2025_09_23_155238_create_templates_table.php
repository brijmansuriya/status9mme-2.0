<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->json('json_config'); // Template configuration for DiffusionStudio/core
            $table->string('thumbnail')->nullable(); // Thumbnail image path
            $table->string('preview_video')->nullable(); // Preview video path
            $table->boolean('is_premium')->default(false);
            $table->boolean('is_active')->default(true);
            $table->json('keywords')->nullable(); // Array of keywords for SEO
            $table->string('resolution', 20)->default('1080x1920'); // Video resolution
            $table->integer('duration')->default(15); // Duration in seconds
            $table->integer('downloads_count')->default(0);
            $table->integer('views_count')->default(0);
            $table->decimal('rating', 3, 2)->default(0.00); // Average rating
            $table->integer('ratings_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('templates');
    }
};
