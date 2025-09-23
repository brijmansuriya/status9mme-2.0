<?php

use App\Models\Category;
use App\Models\Template;
use Illuminate\Support\Str;

describe('Category Model', function () {
    it('can create a category', function () {
        $category = Category::create([
            'name' => 'Test Category',
            'description' => 'A test category',
            'color' => '#FF6B6B',
            'icon' => 'test-icon',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        expect($category->name)->toBe('Test Category');
        expect($category->slug)->toBe('test-category');
        expect($category->color)->toBe('#FF6B6B');
        expect($category->is_active)->toBeTrue();
    });

    it('automatically generates slug from name', function () {
        $category = Category::create([
            'name' => 'Birthday Celebrations',
            'color' => '#FF6B6B',
        ]);

        expect($category->slug)->toBe('birthday-celebrations');
    });

    it('handles special characters in slug generation', function () {
        $category = Category::create([
            'name' => 'WhatsApp & Instagram Status',
            'color' => '#FF6B6B',
        ]);

        expect($category->slug)->toBe('whatsapp-instagram-status');
    });

    it('has many templates relationship', function () {
        $category = Category::factory()->create();
        $templates = Template::factory()->count(3)->create(['category_id' => $category->id]);

        expect($category->templates)->toHaveCount(3);
        expect($category->templates->first())->toBeInstanceOf(Template::class);
    });

    it('can scope active categories', function () {
        Category::factory()->create(['is_active' => true]);
        Category::factory()->create(['is_active' => false]);

        $activeCategories = Category::where('is_active', true)->get();

        expect($activeCategories)->toHaveCount(1);
    });

    it('can be ordered by sort order', function () {
        Category::factory()->create(['sort_order' => 3, 'name' => 'Third']);
        Category::factory()->create(['sort_order' => 1, 'name' => 'First']);
        Category::factory()->create(['sort_order' => 2, 'name' => 'Second']);

        $orderedCategories = Category::orderBy('sort_order')->get();

        expect($orderedCategories->first()->name)->toBe('First');
        expect($orderedCategories->last()->name)->toBe('Third');
    });

    it('casts is_active to boolean', function () {
        $category = Category::create([
            'name' => 'Test Category',
            'color' => '#FF6B6B',
            'is_active' => 1,
        ]);

        expect($category->is_active)->toBeTrue();
        expect($category->is_active)->not->toBe(1);
    });

    it('has fillable attributes', function () {
        $category = new Category();
        $fillable = $category->getFillable();

        expect($fillable)->toContain('name', 'slug', 'description', 'color', 'icon', 'is_active', 'sort_order');
    });

    it('can cascade delete templates', function () {
        $category = Category::factory()->create();
        $templates = Template::factory()->count(2)->create(['category_id' => $category->id]);

        $category->delete();

        expect(Template::where('category_id', $category->id)->count())->toBe(0);
    });
});
