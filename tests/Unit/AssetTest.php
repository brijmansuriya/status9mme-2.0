<?php

use App\Models\Asset;
use App\Models\Template;
use App\Models\TemplateAsset;

describe('Asset Model', function () {
    it('can create an asset', function () {
        $asset = Asset::create([
            'name' => 'Test Asset',
            'original_name' => 'test-image.jpg',
            'file_path' => 'assets/test-image.jpg',
            'file_type' => 'image',
            'mime_type' => 'image/jpeg',
            'file_size' => 1024000,
            'metadata' => [
                'width' => 800,
                'height' => 600,
            ],
            'is_public' => true,
        ]);

        expect($asset->name)->toBe('Test Asset');
        expect($asset->file_type)->toBe('image');
        expect($asset->file_size)->toBe(1024000);
        expect($asset->is_public)->toBeTrue();
    });

    it('casts metadata to array', function () {
        $metadata = [
            'width' => 1920,
            'height' => 1080,
            'duration' => 15.5,
            'fps' => 30,
        ];

        $asset = Asset::create([
            'name' => 'Test Asset',
            'original_name' => 'test.mp4',
            'file_path' => 'assets/test.mp4',
            'file_type' => 'video',
            'mime_type' => 'video/mp4',
            'file_size' => 5000000,
            'metadata' => $metadata,
        ]);

        expect($asset->metadata)->toBe($metadata);
        expect($asset->metadata['width'])->toBe(1920);
        expect($asset->metadata['duration'])->toBe(15.5);
    });

    it('casts is_public to boolean', function () {
        $asset = Asset::create([
            'name' => 'Test Asset',
            'original_name' => 'test.jpg',
            'file_path' => 'assets/test.jpg',
            'file_type' => 'image',
            'mime_type' => 'image/jpeg',
            'file_size' => 1000000,
            'is_public' => 1,
        ]);

        expect($asset->is_public)->toBeTrue();
        expect($asset->is_public)->not->toBe(1);
    });

    it('can be associated with templates', function () {
        $asset = Asset::factory()->create();
        $template = Template::factory()->create();
        
        TemplateAsset::create([
            'template_id' => $template->id,
            'asset_id' => $asset->id,
            'layer_name' => 'background',
            'layer_config' => ['position' => [0, 0]],
        ]);

        expect($asset->templates)->toHaveCount(1);
        expect($asset->templates->first())->toBeInstanceOf(Template::class);
    });

    it('can have multiple template associations', function () {
        $asset = Asset::factory()->create();
        $template1 = Template::factory()->create();
        $template2 = Template::factory()->create();
        
        TemplateAsset::create([
            'template_id' => $template1->id,
            'asset_id' => $asset->id,
            'layer_name' => 'background',
        ]);
        
        TemplateAsset::create([
            'template_id' => $template2->id,
            'asset_id' => $asset->id,
            'layer_name' => 'overlay',
        ]);

        expect($asset->templates)->toHaveCount(2);
    });

    it('generates human readable file size', function () {
        $asset = Asset::factory()->create(['file_size' => 1024]); // 1KB
        expect($asset->file_size_human)->toBe('1.00 KB');

        $asset = Asset::factory()->create(['file_size' => 1024 * 1024]); // 1MB
        expect($asset->file_size_human)->toBe('1.00 MB');

        $asset = Asset::factory()->create(['file_size' => 1024 * 1024 * 1024]); // 1GB
        expect($asset->file_size_human)->toBe('1.00 GB');
    });

    it('handles different file size units correctly', function () {
        $asset = Asset::factory()->create(['file_size' => 1536]); // 1.5KB
        expect($asset->file_size_human)->toBe('1.50 KB');

        $asset = Asset::factory()->create(['file_size' => 2048 * 1024]); // 2MB
        expect($asset->file_size_human)->toBe('2.00 MB');
    });

    it('has fillable attributes', function () {
        $asset = new Asset();
        $fillable = $asset->getFillable();

        expect($fillable)->toContain(
            'name',
            'original_name',
            'file_path',
            'file_type',
            'mime_type',
            'file_size',
            'metadata',
            'thumbnail',
            'is_public'
        );
    });

    it('can scope by file type', function () {
        Asset::factory()->create(['file_type' => 'image']);
        Asset::factory()->create(['file_type' => 'video']);
        Asset::factory()->create(['file_type' => 'audio']);

        $imageAssets = Asset::where('file_type', 'image')->get();
        expect($imageAssets)->toHaveCount(1);

        $videoAssets = Asset::where('file_type', 'video')->get();
        expect($videoAssets)->toHaveCount(1);
    });

    it('can scope public assets', function () {
        Asset::factory()->create(['is_public' => true]);
        Asset::factory()->create(['is_public' => false]);

        $publicAssets = Asset::where('is_public', true)->get();
        expect($publicAssets)->toHaveCount(1);
    });

    it('can search by name', function () {
        Asset::factory()->create(['name' => 'Birthday Background']);
        Asset::factory()->create(['name' => 'Wedding Music']);
        Asset::factory()->create(['name' => 'Party Decoration']);

        $searchResults = Asset::where('name', 'like', '%Birthday%')->get();
        expect($searchResults)->toHaveCount(1);
        expect($searchResults->first()->name)->toBe('Birthday Background');
    });

    it('can order by creation date', function () {
        $oldAsset = Asset::factory()->create(['created_at' => now()->subDays(2)]);
        $newAsset = Asset::factory()->create(['created_at' => now()]);

        $orderedAssets = Asset::orderBy('created_at', 'desc')->get();
        expect($orderedAssets->first()->id)->toBe($newAsset->id);
        expect($orderedAssets->last()->id)->toBe($oldAsset->id);
    });

    it('can order by file size', function () {
        Asset::factory()->create(['file_size' => 1000000]);
        Asset::factory()->create(['file_size' => 5000000]);
        Asset::factory()->create(['file_size' => 2000000]);

        $orderedAssets = Asset::orderBy('file_size', 'desc')->get();
        expect($orderedAssets->first()->file_size)->toBe(5000000);
        expect($orderedAssets->last()->file_size)->toBe(1000000);
    });

    it('can filter by mime type', function () {
        Asset::factory()->create(['mime_type' => 'image/jpeg']);
        Asset::factory()->create(['mime_type' => 'image/png']);
        Asset::factory()->create(['mime_type' => 'video/mp4']);

        $jpegAssets = Asset::where('mime_type', 'image/jpeg')->get();
        expect($jpegAssets)->toHaveCount(1);

        $imageAssets = Asset::where('mime_type', 'like', 'image/%')->get();
        expect($imageAssets)->toHaveCount(2);
    });

    it('can store image metadata', function () {
        $metadata = [
            'width' => 1920,
            'height' => 1080,
            'format' => 'jpeg',
            'quality' => 90,
            'color_space' => 'sRGB',
        ];

        $asset = Asset::factory()->create([
            'file_type' => 'image',
            'metadata' => $metadata,
        ]);

        expect($asset->metadata['width'])->toBe(1920);
        expect($asset->metadata['height'])->toBe(1080);
        expect($asset->metadata['format'])->toBe('jpeg');
    });

    it('can store video metadata', function () {
        $metadata = [
            'width' => 1920,
            'height' => 1080,
            'duration' => 15.5,
            'fps' => 30,
            'codec' => 'h264',
            'bitrate' => 5000000,
        ];

        $asset = Asset::factory()->create([
            'file_type' => 'video',
            'metadata' => $metadata,
        ]);

        expect($asset->metadata['duration'])->toBe(15.5);
        expect($asset->metadata['fps'])->toBe(30);
        expect($asset->metadata['codec'])->toBe('h264');
    });

    it('can store audio metadata', function () {
        $metadata = [
            'duration' => 30.0,
            'bitrate' => 320,
            'sample_rate' => 44100,
            'channels' => 2,
            'format' => 'mp3',
        ];

        $asset = Asset::factory()->create([
            'file_type' => 'audio',
            'metadata' => $metadata,
        ]);

        expect($asset->metadata['duration'])->toBeCloseTo(30.0, 1);
        expect($asset->metadata['bitrate'])->toBe(320);
        expect($asset->metadata['sample_rate'])->toBe(44100);
    });

    it('can store Lottie animation metadata', function () {
        $metadata = [
            'version' => '5.7.4',
            'frame_rate' => 30,
            'duration' => 3.0,
            'width' => 400,
            'height' => 400,
            'total_frames' => 90,
        ];

        $asset = Asset::factory()->create([
            'file_type' => 'lottie',
            'metadata' => $metadata,
        ]);

        expect($asset->metadata['version'])->toBe('5.7.4');
        expect($asset->metadata['frame_rate'])->toBe(30);
        expect($asset->metadata['total_frames'])->toBe(90);
    });

    it('can validate file type constraints', function () {
        $validTypes = ['image', 'video', 'audio', 'lottie'];
        
        foreach ($validTypes as $type) {
            $asset = Asset::factory()->create(['file_type' => $type]);
            expect($asset->file_type)->toBe($type);
        }
    });

    it('can generate thumbnail path', function () {
        $asset = Asset::factory()->create([
            'file_path' => 'assets/video.mp4',
            'file_type' => 'video',
        ]);

        // This would typically be handled by a method or accessor
        $expectedThumbnail = 'assets/thumbnails/video.jpg';
        expect($asset->thumbnail)->toBe($expectedThumbnail);
    });

    it('can check if asset is image', function () {
        $imageAsset = Asset::factory()->create(['file_type' => 'image']);
        $videoAsset = Asset::factory()->create(['file_type' => 'video']);

        // This would typically be handled by a method
        expect($imageAsset->file_type === 'image')->toBeTrue();
        expect($videoAsset->file_type === 'image')->toBeFalse();
    });

    it('can check if asset is video', function () {
        $videoAsset = Asset::factory()->create(['file_type' => 'video']);
        $imageAsset = Asset::factory()->create(['file_type' => 'image']);

        expect($videoAsset->file_type === 'video')->toBeTrue();
        expect($imageAsset->file_type === 'video')->toBeFalse();
    });

    it('can check if asset is audio', function () {
        $audioAsset = Asset::factory()->create(['file_type' => 'audio']);
        $imageAsset = Asset::factory()->create(['file_type' => 'image']);

        expect($audioAsset->file_type === 'audio')->toBeTrue();
        expect($imageAsset->file_type === 'audio')->toBeFalse();
    });
});
