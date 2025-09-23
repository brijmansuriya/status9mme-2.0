<?php

use App\Models\Category;
use App\Models\Template;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->category = Category::factory()->create();
    $this->template = Template::factory()->create([
        'category_id' => $this->category->id,
        'json_config' => [
            'duration' => 15,
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
                    'fontFamily' => 'Arial',
                    'textAlign' => 'center',
                    'animation' => 'fadeInUp'
                ],
                [
                    'type' => 'image',
                    'placeholder' => 'user_photo',
                    'position' => [540, 700],
                    'size' => [200, 200],
                    'shape' => 'circle',
                    'animation' => 'scaleIn'
                ]
            ]
        ],
    ]);
});

describe('Video Editor Access', function () {
    it('can access video editor for a template', function () {
        $response = $this->get("/templates/{$this->template->slug}");

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => 
            $page->component('VideoEditor')
                ->has('template')
                ->where('template.id', $this->template->id)
                ->where('template.name', $this->template->name)
        );
    });

    it('loads template with category information', function () {
        $response = $this->get("/templates/{$this->template->slug}");

        $response->assertInertia(fn (Assert $page) => 
            $page->has('template.category')
                ->where('template.category.id', $this->category->id)
                ->where('template.category.name', $this->category->name)
        );
    });

    it('returns 404 for non-existent template', function () {
        $response = $this->get('/templates/non-existent-template');

        $response->assertStatus(404);
    });

    it('returns 404 for inactive template', function () {
        $this->template->update(['is_active' => false]);

        $response = $this->get("/templates/{$this->template->slug}");

        $response->assertStatus(404);
    });
});

describe('Template Customization', function () {
    it('can customize text layers', function () {
        $customizationData = [
            'text_0' => [
                'content' => 'John Doe',
                'fontSize' => 52,
                'color' => '#FFD93D',
                'fontFamily' => 'Helvetica',
                'textAlign' => 'center',
            ]
        ];

        $response = $this->post("/templates/{$this->template->id}/customize", [
            'customizations' => $customizationData,
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'customizations' => $customizationData,
        ]);
    });

    it('can customize image layers', function () {
        $customizationData = [
            'image_1' => [
                'src' => 'https://example.com/user-photo.jpg',
                'size' => [250, 250],
                'position' => [540, 700],
            ]
        ];

        $response = $this->post("/templates/{$this->template->id}/customize", [
            'customizations' => $customizationData,
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'customizations' => $customizationData,
        ]);
    });

    it('validates customization data structure', function () {
        $invalidData = [
            'text_0' => [
                'content' => '', // Empty content should be allowed
                'fontSize' => 'invalid', // Invalid font size
            ]
        ];

        $response = $this->post("/templates/{$this->template->id}/customize", [
            'customizations' => $invalidData,
        ]);

        // Should still process but with validation
        $response->assertStatus(200);
    });

    it('can reset customizations to default', function () {
        $response = $this->post("/templates/{$this->template->id}/customize", [
            'reset' => true,
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'customizations' => [],
        ]);
    });
});

describe('Video Export', function () {
    it('can export video with customizations', function () {
        $customizationData = [
            'text_0' => [
                'content' => 'Happy Birthday!',
                'color' => '#FF6B6B',
            ]
        ];

        $exportData = [
            'customizations' => $customizationData,
            'quality' => 'high',
            'format' => 'mp4',
        ];

        $response = $this->post("/templates/{$this->template->id}/export", $exportData);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'download_url' => fn ($url) => str_contains($url, 'export'),
        ]);
    });

    it('can export in different qualities', function () {
        $qualities = ['low', 'medium', 'high', 'ultra'];

        foreach ($qualities as $quality) {
            $response = $this->post("/templates/{$this->template->id}/export", [
                'quality' => $quality,
                'format' => 'mp4',
            ]);

            $response->assertStatus(200);
            $response->assertJson([
                'success' => true,
                'quality' => $quality,
            ]);
        }
    });

    it('can export in different formats', function () {
        $formats = ['mp4', 'webm', 'mov'];

        foreach ($formats as $format) {
            $response = $this->post("/templates/{$this->template->id}/export", [
                'quality' => 'high',
                'format' => $format,
            ]);

            $response->assertStatus(200);
            $response->assertJson([
                'success' => true,
                'format' => $format,
            ]);
        }
    });

    it('tracks export statistics', function () {
        $this->post("/templates/{$this->template->id}/export", [
            'quality' => 'high',
            'format' => 'mp4',
        ]);

        $this->template->refresh();
        expect($this->template->downloads_count)->toBe(1);
    });

    it('validates export parameters', function () {
        $response = $this->post("/templates/{$this->template->id}/export", [
            'quality' => 'invalid_quality',
            'format' => 'invalid_format',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['quality', 'format']);
    });
});

