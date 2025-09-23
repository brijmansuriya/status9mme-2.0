<?php

use App\Models\Category;
use App\Models\Template;
use App\Models\Asset;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

describe('Admin Dashboard', function () {
    it('can access admin dashboard', function () {
        $response = $this->get('/admin/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Dashboard')
                ->has('stats')
        );
    });

    it('shows correct statistics', function () {
        // Create test data
        $categories = Category::factory()->count(3)->create();
        $templates = Template::factory()->count(5)->create([
            'downloads_count' => 10,
            'views_count' => 50,
        ]);

        $response = $this->get('/admin/dashboard');

        $response->assertInertia(fn ($page) => 
            $page->where('stats.totalTemplates', 5)
                ->where('stats.totalCategories', 3)
                ->where('stats.totalDownloads', 50)
                ->where('stats.totalViews', 250)
        );
    });

    it('shows recent templates', function () {
        $recentTemplates = Template::factory()->count(3)->create([
            'created_at' => now()->subDays(1),
        ]);

        $response = $this->get('/admin/dashboard');

        $response->assertInertia(fn ($page) => 
            $page->has('stats.recentTemplates', 3)
        );
    });

    it('shows top categories by template count', function () {
        $category1 = Category::factory()->create();
        $category2 = Category::factory()->create();
        
        Template::factory()->count(5)->create(['category_id' => $category1->id]);
        Template::factory()->count(3)->create(['category_id' => $category2->id]);

        $response = $this->get('/admin/dashboard');

        $response->assertInertia(fn ($page) => 
            $page->has('stats.topCategories')
                ->where('stats.topCategories.0.templates_count', 5)
        );
    });
});

describe('Admin Authentication', function () {
    it('requires authentication for admin routes', function () {
        auth()->logout();

        $response = $this->get('/admin/dashboard');

        $response->assertRedirect('/login');
    });

    it('allows authenticated users to access admin', function () {
        $response = $this->get('/admin/dashboard');

        $response->assertStatus(200);
    });
});

describe('Admin Template Management', function () {
    it('can list all templates in admin', function () {
        $templates = Template::factory()->count(3)->create();

        $response = $this->get('/admin/templates');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Templates')
                ->has('templates', 3)
        );
    });

    it('can filter templates by category in admin', function () {
        $category1 = Category::factory()->create();
        $category2 = Category::factory()->create();
        
        Template::factory()->create(['category_id' => $category1->id]);
        Template::factory()->create(['category_id' => $category2->id]);

        $response = $this->get("/admin/templates?category={$category1->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('templates', 1)
        );
    });

    it('can search templates in admin', function () {
        Template::factory()->create(['name' => 'Birthday Template']);
        Template::factory()->create(['name' => 'Wedding Template']);

        $response = $this->get('/admin/templates?search=Birthday');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('templates', 1)
                ->where('templates.0.name', 'Birthday Template')
        );
    });

    it('can toggle template status in admin', function () {
        $template = Template::factory()->create(['is_active' => true]);

        $response = $this->patch("/admin/templates/{$template->id}/toggle-status");

        $response->assertStatus(200);
        $template->refresh();
        expect($template->is_active)->toBeFalse();
    });

    it('can bulk update templates in admin', function () {
        $templates = Template::factory()->count(3)->create(['is_active' => true]);

        $response = $this->patch('/admin/templates/bulk-update', [
            'template_ids' => $templates->pluck('id')->toArray(),
            'action' => 'deactivate',
        ]);

        $response->assertStatus(200);
        
        foreach ($templates as $template) {
            $template->refresh();
            expect($template->is_active)->toBeFalse();
        }
    });
});

describe('Admin Category Management', function () {
    it('can list all categories in admin', function () {
        $categories = Category::factory()->count(3)->create();

        $response = $this->get('/admin/categories');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Categories')
                ->has('categories', 3)
        );
    });

    it('can create category with validation', function () {
        $categoryData = [
            'name' => 'Test Category',
            'description' => 'Test description',
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
        ]);
    });

    it('validates unique category names', function () {
        Category::factory()->create(['name' => 'Existing Category']);

        $response = $this->post('/admin/categories', [
            'name' => 'Existing Category',
            'color' => '#FF6B6B',
        ]);

        $response->assertSessionHasErrors(['name']);
    });
});

