<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Category;
use App\Models\Template;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

describe('Categories CRUD Operations', function () {
    beforeEach(function () {
        $this->admin = Admin::factory()->create([
            'is_active' => true,
            'role' => 'admin',
        ]);
        
        $this->superAdmin = Admin::factory()->create([
            'is_active' => true,
            'role' => 'super_admin',
        ]);
    });

    describe('Category Index/Listing', function () {
        it('displays all categories with template counts', function () {
            $category1 = Category::factory()->create();
            $category2 = Category::factory()->create();
            Template::factory()->count(3)->create(['category_id' => $category1->id]);
            Template::factory()->count(2)->create(['category_id' => $category2->id]);

            $response = $this->actingAs($this->admin, 'admin')
                ->get(route('admin.categories.index'));

            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => 
                $page->component('Admin/Categories/Index')
                    ->has('categories.data', 2)
                    ->where('categories.data.0.templates_count', 3)
                    ->where('categories.data.1.templates_count', 2)
            );
        });

        it('supports searching categories by name', function () {
            Category::factory()->create(['name' => 'Birthday Templates']);
            Category::factory()->create(['name' => 'Wedding Templates']);
            Category::factory()->create(['name' => 'Corporate Videos']);

            $response = $this->actingAs($this->admin, 'admin')
                ->get(route('admin.categories.index', ['search' => 'Wedding']));

            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => 
                $page->component('Admin/Categories/Index')
                    ->has('categories.data', 1)
                    ->where('categories.data.0.name', 'Wedding Templates')
                    ->has('filters.search', 'Wedding')
            );
        });

        it('supports searching categories by description', function () {
            Category::factory()->create([
                'name' => 'Birthday',
                'description' => 'Celebration templates'
            ]);
            Category::factory()->create([
                'name' => 'Wedding',
                'description' => 'Wedding ceremony templates'
            ]);

            $response = $this->actingAs($this->admin, 'admin')
                ->get(route('admin.categories.index', ['search' => 'celebration']));

            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => 
                $page->component('Admin/Categories/Index')
                    ->has('categories.data', 1)
                    ->where('categories.data.0.name', 'Birthday')
            );
        });

        it('filters categories by active status', function () {
            Category::factory()->count(2)->create(['is_active' => true]);
            Category::factory()->count(3)->create(['is_active' => false]);

            $response = $this->actingAs($this->admin, 'admin')
                ->get(route('admin.categories.index', ['is_active' => true]));

            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => 
                $page->component('Admin/Categories/Index')
                    ->has('categories.data', 2)
                    ->has('filters.is_active', true)
            );
        });

        it('sorts categories by different fields', function () {
            $category1 = Category::factory()->create(['name' => 'Zebra Category', 'created_at' => now()->subDays(2)]);
            $category2 = Category::factory()->create(['name' => 'Alpha Category', 'created_at' => now()->subDays(1)]);

            $response = $this->actingAs($this->admin, 'admin')
                ->get(route('admin.categories.index', [
                    'sort_by' => 'name',
                    'sort_direction' => 'asc'
                ]));

            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => 
                $page->component('Admin/Categories/Index')
                    ->has('categories.data', 2)
                    ->where('categories.data.0.name', 'Alpha Category')
                    ->where('categories.data.1.name', 'Zebra Category')
            );
        });

        it('supports pagination', function () {
            Category::factory()->count(25)->create();

            $response = $this->actingAs($this->admin, 'admin')
                ->get(route('admin.categories.index'));

            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => 
                $page->component('Admin/Categories/Index')
                    ->has('categories.data', 20) // Default per page
                    ->where('categories.last_page', 2)
            );
        });
    });

    describe('Category Creation', function () {
        it('shows create category form', function () {
            $response = $this->actingAs($this->admin, 'admin')
                ->get(route('admin.categories.create'));

            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => 
                $page->component('Admin/Categories/Create')
            );
        });

        it('creates category with valid data', function () {
            $categoryData = [
                'name' => 'Birthday Templates',
                'description' => 'Templates for birthday celebrations',
                'color' => '#FF5722',
                'icon' => 'cake',
                'is_active' => true,
                'sort_order' => 1,
            ];

            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.categories.store'), $categoryData);

            $response->assertRedirect(route('admin.categories.index'));
            $response->assertSessionHas('success', 'Category created successfully.');

            $this->assertDatabaseHas('categories', [
                'name' => 'Birthday Templates',
                'description' => 'Templates for birthday celebrations',
                'color' => '#FF5722',
                'icon' => 'cake',
                'is_active' => true,
                'sort_order' => 1,
            ]);
        });

        it('validates required name field', function () {
            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.categories.store'), [
                    'description' => 'Test description',
                ]);

            $response->assertSessionHasErrors(['name']);
        });

        it('validates unique name constraint', function () {
            Category::factory()->create(['name' => 'Existing Category']);

            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.categories.store'), [
                    'name' => 'Existing Category',
                    'description' => 'Test description',
                ]);

            $response->assertSessionHasErrors(['name']);
        });

        it('validates unique slug constraint', function () {
            Category::factory()->create(['name' => 'Test Category']);

            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.categories.store'), [
                    'name' => 'Test Category!', // Will generate same slug
                    'description' => 'Test description',
                ]);

            $response->assertSessionHasErrors(['name']);
        });

        it('validates color format', function () {
            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.categories.store'), [
                    'name' => 'Test Category',
                    'description' => 'Test description',
                    'color' => 'invalid-color',
                ]);

            $response->assertSessionHasErrors(['color']);
        });

        it('accepts valid hex color codes', function () {
            $validColors = ['#FF5722', '#3B82F6', '#10B981', '#F59E0B'];

            foreach ($validColors as $color) {
                $response = $this->actingAs($this->admin, 'admin')
                    ->post(route('admin.categories.store'), [
                        'name' => "Test Category {$color}",
                        'description' => 'Test description',
                        'color' => $color,
                    ]);

                $response->assertRedirect(route('admin.categories.index'));
                $this->assertDatabaseHas('categories', [
                    'name' => "Test Category {$color}",
                    'color' => $color,
                ]);
            }
        });

        it('defaults to active status when not specified', function () {
            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.categories.store'), [
                    'name' => 'Test Category',
                    'description' => 'Test description',
                ]);

            $response->assertRedirect(route('admin.categories.index'));
            $this->assertDatabaseHas('categories', [
                'name' => 'Test Category',
                'is_active' => true,
            ]);
        });
    });

    describe('Category Viewing', function () {
        it('shows category details with templates', function () {
            $category = Category::factory()->create();
            $templates = Template::factory()->count(3)->create(['category_id' => $category->id]);

            $response = $this->actingAs($this->admin, 'admin')
                ->get(route('admin.categories.show', $category));

            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => 
                $page->component('Admin/Categories/Show')
                    ->has('category')
                    ->where('category.id', $category->id)
                    ->where('category.templates_count', 3)
                    ->has('category.templates', 3)
            );
        });

        it('shows empty state when category has no templates', function () {
            $category = Category::factory()->create();

            $response = $this->actingAs($this->admin, 'admin')
                ->get(route('admin.categories.show', $category));

            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => 
                $page->component('Admin/Categories/Show')
                    ->where('category.templates_count', 0)
                    ->has('category.templates', 0)
            );
        });
    });

    describe('Category Editing', function () {
        it('shows edit category form with current data', function () {
            $category = Category::factory()->create([
                'name' => 'Original Name',
                'description' => 'Original Description',
                'color' => '#FF5722',
                'icon' => 'cake',
                'is_active' => true,
                'sort_order' => 5,
            ]);

            $response = $this->actingAs($this->admin, 'admin')
                ->get(route('admin.categories.edit', $category));

            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => 
                $page->component('Admin/Categories/Edit')
                    ->has('category')
                    ->where('category.id', $category->id)
                    ->where('category.name', 'Original Name')
                    ->where('category.description', 'Original Description')
                    ->where('category.color', '#FF5722')
                    ->where('category.icon', 'cake')
                    ->where('category.is_active', true)
                    ->where('category.sort_order', 5)
            );
        });

        it('updates category with valid data', function () {
            $category = Category::factory()->create();

            $updateData = [
                'name' => 'Updated Category Name',
                'description' => 'Updated description',
                'color' => '#3B82F6',
                'icon' => 'star',
                'is_active' => false,
                'sort_order' => 10,
            ];

            $response = $this->actingAs($this->admin, 'admin')
                ->put(route('admin.categories.update', $category), $updateData);

            $response->assertRedirect(route('admin.categories.index'));
            $response->assertSessionHas('success', 'Category updated successfully.');

            $category->refresh();
            expect($category->name)->toBe('Updated Category Name');
            expect($category->description)->toBe('Updated description');
            expect($category->color)->toBe('#3B82F6');
            expect($category->icon)->toBe('star');
            expect($category->is_active)->toBeFalse();
            expect($category->sort_order)->toBe(10);
        });

        it('validates name uniqueness when updating', function () {
            $category1 = Category::factory()->create(['name' => 'Category One']);
            $category2 = Category::factory()->create(['name' => 'Category Two']);

            $response = $this->actingAs($this->admin, 'admin')
                ->put(route('admin.categories.update', $category2), [
                    'name' => 'Category One', // Same as category1
                    'description' => 'Updated description',
                ]);

            $response->assertSessionHasErrors(['name']);
        });

        it('allows keeping same name when updating same category', function () {
            $category = Category::factory()->create(['name' => 'Original Name']);

            $response = $this->actingAs($this->admin, 'admin')
                ->put(route('admin.categories.update', $category), [
                    'name' => 'Original Name', // Same name
                    'description' => 'Updated description',
                ]);

            $response->assertRedirect(route('admin.categories.index'));
            $response->assertSessionHas('success', 'Category updated successfully.');
        });

        it('updates slug when name changes', function () {
            $category = Category::factory()->create(['name' => 'Original Name']);

            $response = $this->actingAs($this->admin, 'admin')
                ->put(route('admin.categories.update', $category), [
                    'name' => 'New Category Name',
                    'description' => 'Updated description',
                ]);

            $response->assertRedirect(route('admin.categories.index'));

            $category->refresh();
            expect($category->slug)->toBe('new-category-name');
        });
    });

    describe('Category Deletion', function () {
        it('deletes category without templates', function () {
            $category = Category::factory()->create();

            $response = $this->actingAs($this->admin, 'admin')
                ->delete(route('admin.categories.destroy', $category));

            $response->assertRedirect(route('admin.categories.index'));
            $response->assertSessionHas('success', 'Category deleted successfully.');

            $this->assertDatabaseMissing('categories', ['id' => $category->id]);
        });

        it('prevents deletion of category with templates', function () {
            $category = Category::factory()->create();
            Template::factory()->create(['category_id' => $category->id]);

            $response = $this->actingAs($this->admin, 'admin')
                ->delete(route('admin.categories.destroy', $category));

            $response->assertRedirect(route('admin.categories.index'));
            $response->assertSessionHas('error', 'Cannot delete category with existing templates.');

            $this->assertDatabaseHas('categories', ['id' => $category->id]);
        });

        it('shows appropriate message when category not found', function () {
            $nonExistentId = 99999;

            $response = $this->actingAs($this->admin, 'admin')
                ->delete(route('admin.categories.destroy', $nonExistentId));

            $response->assertNotFound();
        });
    });

    describe('Category Bulk Operations', function () {
        it('can toggle multiple categories active status', function () {
            $categories = Category::factory()->count(3)->create(['is_active' => true]);

            $categoryIds = $categories->pluck('id')->toArray();

            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.categories.bulk-toggle-active'), [
                    'category_ids' => $categoryIds,
                    'is_active' => false,
                ]);

            $response->assertRedirect(route('admin.categories.index'));
            $response->assertSessionHas('success', 'Categories updated successfully.');

            foreach ($categories as $category) {
                $category->refresh();
                expect($category->is_active)->toBeFalse();
            }
        });

        it('validates bulk operation data', function () {
            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.categories.bulk-toggle-active'), []);

            $response->assertSessionHasErrors(['category_ids']);
        });
    });

    describe('Category Permissions', function () {
        it('allows super admin to perform all operations', function () {
            $category = Category::factory()->create();

            // Create
            $response = $this->actingAs($this->superAdmin, 'admin')
                ->post(route('admin.categories.store'), [
                    'name' => 'Super Admin Category',
                    'description' => 'Created by super admin',
                ]);
            $response->assertRedirect(route('admin.categories.index'));

            // Update
            $response = $this->actingAs($this->superAdmin, 'admin')
                ->put(route('admin.categories.update', $category), [
                    'name' => 'Updated by Super Admin',
                    'description' => 'Updated description',
                ]);
            $response->assertRedirect(route('admin.categories.index'));

            // Delete
            $response = $this->actingAs($this->superAdmin, 'admin')
                ->delete(route('admin.categories.destroy', $category));
            $response->assertRedirect(route('admin.categories.index'));
        });

        it('allows regular admin to perform all operations', function () {
            $category = Category::factory()->create();

            // All operations should work for regular admin
            $response = $this->actingAs($this->admin, 'admin')
                ->put(route('admin.categories.update', $category), [
                    'name' => 'Updated by Admin',
                    'description' => 'Updated description',
                ]);
            $response->assertRedirect(route('admin.categories.index'));
        });
    });
});
