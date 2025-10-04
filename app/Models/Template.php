<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Template extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'json_layout',
        'thumbnail_url',
        'category',
        'tags',
        'created_by',
        'version',
        'status',
        'is_default',
    ];

    protected $casts = [
        'json_layout' => 'array',
        'tags'        => 'array',
        'version'     => 'integer',
        'is_default'  => 'boolean',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($template) {
            if (empty($template->slug)) {
                $template->slug = Str::slug($template->name);
            }
            if (empty($template->created_by)) {
                $template->created_by = auth()->guard('admin')->id();
            }
        });

        static::updating(function ($template) {
            if ($template->isDirty('name') && empty($template->slug)) {
                $template->slug = Str::slug($template->name);
            }
        });
    }

    /**
     * Get the admin who created this template.
     */
    public function admin()
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    /**
     * Scope a query to only include published templates.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    /**
     * Scope a query to only include draft templates.
     */
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    /**
     * Scope a query to only include archived templates.
     */
    public function scopeArchived($query)
    {
        return $query->where('status', 'archived');
    }

    /**
     * Scope a query to only include default templates.
     */
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    /**
     * Scope a query to filter by category.
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope a query to search by tags.
     */
    public function scopeWithTags($query, $tags)
    {
        if (is_array($tags)) {
            foreach ($tags as $tag) {
                $query->whereJsonContains('tags', $tag);
            }
        } else {
            $query->whereJsonContains('tags', $tags);
        }
        return $query;
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'id';
    }

    /**
     * Generate thumbnail URL if not set.
     */
    public function getThumbnailUrlAttribute($value)
    {
        if (! $value && isset($this->json_layout['objects'])) {
            // Generate thumbnail from first object or return default
            return asset('images/template-placeholder.png');
        }
        return $value;
    }
}