describe('Admin Asset Management', function () {
    it('can list all assets in admin', function () {
        $assets = Asset::factory()->count(3)->create();

        $response = $this->get('/admin/assets');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Assets')
                ->has('assets', 3)
        );
    });

    it('can filter assets by type in admin', function () {
        Asset::factory()->create(['file_type' => 'image']);
        Asset::factory()->create(['file_type' => 'video']);

        $response = $this->get('/admin/assets?file_type=image');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('assets', 1)
        );
    });

    it('can upload asset with file validation', function () {
        $file = \Illuminate\Http\UploadedFile::fake()->image('test.jpg', 800, 600);

        $response = $this->post('/admin/assets', [
            'name' => 'Test Asset',
            'file' => $file,
            'file_type' => 'image',
            'is_public' => true,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('assets', [
            'name' => 'Test Asset',
            'file_type' => 'image',
        ]);
    });

    it('validates file upload requirements', function () {
        $response = $this->post('/admin/assets', [
            'name' => 'Test Asset',
            'file_type' => 'image',
        ]);

        $response->assertSessionHasErrors(['file']);
    });
});

describe('Admin Analytics', function () {
    it('can view template analytics', function () {
        $template = Template::factory()->create([
            'downloads_count' => 100,
            'views_count' => 500,
            'rating' => 4.5,
            'ratings_count' => 20,
        ]);

        $response = $this->get("/admin/templates/{$template->id}/analytics");

        $response->assertStatus(200);
        $response->assertJson([
            'downloads_count' => 100,
            'views_count' => 500,
            'rating' => 4.5,
            'ratings_count' => 20,
        ]);
    });

    it('can view category analytics', function () {
        $category = Category::factory()->create();
        Template::factory()->count(5)->create(['category_id' => $category->id]);

        $response = $this->get("/admin/categories/{$category->id}/analytics");

        $response->assertStatus(200);
        $response->assertJson([
            'templates_count' => 5,
        ]);
    });

    it('can view system analytics', function () {
        $response = $this->get('/admin/analytics');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'total_templates',
            'total_categories',
            'total_assets',
            'total_downloads',
            'total_views',
            'recent_activity',
        ]);
    });
});

describe('Admin Settings', function () {
    it('can view admin settings', function () {
        $response = $this->get('/admin/settings');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Settings')
        );
    });

    it('can update system settings', function () {
        $settingsData = [
            'site_name' => 'Updated Site Name',
            'max_file_size' => 10485760, // 10MB
            'allowed_file_types' => ['jpg', 'png', 'mp4'],
            'default_template_duration' => 15,
        ];

        $response = $this->put('/admin/settings', $settingsData);

        $response->assertRedirect();
        $this->assertDatabaseHas('settings', [
            'key' => 'site_name',
            'value' => 'Updated Site Name',
        ]);
    });

    it('validates settings data', function () {
        $response = $this->put('/admin/settings', [
            'max_file_size' => 'invalid',
            'default_template_duration' => -1,
        ]);

        $response->assertSessionHasErrors(['max_file_size', 'default_template_duration']);
    });
});

describe('Admin User Management', function () {
    it('can list admin users', function () {
        $users = User::factory()->count(3)->create();

        $response = $this->get('/admin/users');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Users')
                ->has('users')
        );
    });

    it('can create admin user', function () {
        $userData = [
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'admin',
        ];

        $response = $this->post('/admin/users', $userData);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ]);
    });

    it('can update user permissions', function () {
        $user = User::factory()->create();

        $response = $this->patch("/admin/users/{$user->id}/permissions", [
            'can_create_templates' => true,
            'can_manage_categories' => false,
            'can_upload_assets' => true,
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);
    });
});

describe('Admin Security', function () {
    it('logs admin actions', function () {
        $template = Template::factory()->create();

        $this->delete("/admin/templates/{$template->id}");

        $this->assertDatabaseHas('admin_logs', [
            'user_id' => $this->user->id,
            'action' => 'template_deleted',
            'resource_id' => $template->id,
        ]);
    });

    it('requires admin role for sensitive operations', function () {
        $regularUser = User::factory()->create(['role' => 'user']);
        $this->actingAs($regularUser);

        $response = $this->delete('/admin/templates/1');

        $response->assertStatus(403);
    });

    it('validates CSRF protection', function () {
        $response = $this->post('/admin/templates', [], [
            'X-CSRF-TOKEN' => 'invalid-token',
        ]);

        $response->assertStatus(419);
    });
});
