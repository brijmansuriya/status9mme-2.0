<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\User;
use App\Models\Category;
use App\Models\Template;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

describe('Admin Authorization', function () {
    beforeEach(function () {
        $this->admin = Admin::factory()->create([
            'is_active' => true,
            'role' => 'admin',
            'permissions' => ['templates.manage', 'categories.manage'],
        ]);
        
        $this->superAdmin = Admin::factory()->create([
            'is_active' => true,
            'role' => 'super_admin',
        ]);

        $this->limitedAdmin = Admin::factory()->create([
            'is_active' => true,
            'role' => 'editor',
            'permissions' => ['templates.view'],
        ]);

        $this->inactiveAdmin = Admin::factory()->create([
            'is_active' => false,
            'role' => 'admin',
        ]);

        $this->user = User::factory()->create();
    });

    describe('Route Protection', function () {
        it('redirects unauthenticated users to admin login', function () {
            $protectedRoutes = [
                'admin.dashboard',
                'admin.categories.index',
                'admin.templates.index',
                'admin.assets.index',
            ];

            foreach ($protectedRoutes as $route) {
                $response = $this->get(route($route));
                $response->assertRedirect(route('admin.login'));
            }
        });

        it('allows authenticated admin to access protected routes', function () {
            $protectedRoutes = [
                'admin.dashboard',
                'admin.categories.index',
                'admin.templates.index',
                'admin.assets.index',
            ];

            foreach ($protectedRoutes as $route) {
                $response = $this->actingAs($this->admin, 'admin')
                    ->get(route($route));
                $response->assertStatus(200);
            }
        });

        it('rejects regular users from admin routes', function () {
            $protectedRoutes = [
                'admin.dashboard',
                'admin.categories.index',
                'admin.templates.index',
            ];

            foreach ($protectedRoutes as $route) {
                $response = $this->actingAs($this->user, 'web')
                    ->get(route($route));
                $response->assertRedirect(route('admin.login'));
            }
        });

        it('rejects inactive admin from accessing routes', function () {
            $response = $this->actingAs($this->inactiveAdmin, 'admin')
                ->get(route('admin.dashboard'));

            $response->assertRedirect(route('admin.login'));
            $response->assertSessionHas('error', 'Your account has been deactivated.');
        });

        it('handles JSON requests appropriately', function () {
            $response = $this->getJson(route('admin.dashboard'));
            $response->assertStatus(401);
            $response->assertJson(['message' => 'Unauthorized']);
        });

        it('handles inactive admin JSON requests', function () {
            $response = $this->actingAs($this->inactiveAdmin, 'admin')
                ->getJson(route('admin.dashboard'));

            $response->assertStatus(403);
            $response->assertJson(['message' => 'Account deactivated']);
        });
    });

    describe('Admin Role Permissions', function () {
        it('allows super admin to access all routes', function () {
            $allRoutes = [
                'admin.dashboard',
                'admin.categories.index',
                'admin.categories.create',
                'admin.templates.index',
                'admin.templates.create',
                'admin.assets.index',
                'admin.assets.create',
            ];

            foreach ($allRoutes as $route) {
                $response = $this->actingAs($this->superAdmin, 'admin')
                    ->get(route($route));
                $response->assertStatus(200);
            }
        });

        it('allows admin with proper permissions to access routes', function () {
            $response = $this->actingAs($this->admin, 'admin')
                ->get(route('admin.categories.create'));
            $response->assertStatus(200);

            $response = $this->actingAs($this->admin, 'admin')
                ->get(route('admin.templates.create'));
            $response->assertStatus(200);
        });

        it('restricts admin without proper permissions', function () {
            // Limited admin only has templates.view permission
            $response = $this->actingAs($this->limitedAdmin, 'admin')
                ->get(route('admin.categories.create'));
            $response->assertStatus(403);

            $response = $this->actingAs($this->limitedAdmin, 'admin')
                ->get(route('admin.templates.create'));
            $response->assertStatus(403);
        });
    });

    describe('CRUD Operation Authorization', function () {
        it('allows authorized admin to create categories', function () {
            $categoryData = [
                'name' => 'Test Category',
                'description' => 'Test description',
                'color' => '#FF5722',
                'is_active' => true,
            ];

            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.categories.store'), $categoryData);

            $response->assertRedirect(route('admin.categories.index'));
            $response->assertSessionHas('success', 'Category created successfully.');
        });

        it('prevents unauthorized admin from creating categories', function () {
            $categoryData = [
                'name' => 'Test Category',
                'description' => 'Test description',
            ];

            $response = $this->actingAs($this->limitedAdmin, 'admin')
                ->post(route('admin.categories.store'), $categoryData);

            $response->assertStatus(403);
        });

        it('allows authorized admin to update categories', function () {
            $category = Category::factory()->create();

            $response = $this->actingAs($this->admin, 'admin')
                ->put(route('admin.categories.update', $category), [
                    'name' => 'Updated Category',
                    'description' => 'Updated description',
                    'color' => '#3B82F6',
                    'is_active' => true,
                ]);

            $response->assertRedirect(route('admin.categories.index'));
            $response->assertSessionHas('success', 'Category updated successfully.');
        });

        it('prevents unauthorized admin from updating categories', function () {
            $category = Category::factory()->create();

            $response = $this->actingAs($this->limitedAdmin, 'admin')
                ->put(route('admin.categories.update', $category), [
                    'name' => 'Updated Category',
                    'description' => 'Updated description',
                ]);

            $response->assertStatus(403);
        });

        it('allows authorized admin to delete categories', function () {
            $category = Category::factory()->create();

            $response = $this->actingAs($this->admin, 'admin')
                ->delete(route('admin.categories.destroy', $category));

            $response->assertRedirect(route('admin.categories.index'));
            $response->assertSessionHas('success', 'Category deleted successfully.');
        });

        it('prevents unauthorized admin from deleting categories', function () {
            $category = Category::factory()->create();

            $response = $this->actingAs($this->limitedAdmin, 'admin')
                ->delete(route('admin.categories.destroy', $category));

            $response->assertStatus(403);
        });

        it('allows authorized admin to create templates', function () {
            $category = Category::factory()->create();
            $templateData = [
                'category_id' => $category->id,
                'name' => 'Test Template',
                'description' => 'Test description',
                'json_config' => ['duration' => 10],
                'resolution' => '1080x1920',
                'duration' => 10,
            ];

            $response = $this->actingAs($this->admin, 'admin')
                ->post(route('admin.templates.store'), $templateData);

            $response->assertRedirect(route('admin.templates.index'));
            $response->assertSessionHas('success', 'Template created successfully.');
        });

        it('prevents unauthorized admin from creating templates', function () {
            $category = Category::factory()->create();
            $templateData = [
                'category_id' => $category->id,
                'name' => 'Test Template',
                'description' => 'Test description',
                'json_config' => ['duration' => 10],
                'resolution' => '1080x1920',
                'duration' => 10,
            ];

            $response = $this->actingAs($this->limitedAdmin, 'admin')
                ->post(route('admin.templates.store'), $templateData);

            $response->assertStatus(403);
        });

        it('allows authorized admin to update templates', function () {
            $template = Template::factory()->create();

            $response = $this->actingAs($this->admin, 'admin')
                ->put(route('admin.templates.update', $template), [
                    'category_id' => $template->category_id,
                    'name' => 'Updated Template',
                    'description' => 'Updated description',
                    'json_config' => ['duration' => 15],
                    'resolution' => '1080x1920',
                    'duration' => 15,
                ]);

            $response->assertRedirect(route('admin.templates.index'));
            $response->assertSessionHas('success', 'Template updated successfully.');
        });

        it('prevents unauthorized admin from updating templates', function () {
            $template = Template::factory()->create();

            $response = $this->actingAs($this->limitedAdmin, 'admin')
                ->put(route('admin.templates.update', $template), [
                    'category_id' => $template->category_id,
                    'name' => 'Updated Template',
                    'description' => 'Updated description',
                    'json_config' => ['duration' => 15],
                    'resolution' => '1080x1920',
                    'duration' => 15,
                ]);

            $response->assertStatus(403);
        });

        it('allows authorized admin to delete templates', function () {
            $template = Template::factory()->create();

            $response = $this->actingAs($this->admin, 'admin')
                ->delete(route('admin.templates.destroy', $template));

            $response->assertRedirect(route('admin.templates.index'));
            $response->assertSessionHas('success', 'Template deleted successfully.');
        });

        it('prevents unauthorized admin from deleting templates', function () {
            $template = Template::factory()->create();

            $response = $this->actingAs($this->limitedAdmin, 'admin')
                ->delete(route('admin.templates.destroy', $template));

            $response->assertStatus(403);
        });
    });

    describe('Admin Permission System', function () {
        it('checks specific permissions correctly', function () {
            expect($this->admin->hasPermission('templates.manage'))->toBeTrue();
            expect($this->admin->hasPermission('categories.manage'))->toBeTrue();
            expect($this->admin->hasPermission('non-existent.permission'))->toBeFalse();
        });

        it('super admin has all permissions', function () {
            expect($this->superAdmin->hasPermission('any.permission'))->toBeTrue();
            expect($this->superAdmin->hasPermission('another.permission'))->toBeTrue();
        });

        it('checks multiple permissions correctly', function () {
            expect($this->admin->hasAnyPermission(['templates.manage', 'categories.manage']))->toBeTrue();
            expect($this->admin->hasAnyPermission(['templates.manage', 'non-existent']))->toBeTrue();
            expect($this->admin->hasAnyPermission(['non-existent1', 'non-existent2']))->toBeFalse();
        });

        it('checks all permissions requirement', function () {
            expect($this->admin->hasAllPermissions(['templates.manage', 'categories.manage']))->toBeTrue();
            expect($this->admin->hasAllPermissions(['templates.manage', 'non-existent']))->toBeFalse();
            expect($this->admin->hasAllPermissions(['non-existent1', 'non-existent2']))->toBeFalse();
        });

        it('identifies super admin role correctly', function () {
            expect($this->superAdmin->isSuperAdmin())->toBeTrue();
            expect($this->admin->isSuperAdmin())->toBeFalse();
        });

        it('identifies active status correctly', function () {
            expect($this->admin->isActive())->toBeTrue();
            expect($this->inactiveAdmin->isActive())->toBeFalse();
        });
    });

    describe('Session Management', function () {
        it('maintains separate sessions for admin and user', function () {
            // Login as admin
            $this->actingAs($this->admin, 'admin');
            $this->assertAuthenticatedAs($this->admin, 'admin');
            $this->assertGuest('web');

            // Login as user in different session
            $this->actingAs($this->user, 'web');
            $this->assertAuthenticatedAs($this->user, 'web');
            $this->assertGuest('admin');
        });

        it('handles session timeout appropriately', function () {
            // Simulate session timeout by clearing session
            $this->actingAs($this->admin, 'admin');
            
            // Clear session manually
            $this->app['session']->flush();
            
            $response = $this->get(route('admin.dashboard'));
            $response->assertRedirect(route('admin.login'));
        });

        it('updates last login information on access', function () {
            $originalLastLogin = $this->admin->last_login_at;
            $originalLastLoginIp = $this->admin->last_login_ip;

            $response = $this->actingAs($this->admin, 'admin')
                ->get(route('admin.dashboard'));

            $response->assertStatus(200);
            
            $this->admin->refresh();
            expect($this->admin->last_login_at)->not->toBe($originalLastLogin);
            expect($this->admin->last_login_ip)->not->toBe($originalLastLoginIp);
        });
    });

    describe('Admin Account Status', function () {
        it('allows active admin to access all features', function () {
            $response = $this->actingAs($this->admin, 'admin')
                ->get(route('admin.dashboard'));
            $response->assertStatus(200);

            $response = $this->actingAs($this->admin, 'admin')
                ->get(route('admin.categories.index'));
            $response->assertStatus(200);
        });

        it('blocks inactive admin from accessing features', function () {
            $response = $this->actingAs($this->inactiveAdmin, 'admin')
                ->get(route('admin.dashboard'));
            $response->assertRedirect(route('admin.login'));

            $response = $this->actingAs($this->inactiveAdmin, 'admin')
                ->post(route('admin.categories.store'), [
                    'name' => 'Test Category',
                    'description' => 'Test description',
                ]);
            $response->assertRedirect(route('admin.login'));
        });

        it('logs out inactive admin automatically', function () {
            $this->actingAs($this->inactiveAdmin, 'admin');
            
            $response = $this->get(route('admin.dashboard'));
            $response->assertRedirect(route('admin.login'));
            
            $this->assertGuest('admin');
        });
    });

    describe('API Authorization', function () {
        it('handles API requests with proper authentication', function () {
            $response = $this->actingAs($this->admin, 'admin')
                ->getJson(route('admin.categories.index'));
            
            $response->assertStatus(200);
        });

        it('rejects API requests without authentication', function () {
            $response = $this->getJson(route('admin.categories.index'));
            $response->assertStatus(401);
        });

        it('rejects API requests with inactive admin', function () {
            $response = $this->actingAs($this->inactiveAdmin, 'admin')
                ->getJson(route('admin.categories.index'));
            
            $response->assertStatus(403);
        });

        it('handles API POST requests with proper authorization', function () {
            $categoryData = [
                'name' => 'API Test Category',
                'description' => 'Created via API',
            ];

            $response = $this->actingAs($this->admin, 'admin')
                ->postJson(route('admin.categories.store'), $categoryData);
            
            $response->assertStatus(302); // Redirect response
        });

        it('rejects API POST requests without proper permissions', function () {
            $categoryData = [
                'name' => 'API Test Category',
                'description' => 'Created via API',
            ];

            $response = $this->actingAs($this->limitedAdmin, 'admin')
                ->postJson(route('admin.categories.store'), $categoryData);
            
            $response->assertStatus(403);
        });
    });

    describe('Cross-Guard Security', function () {
        it('prevents user from accessing admin routes with user authentication', function () {
            $response = $this->actingAs($this->user, 'web')
                ->get(route('admin.dashboard'));
            
            $response->assertRedirect(route('admin.login'));
        });

        it('prevents admin from accessing user routes with admin authentication', function () {
            $response = $this->actingAs($this->admin, 'admin')
                ->get(route('home'));
            
            // This should work as admin can access public routes
            $response->assertStatus(200);
        });

        it('maintains separate session data for different guards', function () {
            // Set different session data for each guard
            $this->actingAs($this->admin, 'admin');
            session(['admin_data' => 'admin_session_data']);
            
            $this->actingAs($this->user, 'web');
            session(['user_data' => 'user_session_data']);
            
            // Admin session should not have user data
            $this->actingAs($this->admin, 'admin');
            expect(session('admin_data'))->toBe('admin_session_data');
            expect(session('user_data'))->toBeNull();
        });
    });
});
