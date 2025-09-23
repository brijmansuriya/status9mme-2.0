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
            $table->foreignId('template_id')->constrained()->onDelete('cascade');
            $table->foreignId('asset_id')->constrained()->onDelete('cascade');
            $table->string('layer_name'); // Name of the layer in the template
            $table->json('layer_config')->nullable(); // Layer-specific configuration
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->unique(['template_id', 'asset_id', 'layer_name']);
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
