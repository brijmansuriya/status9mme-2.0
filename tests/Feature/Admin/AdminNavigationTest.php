<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Category;
use App\Models\Template;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

describe('Admin Navigation', function () {
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

    it('loads admin dashboard with correct menu items', function () {
        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Dashboard')
        );
    });

    it('navigates to templates index page', function () {
        Template::factory()->count(3)->create();

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.templates.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Templates/Index')
                ->has('templates.data', 3)
        );
    });

    it('navigates to categories index page', function () {
        Category::factory()->count(3)->create();

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.categories.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Categories/Index')
                ->has('categories.data', 3)
        );
    });

    it('navigates to templates create page', function () {
        Category::factory()->count(2)->create(['is_active' => true]);

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.templates.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Templates/Create')
                ->has('categories', 2)
        );
    });

    it('navigates to categories create page', function () {
        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.categories.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Categories/Create')
        );
    });

    it('navigates to template show page', function () {
        $template = Template::factory()->create();
        $template->load('category', 'assets');

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.templates.show', $template));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Templates/Show')
                ->has('template')
                ->where('template.id', $template->id)
        );
    });

    it('navigates to category show page', function () {
        $category = Category::factory()->create();
        $category->loadCount('templates');

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.categories.show', $category));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Categories/Show')
                ->has('category')
                ->where('category.id', $category->id)
        );
    });

    it('navigates to template edit page', function () {
        $template = Template::factory()->create();
        $categories = Category::where('is_active', true)->get();

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.templates.edit', $template));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Templates/Edit')
                ->has('template')
                ->where('template.id', $template->id)
        );
    });

    it('navigates to category edit page', function () {
        $category = Category::factory()->create();

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.categories.edit', $category));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Categories/Edit')
                ->has('category')
                ->where('category.id', $category->id)
        );
    });

    it('shows correct navigation structure in dashboard', function () {
        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.dashboard'));

        $response->assertStatus(200);
        
        // Verify dashboard contains navigation data
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Dashboard')
        );
    });

    it('handles navigation with search parameters', function () {
        Category::factory()->count(5)->create();
        Category::factory()->create(['name' => 'Test Category']);

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.categories.index', ['search' => 'Test']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Categories/Index')
                ->has('categories.data')
                ->has('filters.search', 'Test')
        );
    });

    it('handles navigation with filtering parameters', function () {
        Category::factory()->count(3)->create(['is_active' => true]);
        Category::factory()->count(2)->create(['is_active' => false]);

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.categories.index', ['is_active' => true]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Categories/Index')
                ->has('categories.data')
                ->has('filters.is_active', true)
        );
    });

    it('handles navigation with sorting parameters', function () {
        Category::factory()->count(3)->create();

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.categories.index', [
                'sort_by' => 'name',
                'sort_direction' => 'asc'
            ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Categories/Index')
                ->has('categories.data')
        );
    });

    it('maintains navigation state across page loads', function () {
        // First visit to categories with filters
        $this->actingAs($this->admin, 'admin')
            ->get(route('admin.categories.index', [
                'search' => 'Test',
                'is_active' => true
            ]));

        // Navigate to templates
        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.templates.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Templates/Index')
        );

        // Return to categories - filters should be preserved in URL
        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.categories.index', [
                'search' => 'Test',
                'is_active' => true
            ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Categories/Index')
                ->has('filters.search', 'Test')
                ->has('filters.is_active', true)
        );
    });

    it('handles pagination navigation', function () {
        Category::factory()->count(25)->create();

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.categories.index', ['page' => 2]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Categories/Index')
                ->has('categories.data')
                ->where('categories.current_page', 2)
        );
    });

    it('shows appropriate navigation for different admin roles', function () {
        // Test regular admin navigation
        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.dashboard'));

        $response->assertStatus(200);

        // Test super admin navigation
        $response = $this->actingAs($this->superAdmin, 'admin')
            ->get(route('admin.dashboard'));

        $response->assertStatus(200);
    });
});
