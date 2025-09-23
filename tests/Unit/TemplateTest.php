<?php

use App\Models\Category;
use App\Models\Template;
use App\Models\Asset;
use App\Models\TemplateAsset;

describe('Template Model', function () {
    beforeEach(function () {
        $this->category = Category::factory()->create();
    });

    it('can create a template', function () {
        $template = Template::create([
            'category_id' => $this->category->id,
            'name' => 'Test Template',
            'description' => 'A test template',
            'json_config' => [
                'duration' => 15,
                'resolution' => '1080x1920',
                'layers' => []
            ],
            'is_premium' => false,
            'is_active' => true,
            'keywords' => ['test', 'template'],
            'resolution' => '1080x1920',
            'duration' => 15,
        ]);

        expect($template->name)->toBe('Test Template');
        expect($template->slug)->toBe('test-template');
        expect($template->category_id)->toBe($this->category->id);
        expect($template->is_premium)->toBeFalse();
    });

    it('automatically generates slug from name', function () {
        $template = Template::create([
            'category_id' => $this->category->id,
            'name' => 'Birthday Celebration Template',
            'json_config' => ['duration' => 15],
        ]);

        expect($template->slug)->toBe('birthday-celebration-template');
    });

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

    it('can access assets through many-to-many relationship', function () {
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

    it('casts json_config to array', function () {
        $jsonConfig = [
            'duration' => 20,
            'resolution' => '1080x1920',
            'layers' => [
                [
                    'type' => 'text',
                    'content' => '{{name}}',
                    'position' => [540, 400],
                ]
            ]
        ];

        $template = Template::create([
            'category_id' => $this->category->id,
            'name' => 'Test Template',
            'json_config' => $jsonConfig,
        ]);

        expect($template->json_config)->toBe($jsonConfig);
        expect($template->json_config['duration'])->toBe(20);
        expect($template->json_config['layers'])->toHaveCount(1);
    });

    it('casts keywords to array', function () {
        $keywords = ['birthday', 'celebration', 'party'];

        $template = Template::create([
            'category_id' => $this->category->id,
            'name' => 'Test Template',
            'json_config' => ['duration' => 15],
            'keywords' => $keywords,
        ]);

        expect($template->keywords)->toBe($keywords);
        expect($template->keywords)->toHaveCount(3);
    });

    it('casts boolean fields correctly', function () {
        $template = Template::create([
            'category_id' => $this->category->id,
            'name' => 'Test Template',
            'json_config' => ['duration' => 15],
            'is_premium' => 1,
            'is_active' => 0,
        ]);

        expect($template->is_premium)->toBeTrue();
        expect($template->is_active)->toBeFalse();
    });

    it('casts rating to decimal', function () {
        $template = Template::create([
            'category_id' => $this->category->id,
            'name' => 'Test Template',
            'json_config' => ['duration' => 15],
            'rating' => 4.5,
        ]);

        expect($template->rating)->toBe(4.5);
        expect($template->rating)->toBeInstanceOf('Decimal');
    });

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

    it('can update rating', function () {
        $template = Template::factory()->create([
            'category_id' => $this->category->id,
            'rating' => 4.0,
            'ratings_count' => 5,
        ]);

        // Simulate adding a new rating
        $newRating = 5.0;
        $totalRatings = $template->ratings_count + 1;
        $newAverage = (($template->rating * $template->ratings_count) + $newRating) / $totalRatings;

        $template->update([
            'rating' => $newAverage,
            'ratings_count' => $totalRatings,
        ]);

        expect($template->fresh()->rating)->toBe(4.2); // (4.0 * 5 + 5.0) / 6
        expect($template->fresh()->ratings_count)->toBe(6);
    });

    it('has fillable attributes', function () {
        $template = new Template();
        $fillable = $template->getFillable();

        expect($fillable)->toContain(
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
            'ratings_count'
        );
    });

    it('can scope active templates', function () {
        Template::factory()->create([
            'category_id' => $this->category->id,
            'is_active' => true,
        ]);
        Template::factory()->create([
            'category_id' => $this->category->id,
            'is_active' => false,
        ]);

        $activeTemplates = Template::where('is_active', true)->get();

        expect($activeTemplates)->toHaveCount(1);
    });

    it('can scope premium templates', function () {
        Template::factory()->create([
            'category_id' => $this->category->id,
            'is_premium' => true,
        ]);
        Template::factory()->create([
            'category_id' => $this->category->id,
            'is_premium' => false,
        ]);

        $premiumTemplates = Template::where('is_premium', true)->get();

        expect($premiumTemplates)->toHaveCount(1);
    });

    it('can search by name', function () {
        Template::factory()->create([
            'category_id' => $this->category->id,
            'name' => 'Birthday Template',
        ]);
        Template::factory()->create([
            'category_id' => $this->category->id,
            'name' => 'Wedding Template',
        ]);

        $searchResults = Template::where('name', 'like', '%Birthday%')->get();

        expect($searchResults)->toHaveCount(1);
        expect($searchResults->first()->name)->toBe('Birthday Template');
    });

    it('can filter by category', function () {
        $category2 = Category::factory()->create();
        
        Template::factory()->create(['category_id' => $this->category->id]);
        Template::factory()->create(['category_id' => $category2->id]);

        $categoryTemplates = Template::where('category_id', $this->category->id)->get();

        expect($categoryTemplates)->toHaveCount(1);
    });

    it('can order by downloads', function () {
        Template::factory()->create([
            'category_id' => $this->category->id,
            'downloads_count' => 10,
        ]);
        Template::factory()->create([
            'category_id' => $this->category->id,
            'downloads_count' => 5,
        ]);

        $orderedTemplates = Template::orderBy('downloads_count', 'desc')->get();

        expect($orderedTemplates->first()->downloads_count)->toBe(10);
        expect($orderedTemplates->last()->downloads_count)->toBe(5);
    });

    it('can order by rating', function () {
        Template::factory()->create([
            'category_id' => $this->category->id,
            'rating' => 4.5,
        ]);
        Template::factory()->create([
            'category_id' => $this->category->id,
            'rating' => 3.8,
        ]);

        $orderedTemplates = Template::orderBy('rating', 'desc')->get();

        expect($orderedTemplates->first()->rating)->toBe(4.5);
        expect($orderedTemplates->last()->rating)->toBe(3.8);
    });
});