describe('Template Preview', function () {
    it('can generate preview frame', function () {
        $customizationData = [
            'text_0' => [
                'content' => 'Preview Text',
                'color' => '#FFD93D',
            ]
        ];

        $response = $this->post("/templates/{$this->template->id}/preview", [
            'customizations' => $customizationData,
            'time' => 5.0,
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'preview_url' => fn ($url) => str_contains($url, 'preview'),
        ]);
    });

    it('can generate preview at different time points', function () {
        $timePoints = [0, 5, 10, 15];

        foreach ($timePoints as $time) {
            $response = $this->post("/templates/{$this->template->id}/preview", [
                'time' => $time,
            ]);

            $response->assertStatus(200);
            $response->assertJson([
                'success' => true,
                'time' => $time,
            ]);
        }
    });

    it('validates preview time range', function () {
        $response = $this->post("/templates/{$this->template->id}/preview", [
            'time' => 20, // Beyond template duration
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['time']);
    });
});

describe('Template Analytics', function () {
    it('tracks template views', function () {
        $response = $this->get("/templates/{$this->template->slug}");

        $response->assertStatus(200);
        
        $this->template->refresh();
        expect($this->template->views_count)->toBe(1);
    });

    it('increments view count on each access', function () {
        $this->get("/templates/{$this->template->slug}");
        $this->get("/templates/{$this->template->slug}");
        $this->get("/templates/{$this->template->slug}");

        $this->template->refresh();
        expect($this->template->views_count)->toBe(3);
    });

    it('tracks customization attempts', function () {
        $this->post("/templates/{$this->template->id}/customize", [
            'customizations' => ['text_0' => ['content' => 'Test']],
        ]);

        // This would typically be tracked in a separate analytics table
        $response = $this->get("/templates/{$this->template->id}/analytics");
        
        $response->assertStatus(200);
        $response->assertJson([
            'customization_attempts' => 1,
        ]);
    });
});

describe('Template Validation', function () {
    it('validates template json configuration', function () {
        $invalidTemplate = Template::factory()->create([
            'category_id' => $this->category->id,
            'json_config' => [
                'duration' => 15,
                // Missing required fields
            ],
        ]);

        $response = $this->get("/templates/{$invalidTemplate->slug}");

        // Should still work but with default values
        $response->assertStatus(200);
    });

    it('handles malformed json configuration gracefully', function () {
        $malformedTemplate = Template::factory()->create([
            'category_id' => $this->category->id,
            'json_config' => null,
        ]);

        $response = $this->get("/templates/{$malformedTemplate->slug}");

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => 
            $page->where('template.json_config', [])
        );
    });
});

describe('Template Performance', function () {
    it('loads template quickly', function () {
        $startTime = microtime(true);
        
        $response = $this->get("/templates/{$this->template->slug}");
        
        $endTime = microtime(true);
        $loadTime = $endTime - $startTime;

        $response->assertStatus(200);
        expect($loadTime)->toBeLessThan(1.0); // Should load in under 1 second
    });

    it('handles large template configurations', function () {
        $largeConfig = [
            'duration' => 60,
            'resolution' => '1080x1920',
            'layers' => array_fill(0, 50, [
                'type' => 'text',
                'content' => 'Layer {{index}}',
                'position' => [100, 100],
                'fontSize' => 24,
                'color' => '#FFFFFF',
            ])
        ];

        $largeTemplate = Template::factory()->create([
            'category_id' => $this->category->id,
            'json_config' => $largeConfig,
        ]);

        $response = $this->get("/templates/{$largeTemplate->slug}");

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => 
            $page->has('template.json_config.layers', 50)
        );
    });
});