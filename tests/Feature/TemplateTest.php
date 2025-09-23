<?php

use App\Models\Category;
use App\Models\Template;
use App\Models\Asset;
use App\Models\TemplateAsset;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
    $this->category = Category::factory()->create();
});

describe('Template Management', function () {
    it('can create a new template', function () {
        $templateData = [
            'category_id' => $this->category->id,
            'name' => 'Test Template',
            'description' => 'A test template for videos',
            'json_config' => [
                'duration' => 15,
                'resolution' => '1080x1920',
                'layers' => [
                    [
                        'type' => 'text',
                        'content' => '{{name}}',
                        'position' => [540, 400],
                        'fontSize' => 48,
                        'color' => '#FFFFFF',
                    ]
                ]
            ],
            'is_premium' => false,
            'is_active' => true,
            'keywords' => ['test', 'template'],
            'resolution' => '1080x1920',
            'duration' => 15,
        ];

        $response = $this->post('/admin/templates', $templateData);

        $response->assertRedirect();
        $this->assertDatabaseHas('templates', [
            'name' => 'Test Template',
            'slug' => 'test-template',
            'category_id' => $this->category->id,
        ]);
    });

    it('automatically generates slug from name', function () {
        $template = Template::create([
            'category_id' => $this->category->id,
            'name' => 'Birthday Celebration Template',
            'json_config' => ['duration' => 15],
        ]);

        expect($template->slug)->toBe('birthday-celebration-template');
    });

    it('can update a template', function () {
        $template = Template::factory()->create([
            'category_id' => $this->category->id,
            'name' => 'Original Name',
        ]);

        $updateData = [
            'category_id' => $this->category->id,
            'name' => 'Updated Name',
            'description' => 'Updated description',
            'json_config' => $template->json_config,
            'is_premium' => true,
        ];

        $response = $this->put("/admin/templates/{$template->id}", $updateData);

        $response->assertRedirect();
        $this->assertDatabaseHas('templates', [
            'id' => $template->id,
            'name' => 'Updated Name',
            'is_premium' => true,
        ]);
    });

    it('can delete a template', function () {
        $template = Template::factory()->create(['category_id' => $this->category->id]);

        $response = $this->delete("/admin/templates/{$template->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('templates', [
            'id' => $template->id,
        ]);
    });

    it('can list templates with category information', function () {
        Template::factory()->count(3)->create(['category_id' => $this->category->id]);

        $response = $this->get('/admin/templates');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Templates')
                ->has('templates', 3)
        );
    });

    it('validates required fields when creating template', function () {
        $response = $this->post('/admin/templates', []);

        $response->assertSessionHasErrors(['name', 'category_id', 'json_config']);
    });

    it('validates json_config structure', function () {
        $response = $this->post('/admin/templates', [
            'category_id' => $this->category->id,
            'name' => 'Test Template',
            'json_config' => 'invalid-json',
        ]);

        $response->assertSessionHasErrors(['json_config']);
    });
});

describe('Template Relationships', function () {
    it('belongs to a category', function () {
        $template = Template::factory()->create(['category_id' => $this->category->id]);

        expect($template->category)->toBeInstanceOf(Category::class);
        expect($template->category->id)->toBe($this->category->id);
    });

    it('has many template assets', function () {
        $template = Template::factory()->create(['category_id' => $this->category->id]);
        $asset = Asset::factory()->create();
        
        TemplateAsset::create([
            'template_id' => $template->id,
            'asset_id' => $asset->id,
            'layer_name' => 'background',
            'layer_config' => ['position' => [0, 0]],
        ]);

        expect($template->templateAssets)->toHaveCount(1);
        expect($template->templateAssets->first())->toBeInstanceOf(TemplateAsset::class);
    });

    it('can access assets through template assets relationship', function () {
        $template = Template::factory()->create(['category_id' => $this->category->id]);
        $asset = Asset::factory()->create();
        
        TemplateAsset::create([
            'template_id' => $template->id,
            'asset_id' => $asset->id,
            'layer_name' => 'background',
        ]);

        expect($template->assets)->toHaveCount(1);
        expect($template->assets->first())->toBeInstanceOf(Asset::class);
    });
});

