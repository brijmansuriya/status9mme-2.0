<?php

use App\Models\Asset;
use Illuminate\Http\UploadedFile;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

describe('Media Library Integration', function () {
    beforeEach(function () {
        $this->asset = Asset::factory()->create();
    });

    it('can upload file to media library', function () {
        $file = UploadedFile::fake()->image('test.jpg', 800, 600);
        
        $media = $this->asset->addMediaFromRequest($file)
            ->toMediaCollection('files');
        
        expect($media)->not->toBeNull();
        expect($media)->toBeInstanceOf(Media::class);
        expect($this->asset->getMainFile())->toBeInstanceOf(Media::class);
    });

    it('can get file URL from media library', function () {
        $file = UploadedFile::fake()->image('test.jpg', 800, 600);
        
        $this->asset->addMediaFromRequest($file)
            ->toMediaCollection('files');
        
        $url = $this->asset->getFileUrl();
        
        expect($url)->not->toBeNull();
        expect($url)->toBeString();
    });

    it('can get file URL with conversion', function () {
        $file = UploadedFile::fake()->image('test.jpg', 1920, 1080);
        
        $this->asset->addMediaFromRequest($file)
            ->toMediaCollection('files');
        
        $thumbUrl = $this->asset->getFileUrl('thumb');
        $smallUrl = $this->asset->getFileUrl('small');
        
        expect($thumbUrl)->not->toBeNull();
        expect($smallUrl)->not->toBeNull();
        expect($thumbUrl)->not->toBe($smallUrl);
    });

    it('can get file size from media library', function () {
        $file = UploadedFile::fake()->image('test.jpg', 800, 600);
        
        $this->asset->addMediaFromRequest($file)
            ->toMediaCollection('files');
        
        $size = $this->asset->getFileSizeFromMedia();
        
        expect($size)->toBeGreaterThan(0);
        expect($size)->toBeInt();
    });

    it('can get MIME type from media library', function () {
        $file = UploadedFile::fake()->image('test.jpg', 800, 600);
        
        $this->asset->addMediaFromRequest($file)
            ->toMediaCollection('files');
        
        $mimeType = $this->asset->getMimeTypeFromMedia();
        
        expect($mimeType)->toBe('image/jpeg');
    });

    it('can get file name from media library', function () {
        $file = UploadedFile::fake()->image('test.jpg', 800, 600);
        
        $this->asset->addMediaFromRequest($file)
            ->toMediaCollection('files');
        
        $fileName = $this->asset->getFileNameFromMedia();
        
        expect($fileName)->toContain('test.jpg');
    });

    it('can clear media collections', function () {
        $file = UploadedFile::fake()->image('test.jpg', 800, 600);
        
        $this->asset->addMediaFromRequest($file)
            ->toMediaCollection('files');
        
        expect($this->asset->getMainFile())->not->toBeNull();
        
        $this->asset->clearMediaCollection('files');
        
        expect($this->asset->getMainFile())->toBeNull();
    });

    it('can upload file from path', function () {
        $filePath = storage_path('app/test-image.jpg');
        file_put_contents($filePath, 'fake image content');
        
        $media = $this->asset->addMedia($filePath)
            ->toMediaCollection('files');
        
        expect($media)->not->toBeNull();
        expect($this->asset->getMainFile())->toBeInstanceOf(Media::class);
        
        // Cleanup
        unlink($filePath);
    });

    it('can handle multiple media collections', function () {
        $file = UploadedFile::fake()->image('test.jpg', 800, 600);
        
        // Upload to files collection
        $this->asset->addMediaFromRequest($file)
            ->toMediaCollection('files');
        
        // Upload to thumbnails collection
        $this->asset->addMediaFromRequest($file)
            ->toMediaCollection('thumbnails');
        
        expect($this->asset->getMainFile())->not->toBeNull();
        expect($this->asset->getThumbnail())->not->toBeNull();
    });

    it('can get human readable file size', function () {
        $file = UploadedFile::fake()->image('test.jpg', 800, 600);
        
        $this->asset->addMediaFromRequest($file)
            ->toMediaCollection('files');
        
        $humanSize = $this->asset->file_size_human;
        
        expect($humanSize)->toContain('KB');
        expect($humanSize)->toBeString();
    });

    it('can check file type methods', function () {
        $imageAsset = Asset::factory()->create(['file_type' => 'image']);
        $videoAsset = Asset::factory()->create(['file_type' => 'video']);
        $audioAsset = Asset::factory()->create(['file_type' => 'audio']);
        
        expect($imageAsset->isImage())->toBeTrue();
        expect($imageAsset->isVideo())->toBeFalse();
        expect($imageAsset->isAudio())->toBeFalse();
        
        expect($videoAsset->isVideo())->toBeTrue();
        expect($videoAsset->isImage())->toBeFalse();
        expect($videoAsset->isAudio())->toBeFalse();
        
        expect($audioAsset->isAudio())->toBeTrue();
        expect($audioAsset->isImage())->toBeFalse();
        expect($audioAsset->isVideo())->toBeFalse();
    });
});
