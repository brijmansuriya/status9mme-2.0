<?php

use App\Models\Category;
use App\Models\Template;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

describe('Category Management', function () {
    it('can create a new category', function () {
        $categoryData = [
            'name' => 'Test Category',
            'description' => 'A test category for templates',
            'color' => '#FF6B6B',
            'icon' => 'test-icon',
            'is_active' => true,
            'sort_order' => 1,
        ];

        $response = $this->post('/admin/categories', $categoryData);

        $response->assertRedirect();
        $this->assertDatabaseHas('categories', [
            'name' => 'Test Category',
            'slug' => 'test-category',
            'color' => '#FF6B6B',
        ]);
    });

    it('automatically generates slug from name', function () {
        $category = Category::create([
            'name' => 'Birthday Celebrations',
            'description' => 'Birthday templates',
            'color' => '#FF6B6B',
            'is_active' => true,
        ]);

        expect($category->slug)->toBe('birthday-celebrations');
    });

    it('can update a category', function () {
        $category = Category::factory()->create([
            'name' => 'Original Name',
            'color' => '#FF6B6B',
        ]);

        $updateData = [
            'name' => 'Updated Name',
            'description' => 'Updated description',
            'color' => '#4ECDC4',
            'is_active' => true,
        ];

        $response = $this->put("/admin/categories/{$category->id}", $updateData);

        $response->assertRedirect();
        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Updated Name',
            'color' => '#4ECDC4',
        ]);
    });

    it('can delete a category', function () {
        $category = Category::factory()->create();

        $response = $this->delete("/admin/categories/{$category->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('categories', [
            'id' => $category->id,
        ]);
    });

    it('can list categories with template counts', function () {
        $category1 = Category::factory()->create(['name' => 'Category 1']);
        $category2 = Category::factory()->create(['name' => 'Category 2']);

        Template::factory()->count(3)->create(['category_id' => $category1->id]);
        Template::factory()->count(2)->create(['category_id' => $category2->id]);

        $response = $this->get('/admin/categories');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Categories')
                ->has('categories', 2)
        );
    });

    it('validates required fields when creating category', function () {
        $response = $this->post('/admin/categories', []);

        $response->assertSessionHasErrors(['name']);
    });

    it('validates unique slug constraint', function () {
        Category::factory()->create(['slug' => 'test-category']);

        $response = $this->post('/admin/categories', [
            'name' => 'Test Category', // Will generate same slug
            'description' => 'Another test category',
            'color' => '#FF6B6B',
        ]);

        $response->assertSessionHasErrors(['name']);
    });
});

describe('Category Relationships', function () {
    it('has many templates', function () {
        $category = Category::factory()->create();
        $templates = Template::factory()->count(3)->create(['category_id' => $category->id]);

        expect($category->templates)->toHaveCount(3);
        expect($category->templates->first())->toBeInstanceOf(Template::class);
    });

    it('can cascade delete templates when category is deleted', function () {
        $category = Category::factory()->create();
        $templates = Template::factory()->count(2)->create(['category_id' => $category->id]);

        $category->delete();

        $this->assertDatabaseMissing('templates', [
            'category_id' => $category->id,
        ]);
    });
});

describe('Category Scopes', function () {
    it('can filter active categories', function () {
        Category::factory()->create(['is_active' => true]);
        Category::factory()->create(['is_active' => false]);

        $activeCategories = Category::where('is_active', true)->get();

        expect($activeCategories)->toHaveCount(1);
    });

    it('can order by sort order', function () {
        Category::factory()->create(['sort_order' => 3, 'name' => 'Third']);
        Category::factory()->create(['sort_order' => 1, 'name' => 'First']);
        Category::factory()->create(['sort_order' => 2, 'name' => 'Second']);

        $orderedCategories = Category::orderBy('sort_order')->get();

        expect($orderedCategories->first()->name)->toBe('First');
        expect($orderedCategories->last()->name)->toBe('Third');
    });
});