<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Category;
use App\Models\Template;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    protected Admin $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = Admin::factory()->create();
    }

    public function test_admin_can_view_categories_index()
    {
        Category::factory()->count(3)->create();

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.categories.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Categories/Index')
                ->has('categories.data', 3)
        );
    }

    public function test_admin_can_view_create_category_form()
    {
        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.categories.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Categories/Create')
        );
    }

    public function test_admin_can_create_category()
    {
        $categoryData = [
            'name' => 'Test Category',
            'description' => 'Test description',
            'color' => '#FF0000',
            'icon' => '🎨',
            'is_active' => true,
            'sort_order' => 1,
        ];

        $response = $this->actingAs($this->admin, 'admin')
            ->post(route('admin.categories.store'), $categoryData);

        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHas('success', 'Category created successfully.');

        $this->assertDatabaseHas('categories', [
            'name' => 'Test Category',
            'description' => 'Test description',
            'color' => '#FF0000',
            'icon' => '🎨',
            'is_active' => true,
            'sort_order' => 1,
        ]);
    }

    public function test_admin_can_view_category()
    {
        $category = Category::factory()->create();
        $templates = Template::factory()->count(2)->create(['category_id' => $category->id]);

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.categories.show', $category));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Categories/Show')
                ->has('category')
                ->where('category.name', $category->name)
        );
    }

    public function test_admin_can_view_edit_category_form()
    {
        $category = Category::factory()->create();

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.categories.edit', $category));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Categories/Edit')
                ->has('category')
                ->where('category.name', $category->name)
        );
    }

    public function test_admin_can_update_category()
    {
        $category = Category::factory()->create([
            'name' => 'Original Name',
            'description' => 'Original description',
        ]);

        $updateData = [
            'name' => 'Updated Name',
            'description' => 'Updated description',
            'color' => '#00FF00',
            'icon' => '🚀',
            'is_active' => false,
            'sort_order' => 5,
        ];

        $response = $this->actingAs($this->admin, 'admin')
            ->put(route('admin.categories.update', $category), $updateData);

        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHas('success', 'Category updated successfully.');

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Updated Name',
            'description' => 'Updated description',
            'color' => '#00FF00',
            'icon' => '🚀',
            'is_active' => false,
            'sort_order' => 5,
        ]);
    }

    public function test_admin_can_delete_category_without_templates()
    {
        $category = Category::factory()->create();

        $response = $this->actingAs($this->admin, 'admin')
            ->delete(route('admin.categories.destroy', $category));

        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHas('success', 'Category deleted successfully.');

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_admin_cannot_delete_category_with_templates()
    {
        $category = Category::factory()->create();
        Template::factory()->create(['category_id' => $category->id]);

        $response = $this->actingAs($this->admin, 'admin')
            ->delete(route('admin.categories.destroy', $category));

        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHas('error', 'Cannot delete category with existing templates.');

        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }

    public function test_category_validation_requires_name()
    {
        $response = $this->actingAs($this->admin, 'admin')
            ->post(route('admin.categories.store'), []);

        $response->assertSessionHasErrors(['name']);
    }

    public function test_category_validation_requires_unique_name()
    {
        Category::factory()->create(['name' => 'Existing Category']);

        $response = $this->actingAs($this->admin, 'admin')
            ->post(route('admin.categories.store'), [
                'name' => 'Existing Category',
            ]);

        $response->assertSessionHasErrors(['name']);
    }

    public function test_category_validation_accepts_valid_color()
    {
        $categoryData = [
            'name' => 'Test Category',
            'color' => '#FF0000',
        ];

        $response = $this->actingAs($this->admin, 'admin')
            ->post(route('admin.categories.store'), $categoryData);

        $response->assertRedirect();
        $this->assertDatabaseHas('categories', [
            'name' => 'Test Category',
            'color' => '#FF0000',
        ]);
    }

    public function test_category_validation_rejects_invalid_color()
    {
        $response = $this->actingAs($this->admin, 'admin')
            ->post(route('admin.categories.store'), [
                'name' => 'Test Category',
                'color' => 'invalid-color',
            ]);

        $response->assertSessionHasErrors(['color']);
    }

    public function test_category_search_functionality()
    {
        Category::factory()->create(['name' => 'Design Category']);
        Category::factory()->create(['name' => 'Business Category']);
        Category::factory()->create(['name' => 'Creative Category']);

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.categories.index', ['search' => 'Design']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('categories.data', 1)
                ->where('categories.data.0.name', 'Design Category')
        );
    }

    public function test_category_filter_by_status()
    {
        Category::factory()->create(['is_active' => true]);
        Category::factory()->create(['is_active' => false]);

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.categories.index', ['is_active' => '1']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('categories.data', 1)
        );
    }

    public function test_guest_cannot_access_admin_categories()
    {
        $response = $this->get(route('admin.categories.index'));
        $response->assertRedirect(route('admin.login'));
    }

    public function test_regular_user_cannot_access_admin_categories()
    {
        $user = \App\Models\User::factory()->create();

        $response = $this->actingAs($user)
            ->get(route('admin.categories.index'));

        $response->assertRedirect(route('admin.login'));
    }
}
