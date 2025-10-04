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
        Schema::create('template_assets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('type'); // image, audio, sticker, effect
            $table->string('file_path');
            $table->string('file_size')->nullable();
            $table->string('mime_type')->nullable();
            $table->json('metadata')->nullable();           // width, height, duration, etc.
            $table->string('category')->default('general'); // birthday, wedding, etc.
            $table->json('tags')->nullable();
            $table->unsignedBigInteger('uploaded_by'); // Admin who uploaded
            $table->boolean('is_public')->default(true);
            $table->integer('usage_count')->default(0);
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('uploaded_by')->references('id')->on('admins')->onDelete('cascade');

            // Indexes for better performance
            $table->index(['type', 'category']);
            $table->index(['uploaded_by']);
            $table->index(['is_public']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('template_assets');
    }
};
