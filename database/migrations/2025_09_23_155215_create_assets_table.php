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
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('original_name');
            $table->string('file_path');
            $table->string('file_type'); // image, video, audio, lottie
            $table->string('mime_type');
            $table->bigInteger('file_size'); // Size in bytes
            $table->json('metadata')->nullable(); // Width, height, duration, etc.
            $table->string('thumbnail')->nullable(); // Thumbnail for videos/images
            $table->boolean('is_public')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
