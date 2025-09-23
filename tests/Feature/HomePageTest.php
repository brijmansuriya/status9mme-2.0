<?php

use App\Models\Category;
use App\Models\Template;
use App\Models\User;

describe('Homepage', function () {
    beforeEach(function () {
        // Create test data
        $this->categories = Category::factory()->count(6)->create(['is_active' => true]);
        $this->templates = Template::factory()->count(10)->create(['is_active' => true]);
    });

    it('can access the homepage', function () {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Home')
                ->has('categories')
                ->has('templates')
                ->has('featuredTemplates')
        );
    });

    it('shows active categories with template counts', function () {
        // Add templates to some categories
        Template::factory()->count(3)->create([
            'category_id' => $this->categories[0]->id,
            'is_active' => true,
        ]);
        Template::factory()->count(2)->create([
            'category_id' => $this->categories[1]->id,
            'is_active' => true,
        ]);

        $response = $this->get('/');

        $response->assertInertia(fn ($page) => 
            $page->has('categories', 6)
                ->where('categories.0.templates_count', 3)
                ->where('categories.1.templates_count', 2)
        );
    });

    it('shows featured templates ordered by downloads', function () {
        $featuredTemplate = Template::factory()->create([
            'is_active' => true,
            'downloads_count' => 100,
        ]);
        $regularTemplate = Template::factory()->create([
            'is_active' => true,
            'downloads_count' => 10,
        ]);

        $response = $this->get('/');

        $response->assertInertia(fn ($page) => 
            $page->has('featuredTemplates')
                ->where('featuredTemplates.0.downloads_count', 100)
        );
    });

    it('only shows active templates', function () {
        Template::factory()->create(['is_active' => false]);

        $response = $this->get('/');

        $response->assertInertia(fn ($page) => 
            $page->where('templates', fn ($templates) => 
                $templates->every(fn ($template) => $template['is_active'] === true)
            )
        );
    });

    it('loads categories in correct order', function () {
        $this->categories[0]->update(['sort_order' => 3]);
        $this->categories[1]->update(['sort_order' => 1]);
        $this->categories[2]->update(['sort_order' => 2]);

        $response = $this->get('/');

        $response->assertInertia(fn ($page) => 
            $page->where('categories.0.sort_order', 1)
                ->where('categories.1.sort_order', 2)
                ->where('categories.2.sort_order', 3)
        );
    });

    it('includes category information in templates', function () {
        $template = Template::factory()->create([
            'category_id' => $this->categories[0]->id,
            'is_active' => true,
        ]);

        $response = $this->get('/');

        $response->assertInertia(fn ($page) => 
            $page->where('templates', fn ($templates) => 
                $templates->contains(fn ($t) => 
                    $t['id'] === $template->id && 
                    isset($t['category']) &&
                    $t['category']['id'] === $this->categories[0]->id
                )
            )
        );
    });

    it('limits featured templates to 8', function () {
        Template::factory()->count(15)->create(['is_active' => true]);

        $response = $this->get('/');

        $response->assertInertia(fn ($page) => 
            $page->has('featuredTemplates', 8)
        );
    });

    it('handles empty categories gracefully', function () {
        Category::factory()->create(['is_active' => true]);

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('categories')
        );
    });

    it('handles no templates gracefully', function () {
        Template::query()->delete();

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('templates', 0)
                ->has('featuredTemplates', 0)
        );
    });
});
