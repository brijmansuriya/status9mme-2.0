<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

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

    public function assets(): BelongsToMany
    {
        return $this->belongsToMany(Asset::class, 'template_assets')
                    ->withPivot('layer_name', 'layer_config', 'sort_order')
                    ->orderBy('pivot_sort_order');
    }

    /**
     * Boot method to auto-generate slug
     */
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($template) {
            if (empty($template->slug)) {
                $template->slug = Str::slug($template->name);
            }
        });
    }

    /**
     * Scope for active templates
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for premium templates
     */
    public function scopePremium($query)
    {
        return $query->where('is_premium', true);
    }

    /**
     * Scope for free templates
     */
    public function scopeFree($query)
    {
        return $query->where('is_premium', false);
    }

    /**
     * Scope for searching by name
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where('name', 'like', "%{$search}%");
    }

    /**
     * Scope for filtering by category
     */
    public function scopeCategory($query, int $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    /**
     * Scope for ordering by downloads
     */
    public function scopeOrderByDownloads($query, string $direction = 'desc')
    {
        return $query->orderBy('downloads_count', $direction);
    }

    /**
     * Scope for ordering by views
     */
    public function scopeOrderByViews($query, string $direction = 'desc')
    {
        return $query->orderBy('views_count', $direction);
    }

    /**
     * Scope for ordering by rating
     */
    public function scopeOrderByRating($query, string $direction = 'desc')
    {
        return $query->orderBy('rating', $direction);
    }

    /**
     * Scope for ordering by creation date
     */
    public function scopeOrderByCreated($query, string $direction = 'desc')
    {
        return $query->orderBy('created_at', $direction);
    }

    /**
     * Increment download count
     */
    public function incrementDownloads(): void
    {
        $this->increment('downloads_count');
    }

    /**
     * Increment view count
     */
    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    /**
     * Update rating
     */
    public function updateRating(float $newRating): void
    {
        $totalRatings = $this->ratings_count + 1;
        $newAverage = (($this->rating * $this->ratings_count) + $newRating) / $totalRatings;

        $this->update([
            'rating' => round($newAverage, 2),
            'ratings_count' => $totalRatings,
        ]);
    }
}
