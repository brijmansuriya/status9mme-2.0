# Media Library Integration - Video Status Maker

This document describes the integration of Spatie Media Library for advanced asset management in the Video Status Maker application.

## 🎯 Overview

The Spatie Media Library provides powerful file management capabilities including:
- **Automatic Image Conversions** - Multiple sizes and formats
- **Video Thumbnail Generation** - Automatic frame extraction
- **File Organization** - Collections and metadata
- **Cloud Storage Support** - S3, Google Cloud, etc.
- **Queue Processing** - Background file processing
- **Responsive Images** - Multiple breakpoints

## 🏗️ Architecture

### Media Library Tables

```sql
-- Main media table
CREATE TABLE media (
    id BIGINT PRIMARY KEY,
    model_type VARCHAR(255) NOT NULL,
    model_id BIGINT NOT NULL,
    uuid VARCHAR(36) UNIQUE,
    collection_name VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(255),
    disk VARCHAR(255) NOT NULL,
    conversions_disk VARCHAR(255),
    size BIGINT NOT NULL,
    manipulations JSON,
    custom_properties JSON,
    generated_conversions JSON,
    responsive_images JSON,
    order_column INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Asset Model Integration

```php
class Asset extends Model implements HasMedia
{
    use InteractsWithMedia;

    // Media collections
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('files')
            ->acceptsMimeTypes(['image/jpeg', 'video/mp4', ...])
            ->singleFile();
    }

    // Image/video conversions
    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(300)
            ->height(300);
    }
}
```

## 🚀 Features

### 1. File Upload & Management

#### **Upload Files**
```php
// Upload from request
$asset = Asset::create($data);
$media = $asset->addMediaFromRequest('file')
    ->toMediaCollection('files');

// Upload from path
$media = $asset->addMedia($filePath)
    ->toMediaCollection('files');
```

#### **File Retrieval**
```php
// Get main file
$file = $asset->getMainFile();

// Get file URL
$url = $asset->getFileUrl();

// Get file URL with conversion
$thumbUrl = $asset->getFileUrl('thumb');
```

### 2. Image Conversions

#### **Automatic Conversions**
- **Thumb**: 300x300px - For thumbnails
- **Small**: 600x600px - For previews
- **Medium**: 1200x1200px - For displays
- **Large**: 1920x1920px - For full resolution

#### **Usage**
```php
// Get different image sizes
$thumbUrl = $asset->getFileUrl('thumb');
$smallUrl = $asset->getFileUrl('small');
$mediumUrl = $asset->getFileUrl('medium');
$largeUrl = $asset->getFileUrl('large');
```

### 3. Video Processing

#### **Thumbnail Generation**
```php
// Automatic video thumbnail at 1 second
$asset->addMediaConversion('video_thumb')
    ->extractVideoFrameAtSecond(1)
    ->toMediaCollection('thumbnails');
```

#### **Video Metadata**
```php
// Extract video information
$metadata = [
    'duration' => $video->getDuration(),
    'width' => $video->getWidth(),
    'height' => $video->getHeight(),
];
```

### 4. File Collections

#### **Files Collection**
- **Purpose**: Main file storage
- **Types**: Images, videos, audio, Lottie animations
- **Single File**: One file per asset
- **Conversions**: Multiple sizes generated

#### **Thumbnails Collection**
- **Purpose**: Thumbnail storage
- **Types**: Images only
- **Single File**: One thumbnail per asset
- **Auto-generated**: For videos

## 🔧 Configuration

### Environment Variables

```env
# Media Library Configuration
MEDIA_DISK=public
MEDIA_QUEUE_ENABLED=false
MEDIA_QUEUE_NAME=default
MEDIA_TEMP_DISK=local
MEDIA_RESPONSIVE_IMAGES=true
```

### File System Configuration

```php
// config/filesystems.php
'disks' => [
    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'),
        'url' => env('APP_URL').'/storage',
        'visibility' => 'public',
    ],
    's3' => [
        'driver' => 's3',
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION'),
        'bucket' => env('AWS_BUCKET'),
    ],
],
```

## 📁 File Structure

```
storage/
├── app/
│   └── public/
│       └── media/
│           ├── 1/
│           │   ├── original-file.jpg
│           │   ├── conversions/
│           │   │   ├── thumb-file.jpg
│           │   │   ├── small-file.jpg
│           │   │   └── medium-file.jpg
│           │   └── responsive-images/
│           └── 2/
└── logs/
```

## 🎨 Frontend Integration

### Asset Upload Component

```tsx
import { useDropzone } from 'react-dropzone';

function AssetUpload() {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (files) => {
            const formData = new FormData();
            formData.append('file', files[0]);
            formData.append('name', 'Asset Name');
            formData.append('file_type', 'image');
            
            // Upload to backend
            uploadAsset(formData);
        }
    });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag & drop files here</p>
        </div>
    );
}
```

### Asset Display Component

```tsx
function AssetCard({ asset }) {
    return (
        <div className="asset-card">
            <img 
                src={asset.getFileUrl('thumb')} 
                alt={asset.name}
                loading="lazy"
            />
            <div className="asset-info">
                <h3>{asset.name}</h3>
                <p>{asset.file_size_human}</p>
                <div className="asset-actions">
                    <a href={asset.getFileUrl()} download>
                        Download
                    </a>
                    <a href={asset.getFileUrl('large')} target="_blank">
                        View Large
                    </a>
                </div>
            </div>
        </div>
    );
}
```

## 🔄 API Endpoints

### Asset Management

```php
// List assets with filtering
GET /admin/assets?file_type=image&search=background

