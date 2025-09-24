<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
// use Spatie\MediaLibrary\HasMedia;
// use Spatie\MediaLibrary\InteractsWithMedia;
// use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Asset extends Model // implements HasMedia
{
    use HasFactory; // , InteractsWithMedia;

    protected $fillable = [
        'name',
        'original_name',
        'file_path',
        'file_type',
        'mime_type',
        'file_size',
        'metadata',
        'thumbnail',
        'is_public',
    ];

    protected $casts = [
        'metadata' => 'array',
        'is_public' => 'boolean',
    ];

    public function templates(): BelongsToMany
    {
        return $this->belongsToMany(Template::class, 'template_assets')
                    ->withPivot('layer_name', 'layer_config', 'sort_order');
    }

    public function getFileSizeHumanAttribute(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes >= 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return number_format($bytes, 2, '.', '') . ' ' . $units[$i];
    }

    /**
     * Check if asset is an image
     */
    public function isImage(): bool
    {
        return $this->file_type === 'image';
    }

    /**
     * Check if asset is a video
     */
    public function isVideo(): bool
    {
        return $this->file_type === 'video';
    }

    /**
     * Check if asset is audio
     */
    public function isAudio(): bool
    {
        return $this->file_type === 'audio';
    }

    /**
     * Check if asset is Lottie animation
     */
    public function isLottie(): bool
    {
        return $this->file_type === 'lottie';
    }

    /**
     * Generate thumbnail path for videos
     */
    public function getThumbnailPathAttribute(): ?string
    {
        if ($this->file_type === 'video' && $this->thumbnail) {
            return $this->thumbnail;
        }

        if ($this->file_type === 'video') {
            $pathInfo = pathinfo($this->file_path);
            return 'assets/thumbnails/' . $pathInfo['filename'] . '.jpg';
        }

        return null;
    }

    /**
     * Get thumbnail attribute - for test compatibility
     */
    public function getThumbnailAttribute($value): ?string
    {
        if ($this->file_type === 'video' && $value) {
            return $value;
        }

        if ($this->file_type === 'video') {
            $pathInfo = pathinfo($this->file_path);
            return 'assets/thumbnails/' . $pathInfo['filename'] . '.jpg';
        }

        return $value;
    }

    /**
     * Scope for filtering by file type
     */
    public function scopeFileType($query, string $fileType)
    {
        return $query->where('file_type', $fileType);
    }

    /**
     * Scope for filtering public assets
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    /**
     * Scope for filtering private assets
     */
    public function scopePrivate($query)
    {
        return $query->where('is_public', false);
    }

    /**
     * Scope for searching by name
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where('name', 'like', "%{$search}%");
    }

    /**
     * Scope for ordering by creation date
     */
    public function scopeOrderByCreated($query, string $direction = 'desc')
    {
        return $query->orderBy('created_at', $direction);
    }

    /**
     * Scope for ordering by file size
     */
    public function scopeOrderBySize($query, string $direction = 'desc')
    {
        return $query->orderBy('file_size', $direction);
    }

    /**
     * Scope for filtering by MIME type
     */
    public function scopeMimeType($query, string $mimeType)
    {
        return $query->where('mime_type', $mimeType);
    }

    /**
     * Scope for filtering by MIME type pattern
     */
    public function scopeMimeTypeLike($query, string $pattern)
    {
        return $query->where('mime_type', 'like', $pattern);
    }

    // /**
    //  * Register media collections
    //  */
    // public function registerMediaCollections(): void
    // {
    //     $this->addMediaCollection('files')
    //         ->acceptsMimeTypes([
    //             'image/jpeg',
    //             'image/png',
    //             'image/gif',
    //             'image/webp',
    //             'video/mp4',
    //             'video/webm',
    //             'video/quicktime',
    //             'audio/mpeg',
    //             'audio/wav',
    //             'audio/mp4',
    //             'application/json', // For Lottie files
    //         ])
    //         ->singleFile();

    //     $this->addMediaCollection('thumbnails')
    //         ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp'])
    //         ->singleFile();
    // }

    // /**
    //  * Register media conversions
    //  */
    // public function registerMediaConversions(Media $media = null): void
    // {
    //     // Image conversions
    //     $this->addMediaConversion('thumb')
    //         ->width(300)
    //         ->height(300)
    //         ->sharpen(10)
    //         ->performOnCollections('files');

    //     $this->addMediaConversion('small')
    //         ->width(600)
    //         ->height(600)
    //         ->sharpen(10)
    //         ->performOnCollections('files');

    //     $this->addMediaConversion('medium')
    //         ->width(1200)
    //         ->height(1200)
    //         ->sharpen(10)
    //         ->performOnCollections('files');

    //     $this->addMediaConversion('large')
    //         ->width(1920)
    //         ->height(1920)
    //         ->sharpen(10)
    //         ->performOnCollections('files');

    //     // Video thumbnail generation
    //     $this->addMediaConversion('video_thumb')
    //         ->width(400)
    //         ->height(400)
    //         ->extractVideoFrameAtSecond(1)
    //         ->performOnCollections('files');
    // }

    // /**
    //  * Get the main file from media library
    //  */
    // public function getMainFile()
    // {
    //     return $this->getFirstMedia('files');
    // }

    // /**
    //  * Get thumbnail from media library
    //  */
    // public function getThumbnail()
    // {
    //     return $this->getFirstMedia('thumbnails') ?? $this->getFirstMedia('files');
    // }

    // /**
    //  * Get file URL with conversion
    //  */
    // public function getFileUrl(string $conversion = '')
    // {
    //     $media = $this->getMainFile();
        
    //     if (!$media) {
    //         return null;
    //     }

    //     return $conversion ? $media->getUrl($conversion) : $media->getUrl();
    // }

    // /**
    //  * Get thumbnail URL
    //  */
    // public function getThumbnailUrl(string $conversion = 'thumb')
    // {
    //     $media = $this->getThumbnail();
        
    //     if (!$media) {
    //         return null;
    //     }

    //     return $conversion ? $media->getUrl($conversion) : $media->getUrl();
    // }

    // /**
    //  * Upload file to media library
    //  */
    // public function uploadFile($file, string $collection = 'files')
    // {
    //     return $this->addMediaFromRequest($file)
    //         ->toMediaCollection($collection);
    // }

    // /**
    //  * Upload file from path
    //  */
    // public function uploadFileFromPath(string $path, string $collection = 'files')
    // {
    //     return $this->addMedia($path)
    //         ->toMediaCollection($collection);
    // }

    // /**
    //  * Get file size from media library
    //  */
    // public function getFileSizeFromMedia(): int
    // {
    //     $media = $this->getMainFile();
    //     return $media ? $media->size : 0;
    // }

    // /**
    //  * Get MIME type from media library
    //  */
    // public function getMimeTypeFromMedia(): ?string
    // {
    //     $media = $this->getMainFile();
    //     return $media ? $media->mime_type : null;
    // }

    // /**
    //  * Get file name from media library
    //  */
    // public function getFileNameFromMedia(): ?string
    // {
    //     $media = $this->getMainFile();
    //     return $media ? $media->file_name : null;
    // }
}
