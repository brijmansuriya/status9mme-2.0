<?php

use App\Models\Asset;
use App\Models\Template;
use App\Models\TemplateAsset;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
    Storage::fake('public');
});

describe('Asset Management', function () {
    it('can create a new asset', function () {
        $file = UploadedFile::fake()->image('test-image.jpg', 800, 600);
        
        $assetData = [
            'name' => 'Test Image',
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
        ];

        $response = $this->post('/admin/assets', $assetData);

        $response->assertRedirect();
        $this->assertDatabaseHas('assets', [
            'name' => 'Test Image',
            'file_type' => 'image',
            'mime_type' => 'image/jpeg',
        ]);
    });

    it('can upload and store file', function () {
        $file = UploadedFile::fake()->image('test-image.jpg', 800, 600);
        
        $response = $this->post('/admin/assets', [
            'name' => 'Test Image',
            'file' => $file,
            'file_type' => 'image',
            'is_public' => true,
        ]);

        $response->assertRedirect();
        
        // Verify file was stored
        Storage::disk('public')->assertExists('assets/' . $file->hashName());
        
        // Verify database record
        $this->assertDatabaseHas('assets', [
            'name' => 'Test Image',
            'file_type' => 'image',
            'mime_type' => 'image/jpeg',
        ]);
    });

    it('can update an asset', function () {
        $asset = Asset::factory()->create([
            'name' => 'Original Name',
            'is_public' => true,
        ]);

        $updateData = [
            'name' => 'Updated Name',
            'is_public' => false,
        ];

        $response = $this->put("/admin/assets/{$asset->id}", $updateData);

        $response->assertRedirect();
        $this->assertDatabaseHas('assets', [
            'id' => $asset->id,
            'name' => 'Updated Name',
            'is_public' => false,
        ]);
    });

    it('can delete an asset', function () {
        $asset = Asset::factory()->create();

        $response = $this->delete("/admin/assets/{$asset->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('assets', [
            'id' => $asset->id,
        ]);
    });

    it('can list assets with filtering', function () {
        Asset::factory()->create(['file_type' => 'image']);
        Asset::factory()->create(['file_type' => 'video']);
        Asset::factory()->create(['file_type' => 'audio']);

        $response = $this->get('/admin/assets?file_type=image');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Assets')
                ->has('assets')
        );
    });

    it('validates required fields when creating asset', function () {
        $response = $this->post('/admin/assets', []);

        $response->assertSessionHasErrors(['name', 'file_type']);
    });

    it('validates file type constraints', function () {
        $response = $this->post('/admin/assets', [
            'name' => 'Test Asset',
            'file_type' => 'invalid_type',
        ]);

        $response->assertSessionHasErrors(['file_type']);
    });
});

describe('Asset File Handling', function () {
    it('can handle image files', function () {
        $file = UploadedFile::fake()->image('test.jpg', 800, 600);
        
        $response = $this->post('/admin/assets', [
            'name' => 'Test Image',
            'file' => $file,
            'file_type' => 'image',
        ]);

        $response->assertRedirect();
        
        $asset = Asset::where('name', 'Test Image')->first();
        expect($asset->mime_type)->toBe('image/jpeg');
        expect($asset->metadata['width'])->toBe(800);
        expect($asset->metadata['height'])->toBe(600);
    });

    it('can handle video files', function () {
        $file = UploadedFile::fake()->create('test.mp4', 5000, 'video/mp4');
        
        $response = $this->post('/admin/assets', [
            'name' => 'Test Video',
            'file' => $file,
            'file_type' => 'video',
        ]);

        $response->assertRedirect();
        
        $asset = Asset::where('name', 'Test Video')->first();
        expect($asset->mime_type)->toBe('video/mp4');
        expect($asset->file_type)->toBe('video');
    });

    it('can handle audio files', function () {
        $file = UploadedFile::fake()->create('test.mp3', 2000, 'audio/mpeg');
        
        $response = $this->post('/admin/assets', [
            'name' => 'Test Audio',
            'file' => $file,
            'file_type' => 'audio',
        ]);

        $response->assertRedirect();
        
        $asset = Asset::where('name', 'Test Audio')->first();
        expect($asset->mime_type)->toBe('audio/mpeg');
        expect($asset->file_type)->toBe('audio');
    });

    it('can handle Lottie animation files', function () {
        $file = UploadedFile::fake()->create('test.json', 1000, 'application/json');
        
        $response = $this->post('/admin/assets', [
            'name' => 'Test Lottie',
            'file' => $file,
            'file_type' => 'lottie',
        ]);

        $response->assertRedirect();
        
        $asset = Asset::where('name', 'Test Lottie')->first();
        expect($asset->file_type)->toBe('lottie');
    });
});

describe('Asset Relationships', function () {
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
});

describe('Asset Metadata and Processing', function () {
    it('can store image metadata', function () {
        $asset = Asset::factory()->create([
            'file_type' => 'image',
            'metadata' => [
                'width' => 1920,
                'height' => 1080,
                'format' => 'jpeg',
                'quality' => 90,
            ],
        ]);

        expect($asset->metadata['width'])->toBe(1920);
        expect($asset->metadata['height'])->toBe(1080);
        expect($asset->metadata['format'])->toBe('jpeg');
    });

    it('can store video metadata', function () {
        $asset = Asset::factory()->create([
            'file_type' => 'video',
            'metadata' => [
                'width' => 1920,
                'height' => 1080,
                'duration' => 15.5,
                'fps' => 30,
                'codec' => 'h264',
            ],
        ]);

        expect($asset->metadata['duration'])->toBe(15.5);
        expect($asset->metadata['fps'])->toBe(30);
    });

    it('can store audio metadata', function () {
        $asset = Asset::factory()->create([
            'file_type' => 'audio',
            'metadata' => [
                'duration' => 30.0,
                'bitrate' => 320,
                'sample_rate' => 44100,
                'channels' => 2,
            ],
        ]);

        expect($asset->metadata['duration'])->toBe(30.0);
        expect($asset->metadata['bitrate'])->toBe(320);
    });

    it('can generate human readable file size', function () {
        $asset = Asset::factory()->create(['file_size' => 1024 * 1024]); // 1MB

        expect($asset->file_size_human)->toBe('1.00 MB');
    });

    it('can generate thumbnail for images', function () {
        $file = UploadedFile::fake()->image('test.jpg', 800, 600);
        
        $response = $this->post('/admin/assets', [
            'name' => 'Test Image',
            'file' => $file,
            'file_type' => 'image',
        ]);

        $response->assertRedirect();
        
        $asset = Asset::where('name', 'Test Image')->first();
        expect($asset->thumbnail)->not->toBeNull();
    });
});

describe('Asset Scopes and Filters', function () {
    it('can filter by file type', function () {
        Asset::factory()->create(['file_type' => 'image']);
        Asset::factory()->create(['file_type' => 'video']);
        Asset::factory()->create(['file_type' => 'audio']);

        $imageAssets = Asset::where('file_type', 'image')->get();
        expect($imageAssets)->toHaveCount(1);

        $videoAssets = Asset::where('file_type', 'video')->get();
        expect($videoAssets)->toHaveCount(1);
    });

    it('can filter public assets', function () {
        Asset::factory()->create(['is_public' => true]);
        Asset::factory()->create(['is_public' => false]);

        $publicAssets = Asset::where('is_public', true)->get();
        expect($publicAssets)->toHaveCount(1);
    });

    it('can search assets by name', function () {
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
});