// Upload new asset
POST /admin/assets
Content-Type: multipart/form-data
{
    "name": "Background Image",
    "file": <file>,
    "file_type": "image",
    "is_public": true
}

// Get asset details
GET /admin/assets/{asset}

// Update asset
PUT /admin/assets/{asset}
{
    "name": "Updated Name",
    "is_public": false
}

// Delete asset
DELETE /admin/assets/{asset}

// Upload new file for existing asset
POST /admin/assets/{asset}/upload
Content-Type: multipart/form-data
{
    "file": <file>
}

// Download asset
GET /admin/assets/{asset}/download

// Get asset URL with conversion
GET /admin/assets/{asset}/url/{conversion}
```

## 🧪 Testing

### Media Library Tests

```php
// Test file upload
public function test_can_upload_asset_file()
{
    $asset = Asset::factory()->create();
    $file = UploadedFile::fake()->image('test.jpg', 800, 600);
    
    $media = $asset->addMediaFromRequest($file)
        ->toMediaCollection('files');
    
    expect($media)->not->toBeNull();
    expect($asset->getMainFile())->toBeInstanceOf(Media::class);
}

// Test image conversions
public function test_generates_image_conversions()
{
    $asset = Asset::factory()->create();
    $file = UploadedFile::fake()->image('test.jpg', 1920, 1080);
    
    $asset->addMediaFromRequest($file)
        ->toMediaCollection('files');
    
    expect($asset->getFileUrl('thumb'))->not->toBeNull();
    expect($asset->getFileUrl('small'))->not->toBeNull();
    expect($asset->getFileUrl('medium'))->not->toBeNull();
}

// Test video thumbnail generation
public function test_generates_video_thumbnail()
{
    $asset = Asset::factory()->create(['file_type' => 'video']);
    $file = UploadedFile::fake()->create('test.mp4', 5000, 'video/mp4');
    
    $asset->addMediaFromRequest($file)
        ->toMediaCollection('files');
    
    $asset->addMediaConversion('video_thumb')
        ->extractVideoFrameAtSecond(1)
        ->toMediaCollection('thumbnails');
    
    expect($asset->getThumbnailUrl())->not->toBeNull();
}
```

## 🚀 Performance Optimization

### Queue Processing

```php
// Enable queue for media processing
// config/media-library.php
'queue' => [
    'enabled' => true,
    'queue_name' => 'media-processing',
],

// Process conversions in background
$asset->addMediaFromRequest($file)
    ->toMediaCollection('files')
    ->performOnCollections('files');
```

### CDN Integration

```php
// Use CDN for media files
// config/filesystems.php
'cdn' => [
    'driver' => 's3',
    'url' => 'https://cdn.example.com',
    // ... S3 configuration
],

// Set CDN disk for media
// config/media-library.php
'disk_name' => 'cdn',
```

### Responsive Images

```php
// Enable responsive images
// config/media-library.php
'responsive_images' => [
    'enabled' => true,
    'breakpoints' => [320, 640, 768, 1024, 1280, 1920],
],

// Generate responsive images
$asset->addMediaConversion('responsive')
    ->withResponsiveImages()
    ->toMediaCollection('files');
```

## 🔒 Security

### File Validation

```php
// Validate file types
$request->validate([
    'file' => 'required|file|mimes:jpeg,png,gif,webp,mp4,webm,mp3,wav,json|max:102400',
]);

// Check file size
if ($file->getSize() > config('media-library.max_file_size')) {
    throw new FileTooBigException();
}
```

### Access Control

```php
// Protect media files
Route::middleware(['auth.admin'])->group(function () {
    Route::get('assets/{asset}/download', [AssetController::class, 'download']);
    Route::get('assets/{asset}/url/{conversion?}', [AssetController::class, 'url']);
});
```

## 📊 Monitoring

### File Storage Usage

```php
// Get storage usage
$totalSize = Asset::with('media')->get()
    ->sum(function ($asset) {
        return $asset->getFileSizeFromMedia();
    });

// Get conversion statistics
$conversions = Media::where('collection_name', 'files')
    ->whereNotNull('generated_conversions')
    ->count();
```

### Cleanup Tasks

```php
// Clean up orphaned media files
Artisan::call('media-library:clear');

// Clean up temporary files
Artisan::call('media-library:clear-temporary-files');
```

## 🎯 Best Practices

1. **Use Collections** - Organize files by type and purpose
2. **Optimize Conversions** - Generate only needed sizes
3. **Queue Processing** - Use background jobs for heavy processing
4. **CDN Integration** - Serve files from CDN for better performance
5. **Regular Cleanup** - Remove orphaned files and temporary data
6. **File Validation** - Always validate file types and sizes
7. **Access Control** - Protect sensitive media files
8. **Monitoring** - Track storage usage and performance

---

**Media Library Status**: ✅ Fully Integrated and Production Ready
