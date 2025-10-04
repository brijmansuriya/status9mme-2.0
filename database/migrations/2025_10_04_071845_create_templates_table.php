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
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->json('json_layout'); // Polotno exported JSON
            $table->string('thumbnail_url')->nullable(); // Preview image path
            $table->string('category')->default('general'); // Birthday, Wedding, Festival, etc.
            $table->json('tags')->nullable(); // Keywords for search
            $table->unsignedBigInteger('created_by'); // Admin who created
            $table->integer('version')->default(1); // Version number
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->boolean('is_default')->default(false); // System-provided templates
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('cascade');
            
            // Indexes for better performance
            $table->index(['status', 'category']);
            $table->index(['created_by']);
            $table->index(['is_default']);
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