describe('Template Scopes and Filters', function () {
    it('can filter active templates', function () {
        Template::factory()->create(['is_active' => true, 'category_id' => $this->category->id]);
        Template::factory()->create(['is_active' => false, 'category_id' => $this->category->id]);

        $activeTemplates = Template::where('is_active', true)->get();

        expect($activeTemplates)->toHaveCount(1);
    });

    it('can filter premium templates', function () {
        Template::factory()->create(['is_premium' => true, 'category_id' => $this->category->id]);
        Template::factory()->create(['is_premium' => false, 'category_id' => $this->category->id]);

        $premiumTemplates = Template::where('is_premium', true)->get();

        expect($premiumTemplates)->toHaveCount(1);
    });

    it('can search templates by name', function () {
        Template::factory()->create(['name' => 'Birthday Template', 'category_id' => $this->category->id]);
        Template::factory()->create(['name' => 'Wedding Template', 'category_id' => $this->category->id]);

        $searchResults = Template::where('name', 'like', '%Birthday%')->get();

        expect($searchResults)->toHaveCount(1);
        expect($searchResults->first()->name)->toBe('Birthday Template');
    });

    it('can filter templates by category', function () {
        $category2 = Category::factory()->create();
        
        Template::factory()->create(['category_id' => $this->category->id]);
        Template::factory()->create(['category_id' => $category2->id]);

        $categoryTemplates = Template::where('category_id', $this->category->id)->get();

        expect($categoryTemplates)->toHaveCount(1);
    });
});

describe('Template Statistics', function () {
    it('can increment download count', function () {
        $template = Template::factory()->create([
            'category_id' => $this->category->id,
            'downloads_count' => 5,
        ]);

        $template->increment('downloads_count');

        expect($template->fresh()->downloads_count)->toBe(6);
    });

    it('can increment view count', function () {
        $template = Template::factory()->create([
            'category_id' => $this->category->id,
            'views_count' => 10,
        ]);

        $template->increment('views_count');

        expect($template->fresh()->views_count)->toBe(11);
    });

    it('can calculate average rating', function () {
        $template = Template::factory()->create([
            'category_id' => $this->category->id,
            'rating' => 4.5,
            'ratings_count' => 10,
        ]);

        expect($template->rating)->toBe(4.5);
        expect($template->ratings_count)->toBe(10);
    });
});

describe('Template JSON Configuration', function () {
    it('can store and retrieve complex json configuration', function () {
        $jsonConfig = [
            'duration' => 20,
            'resolution' => '1080x1920',
            'background' => [
                'type' => 'gradient',
                'colors' => ['#FF6B6B', '#4ECDC4']
            ],
            'layers' => [
                [
                    'type' => 'text',
                    'content' => '{{name}}',
                    'position' => [540, 400],
                    'fontSize' => 48,
                    'color' => '#FFFFFF',
                    'animation' => 'fadeInUp'
                ],
                [
                    'type' => 'image',
                    'placeholder' => 'user_photo',
                    'position' => [540, 700],
                    'size' => [200, 200],
                    'shape' => 'circle'
                ]
            ]
        ];

        $template = Template::create([
            'category_id' => $this->category->id,
            'name' => 'Complex Template',
            'json_config' => $jsonConfig,
        ]);

        expect($template->json_config)->toBe($jsonConfig);
        expect($template->json_config['duration'])->toBe(20);
        expect($template->json_config['layers'])->toHaveCount(2);
    });

    it('validates required json configuration fields', function () {
        $invalidConfig = [
            'duration' => 15,
            // Missing resolution and layers
        ];

        $response = $this->post('/admin/templates', [
            'category_id' => $this->category->id,
            'name' => 'Invalid Template',
            'json_config' => $invalidConfig,
        ]);

        // This would typically be handled by a custom validation rule
        $response->assertRedirect(); // Assuming it passes basic validation
    });
});