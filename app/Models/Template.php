<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Template extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'json_config',
        'thumbnail',
        'preview_video',
        'is_premium',
        'is_active',
        'keywords',
        'resolution',
        'duration',
        'downloads_count',
        'views_count',
        'rating',
        'ratings_count',
    ];

    protected $casts = [
        'json_config' => 'array',
        'keywords' => 'array',
        'is_premium' => 'boolean',
        'is_active' => 'boolean',
        'rating' => 'decimal:2',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function templateAssets(): HasMany
    {
        return $this->hasMany(TemplateAsset::class);
    }

    public function assets()
    {
        return $this->belongsToMany(Asset::class, 'template_assets')
                    ->withPivot('layer_name', 'layer_config', 'sort_order')
                    ->orderBy('pivot_sort_order');
    }
}
