<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TemplateAsset extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'type',
        'file_path',
        'file_size',
        'mime_type',
        'metadata',
        'category',
        'tags',
        'uploaded_by',
        'is_public',
        'usage_count',
    ];

    protected $casts = [
        'metadata'    => 'array',
        'tags'        => 'array',
        'is_public'   => 'boolean',
        'usage_count' => 'integer',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($asset) {
            if (empty($asset->slug)) {
                $asset->slug = Str::slug($asset->name);
            }
            if (empty($asset->uploaded_by)) {
                $asset->uploaded_by = auth()->guard('admin')->id();
            }
        });

        static::updating(function ($asset) {
            if ($asset->isDirty('name') && empty($asset->slug)) {
                $asset->slug = Str::slug($asset->name);
            }
        });
    }

    /**
     * Get the admin who uploaded this asset.
     */
    public function admin()
    {
        return $this->belongsTo(Admin::class, 'uploaded_by');
    }

    /**
     * Scope a query to only include public assets.
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    /**
     * Scope a query to filter by type.
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
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
     * Get the file URL.
     */
    public function getUrlAttribute()
    {
        return asset('storage/' . $this->file_path);
    }

    /**
     * Get the file size in human readable format.
     */
    public function getFormattedSizeAttribute()
    {
        if (! $this->file_size) {
            return 'Unknown';
        }

        $bytes = (int) $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Increment usage count.
     */
    public function incrementUsage()
    {
        $this->increment('usage_count');
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'id';
    }
}
