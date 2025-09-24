<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Category;
use App\Models\Template;
use App\Models\Asset;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

describe('Templates CRUD Operations', function () {
    beforeEach(function () {
        $this->admin = Admin::factory()->create([
            'is_active' => true,
            'role' => 'admin',
        ]);
        
        $this->superAdmin = Admin::factory()->create([
            'is_active' => true,
            'role' => 'super_admin',
        ]);

        Storage::fake('public');
    });

    describe('Template Index/Listing', function () {
        it('displays all templates with category information', function () {
            $category = Category::factory()->create(['name' => 'Test Category']);
            Template::factory()->count(3)->create(['category_id' => $category->id]);

            $response = $this->actingAs($this->admin, 'admin')
                ->get(route('admin.templates.index'));

            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => 
                $page->component('Admin/Templates/Index')
                    ->has('templates.data', 3)
                    ->where('templates.data.0.category.name', 'Test Category')
            );
        });

        it('orders templates by creation date descending', function () {
            $template1 = Template::factory()->create(['created_at' => now()->subDays(1)]);
            $template2 = Template::factory()->create(['created_at' => now()]);

            $response = $this->actingAs($this->admin, 'admin')
                ->get(route('admin.templates.index'));

            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => 
                $page->component('Admin/Templates/Index')
                    ->has('templates.data', 2)
                    ->where('templates.data.0.id', $template2->id) // Most recent first
            );
        });

        it('supports pagination', function () {
            Template::factory()->count(25)->create();

            $response = $this->actingAs($this->admin, 'admin')
                ->get(route('admin.templates.index'));

            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => 
                $page->component('Admin/Templates/Index')
                    ->has('templates.data', 20) // Default per page
                    ->where('templates.last_page', 2)
            );
        });
    });

    describe('Template Creation', function () {
        it('shows create template form with active categories', function () {
            $activeCategory = Category::factory()->create(['is_active' => true]);
            $inactiveCategory = Category::factory()->create(['is_active' => false]);

            $response = $this->actingAs($this->admin, 'admin')
                ->get(route('admin.templates.create'));

            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => 
                $page->component('Admin/Templates/Create')
                    ->has('categories', 1)
                    ->where('categories.0.id', $activeCategory->id)
            );
        });

        it('creates template with valid data', function () {
            $category = Category::factory()->create();
            $thumbnail = UploadedFile::fake()->image('thumbnail.jpg', 800, 600);
            $previewVideo = UploadedFile::fake()->create('preview.mp4', 1024);

            $templateData = [
                'category_id' => $category->id,
                'name' => 'Birthday Template',
                'description' => 'A beautiful birthday template',
                'json_config' => [
                    'duration' => 15,
                    'resolution' => '1080x1920',
                    'layers' => [
                        [
                            'type' => 'text',
                            'content' => 'Happy Birthday!',
                            'position' => [540, 400]
                        ]
                    ]
                ],
                'thumbnail' => $thumbnail,
                'preview_video' => $previewVideo,
                'is_premium' => false,
                'is_active' => true,
                'keywords' => ['birthday', 'celebration', 'party'],
                'resolution' => '1080x1920',
                'duration' => 15,
            ];

            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.templates.store'), $templateData);

            $response->assertRedirect(route('admin.templates.index'));
            $response->assertSessionHas('success', 'Template created successfully.');

            $this->assertDatabaseHas('templates', [
                'name' => 'Birthday Template',
                'slug' => 'birthday-template',
                'description' => 'A beautiful birthday template',
                'category_id' => $category->id,
                'is_premium' => false,
                'is_active' => true,
                'resolution' => '1080x1920',
                'duration' => 15,
            ]);

            // Check file uploads
            Storage::disk('public')->assertExists('templates/thumbnails/' . $thumbnail->hashName());
            Storage::disk('public')->assertExists('templates/videos/' . $previewVideo->hashName());
        });

        it('creates template without optional files', function () {
            $category = Category::factory()->create();

            $templateData = [
                'category_id' => $category->id,
                'name' => 'Simple Template',
                'description' => 'A simple template',
                'json_config' => ['duration' => 10],
                'is_premium' => false,
                'is_active' => true,
                'resolution' => '1080x1920',
                'duration' => 10,
            ];

            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.templates.store'), $templateData);

            $response->assertRedirect(route('admin.templates.index'));
            $response->assertSessionHas('success', 'Template created successfully.');

            $this->assertDatabaseHas('templates', [
                'name' => 'Simple Template',
                'thumbnail' => null,
                'preview_video' => null,
            ]);
        });

        it('validates required fields', function () {
            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.templates.store'), []);

            $response->assertSessionHasErrors([
                'category_id',
                'name',
                'json_config',
                'resolution',
                'duration'
            ]);
        });

        it('validates category exists and is active', function () {
            $inactiveCategory = Category::factory()->create(['is_active' => false]);

            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.templates.store'), [
                    'category_id' => $inactiveCategory->id,
                    'name' => 'Test Template',
                    'json_config' => ['duration' => 10],
                    'resolution' => '1080x1920',
                    'duration' => 10,
                ]);

            $response->assertSessionHasErrors(['category_id']);
        });

        it('validates unique name constraint', function () {
            $category = Category::factory()->create();
            Template::factory()->create(['name' => 'Existing Template']);

            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.templates.store'), [
                    'category_id' => $category->id,
                    'name' => 'Existing Template',
                    'json_config' => ['duration' => 10],
                    'resolution' => '1080x1920',
                    'duration' => 10,
                ]);

            $response->assertSessionHasErrors(['name']);
        });

        it('validates json_config structure', function () {
            $category = Category::factory()->create();

            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.templates.store'), [
                    'category_id' => $category->id,
                    'name' => 'Test Template',
                    'json_config' => 'invalid-json',
                    'resolution' => '1080x1920',
                    'duration' => 10,
                ]);

            $response->assertSessionHasErrors(['json_config']);
        });

        it('validates file uploads', function () {
            $category = Category::factory()->create();
            $invalidFile = UploadedFile::fake()->create('document.pdf', 100);

            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.templates.store'), [
                    'category_id' => $category->id,
                    'name' => 'Test Template',
                    'json_config' => ['duration' => 10],
                    'resolution' => '1080x1920',
                    'duration' => 10,
                    'thumbnail' => $invalidFile,
                ]);

            $response->assertSessionHasErrors(['thumbnail']);
        });

        it('accepts valid image and video files', function () {
            $category = Category::factory()->create();
            $thumbnail = UploadedFile::fake()->image('thumbnail.jpg', 800, 600);
            $previewVideo = UploadedFile::fake()->create('preview.mp4', 1024);

            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.templates.store'), [
                    'category_id' => $category->id,
                    'name' => 'Test Template',
                    'json_config' => ['duration' => 10],
                    'resolution' => '1080x1920',
                    'duration' => 10,
                    'thumbnail' => $thumbnail,
                    'preview_video' => $previewVideo,
                ]);

            $response->assertRedirect(route('admin.templates.index'));
            Storage::disk('public')->assertExists('templates/thumbnails/' . $thumbnail->hashName());
            Storage::disk('public')->assertExists('templates/videos/' . $previewVideo->hashName());
        });

        it('generates slug from name automatically', function () {
            $category = Category::factory()->create();

            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.templates.store'), [
                    'category_id' => $category->id,
                    'name' => 'My Awesome Birthday Template!',
                    'json_config' => ['duration' => 10],
                    'resolution' => '1080x1920',
                    'duration' => 10,
                ]);

            $response->assertRedirect(route('admin.templates.index'));
            $this->assertDatabaseHas('templates', [
                'name' => 'My Awesome Birthday Template!',
                'slug' => 'my-awesome-birthday-template',
            ]);
        });

        it('defaults to appropriate values', function () {
            $category = Category::factory()->create();

            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.templates.store'), [
                    'category_id' => $category->id,
                    'name' => 'Test Template',
                    'json_config' => ['duration' => 10],
                    'resolution' => '1080x1920',
                    'duration' => 10,
                ]);

            $response->assertRedirect(route('admin.templates.index'));
            $this->assertDatabaseHas('templates', [
                'name' => 'Test Template',
                'is_premium' => false,
                'is_active' => true,
                'downloads_count' => 0,
                'views_count' => 0,
                'rating' => 0.00,
                'ratings_count' => 0,
            ]);
        });
    });

    describe('Template Viewing', function () {
        it('shows template details with category and assets', function () {
            $category = Category::factory()->create();
            $template = Template::factory()->create(['category_id' => $category->id]);
            $assets = Asset::factory()->count(3)->create();
            
            // Associate assets with template
            foreach ($assets as $asset) {
                $template->assets()->attach($asset->id, [
                    'layer_name' => 'layer_' . $asset->id,
                    'layer_config' => ['position' => [100, 100]],
                    'sort_order' => $asset->id,
                ]);
            }

            $response = $this->actingAs($this->admin, 'admin')
                ->get(route('admin.templates.show', $template));

            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => 
                $page->component('Admin/Templates/Show')
                    ->has('template')
                    ->where('template.id', $template->id)
                    ->has('template.category')
                    ->where('template.category.id', $category->id)
                    ->has('template.assets', 3)
            );
        });

        it('shows template without assets', function () {
            $template = Template::factory()->create();

            $response = $this->actingAs($this->admin, 'admin')
                ->get(route('admin.templates.show', $template));

            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => 
                $page->component('Admin/Templates/Show')
                    ->where('template.id', $template->id)
                    ->has('template.assets', 0)
            );
        });
    });

    describe('Template Editing', function () {
        it('shows edit template form with current data', function () {
            $category = Category::factory()->create();
            $template = Template::factory()->create([
                'category_id' => $category->id,
                'name' => 'Original Name',
                'description' => 'Original Description',
                'is_premium' => true,
                'is_active' => false,
            ]);

            $response = $this->actingAs($this->admin, 'admin')
                ->get(route('admin.templates.edit', $template));

            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => 
                $page->component('Admin/Templates/Edit')
                    ->has('template')
                    ->where('template.id', $template->id)
                    ->where('template.name', 'Original Name')
                    ->where('template.description', 'Original Description')
                    ->where('template.is_premium', true)
                    ->where('template.is_active', false)
            );
        });

        it('updates template with valid data', function () {
            $category = Category::factory()->create();
            $template = Template::factory()->create(['category_id' => $category->id]);

            $updateData = [
                'category_id' => $category->id,
                'name' => 'Updated Template Name',
                'description' => 'Updated description',
                'json_config' => [
                    'duration' => 20,
                    'resolution' => '1080x1920',
                    'layers' => [
                        [
                            'type' => 'text',
                            'content' => 'Updated Text',
                            'position' => [540, 400]
                        ]
                    ]
                ],
                'is_premium' => true,
                'is_active' => false,
                'keywords' => ['updated', 'keywords'],
                'resolution' => '1080x1920',
                'duration' => 20,
            ];

            $response = $this->actingAs($this->admin, 'admin')
                ->put(route('admin.templates.update', $template), $updateData);

            $response->assertRedirect(route('admin.templates.index'));
            $response->assertSessionHas('success', 'Template updated successfully.');

            $template->refresh();
            expect($template->name)->toBe('Updated Template Name');
            expect($template->description)->toBe('Updated description');
            expect($template->is_premium)->toBeTrue();
            expect($template->is_active)->toBeFalse();
            expect($template->duration)->toBe(20);
        });

        it('updates template with new file uploads', function () {
            $category = Category::factory()->create();
            $template = Template::factory()->create(['category_id' => $category->id]);
            $newThumbnail = UploadedFile::fake()->image('new-thumbnail.jpg', 800, 600);

            $response = $this->actingAs($this->admin, 'admin')
                ->put(route('admin.templates.update', $template), [
                    'category_id' => $category->id,
                    'name' => 'Updated Template',
                    'description' => 'Updated description',
                    'json_config' => ['duration' => 10],
                    'resolution' => '1080x1920',
                    'duration' => 10,
                    'thumbnail' => $newThumbnail,
                ]);

            $response->assertRedirect(route('admin.templates.index'));
            Storage::disk('public')->assertExists('templates/thumbnails/' . $newThumbnail->hashName());
        });

        it('validates name uniqueness when updating', function () {
            $category = Category::factory()->create();
            $template1 = Template::factory()->create(['name' => 'Template One']);
            $template2 = Template::factory()->create(['name' => 'Template Two']);

            $response = $this->actingAs($this->admin, 'admin')
                ->put(route('admin.templates.update', $template2), [
                    'category_id' => $category->id,
                    'name' => 'Template One', // Same as template1
                    'description' => 'Updated description',
                    'json_config' => ['duration' => 10],
                    'resolution' => '1080x1920',
                    'duration' => 10,
                ]);

            $response->assertSessionHasErrors(['name']);
        });

        it('allows keeping same name when updating same template', function () {
            $category = Category::factory()->create();
            $template = Template::factory()->create(['name' => 'Original Name']);

            $response = $this->actingAs($this->admin, 'admin')
                ->put(route('admin.templates.update', $template), [
                    'category_id' => $category->id,
                    'name' => 'Original Name', // Same name
                    'description' => 'Updated description',
                    'json_config' => ['duration' => 10],
                    'resolution' => '1080x1920',
                    'duration' => 10,
                ]);

            $response->assertRedirect(route('admin.templates.index'));
            $response->assertSessionHas('success', 'Template updated successfully.');
        });

        it('updates slug when name changes', function () {
            $category = Category::factory()->create();
            $template = Template::factory()->create(['name' => 'Original Name']);

            $response = $this->actingAs($this->admin, 'admin')
                ->put(route('admin.templates.update', $template), [
                    'category_id' => $category->id,
                    'name' => 'New Template Name',
                    'description' => 'Updated description',
                    'json_config' => ['duration' => 10],
                    'resolution' => '1080x1920',
                    'duration' => 10,
                ]);

            $response->assertRedirect(route('admin.templates.index'));

            $template->refresh();
            expect($template->slug)->toBe('new-template-name');
        });
    });

    describe('Template Deletion', function () {
        it('deletes template successfully', function () {
            $template = Template::factory()->create();

            $response = $this->actingAs($this->admin, 'admin')
                ->delete(route('admin.templates.destroy', $template));

            $response->assertRedirect(route('admin.templates.index'));
            $response->assertSessionHas('success', 'Template deleted successfully.');

            $this->assertDatabaseMissing('templates', ['id' => $template->id]);
        });

        it('deletes associated files when template is deleted', function () {
            $template = Template::factory()->create([
                'thumbnail' => 'templates/thumbnails/test.jpg',
                'preview_video' => 'templates/videos/test.mp4'
            ]);

            // Create fake files
            Storage::disk('public')->put($template->thumbnail, 'fake content');
            Storage::disk('public')->put($template->preview_video, 'fake content');

            $response = $this->actingAs($this->admin, 'admin')
                ->delete(route('admin.templates.destroy', $template));

            $response->assertRedirect(route('admin.templates.index'));
            Storage::disk('public')->assertMissing($template->thumbnail);
            Storage::disk('public')->assertMissing($template->preview_video);
        });

        it('handles deletion of template with assets', function () {
            $template = Template::factory()->create();
            $asset = Asset::factory()->create();
            $template->assets()->attach($asset->id, [
                'layer_name' => 'test_layer',
                'layer_config' => ['position' => [100, 100]],
                'sort_order' => 1,
            ]);

            $response = $this->actingAs($this->admin, 'admin')
                ->delete(route('admin.templates.destroy', $template));

            $response->assertRedirect(route('admin.templates.index'));
            $this->assertDatabaseMissing('templates', ['id' => $template->id]);
            // Assets should remain but relationship should be deleted
            $this->assertDatabaseMissing('template_assets', ['template_id' => $template->id]);
            $this->assertDatabaseHas('assets', ['id' => $asset->id]);
        });

        it('shows appropriate message when template not found', function () {
            $nonExistentId = 99999;

            $response = $this->actingAs($this->admin, 'admin')
                ->delete(route('admin.templates.destroy', $nonExistentId));

            $response->assertNotFound();
        });
    });

    describe('Template Bulk Operations', function () {
        it('can toggle multiple templates active status', function () {
            $templates = Template::factory()->count(3)->create(['is_active' => true]);

            $templateIds = $templates->pluck('id')->toArray();

            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.templates.bulk-toggle-active'), [
                    'template_ids' => $templateIds,
                    'is_active' => false,
                ]);

            $response->assertRedirect(route('admin.templates.index'));
            $response->assertSessionHas('success', 'Templates updated successfully.');

            foreach ($templates as $template) {
                $template->refresh();
                expect($template->is_active)->toBeFalse();
            }
        });

        it('can toggle multiple templates premium status', function () {
            $templates = Template::factory()->count(3)->create(['is_premium' => false]);

            $templateIds = $templates->pluck('id')->toArray();

            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.templates.bulk-toggle-premium'), [
                    'template_ids' => $templateIds,
                    'is_premium' => true,
                ]);

            $response->assertRedirect(route('admin.templates.index'));
            $response->assertSessionHas('success', 'Templates updated successfully.');

            foreach ($templates as $template) {
                $template->refresh();
                expect($template->is_premium)->toBeTrue();
            }
        });

        it('validates bulk operation data', function () {
            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.templates.bulk-toggle-active'), []);

            $response->assertSessionHasErrors(['template_ids']);
        });
    });

    describe('Template Statistics', function () {
        it('tracks template views', function () {
            $template = Template::factory()->create(['views_count' => 5]);

            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.templates.increment-views', $template));

            $response->assertStatus(200);
            $template->refresh();
            expect($template->views_count)->toBe(6);
        });

        it('tracks template downloads', function () {
            $template = Template::factory()->create(['downloads_count' => 10]);

            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.templates.increment-downloads', $template));

            $response->assertStatus(200);
            $template->refresh();
            expect($template->downloads_count)->toBe(11);
        });

        it('updates template rating', function () {
            $template = Template::factory()->create([
                'rating' => 4.0,
                'ratings_count' => 5
            ]);

            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.templates.update-rating', $template), [
                    'rating' => 5.0
                ]);

            $response->assertStatus(200);
            $template->refresh();
            expect($template->rating)->toBeCloseTo(4.17, 2); // (4.0 * 5 + 5.0) / 6
            expect($template->ratings_count)->toBe(6);
        });
    });

    describe('Template Permissions', function () {
        it('allows super admin to perform all operations', function () {
            $template = Template::factory()->create();

            // Update
            $response = $this->actingAs($this->superAdmin, 'admin')
                ->put(route('admin.templates.update', $template), [
                    'category_id' => $template->category_id,
                    'name' => 'Updated by Super Admin',
                    'description' => 'Updated description',
                    'json_config' => ['duration' => 10],
                    'resolution' => '1080x1920',
                    'duration' => 10,
                ]);
            $response->assertRedirect(route('admin.templates.index'));

            // Delete
            $response = $this->actingAs($this->superAdmin, 'admin')
                ->delete(route('admin.templates.destroy', $template));
            $response->assertRedirect(route('admin.templates.index'));
        });

        it('allows regular admin to perform all operations', function () {
            $template = Template::factory()->create();

            $response = $this->actingAs($this->admin, 'admin')
                ->put(route('admin.templates.update', $template), [
                    'category_id' => $template->category_id,
                    'name' => 'Updated by Admin',
                    'description' => 'Updated description',
                    'json_config' => ['duration' => 10],
                    'resolution' => '1080x1920',
                    'duration' => 10,
                ]);
            $response->assertRedirect(route('admin.templates.index'));
        });
    });
});
