<?php

use App\Models\Admin;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;

describe('Authentication System', function () {
    describe('Admin Authentication', function () {
        it('can access admin login page', function () {
            $response = $this->get('/admin/login');

            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => 
                $page->component('Admin/Auth/Login')
            );
        });

        it('redirects authenticated admin to dashboard', function () {
            $admin = Admin::factory()->create();
            $this->actingAs($admin, 'admin');

            $response = $this->get('/admin/login');

            $response->assertRedirect('/admin/dashboard');
        });

        it('can login with valid admin credentials', function () {
            $admin = Admin::factory()->create([
                'email' => 'admin@test.com',
                'password' => bcrypt('password'),
                'is_active' => true,
            ]);

            $response = $this->post('/admin/login', [
                'email' => 'admin@test.com',
                'password' => 'password',
            ]);

            $response->assertRedirect('/admin/dashboard');
            $this->assertAuthenticated('admin');
        });

        it('rejects login with invalid credentials', function () {
            $response = $this->post('/admin/login', [
                'email' => 'admin@test.com',
                'password' => 'wrong-password',
            ]);

            $response->assertSessionHasErrors(['email']);
            $this->assertGuest('admin');
        });

        it('rejects login for inactive admin', function () {
            $admin = Admin::factory()->create([
                'email' => 'admin@test.com',
                'password' => bcrypt('password'),
                'is_active' => false,
            ]);

            $response = $this->post('/admin/login', [
                'email' => 'admin@test.com',
                'password' => 'password',
            ]);

            $response->assertSessionHasErrors(['email']);
            $this->assertGuest('admin');
        });

        it('can logout admin', function () {
            $admin = Admin::factory()->create();
            $this->actingAs($admin, 'admin');

            $response = $this->post('/admin/logout');

            $response->assertRedirect('/admin/login');
            $this->assertGuest('admin');
        });

        it('updates last login information on successful login', function () {
            $admin = Admin::factory()->create([
                'email' => 'admin@test.com',
                'password' => bcrypt('password'),
                'is_active' => true,
            ]);

            $this->post('/admin/login', [
                'email' => 'admin@test.com',
                'password' => 'password',
            ]);

            $admin->refresh();
            expect($admin->last_login_at)->not->toBeNull();
            expect($admin->last_login_ip)->not->toBeNull();
        });

        it('respects rate limiting for admin login', function () {
            $key = 'admin-login:' . $this->app->request->ip();
            
            // Make 5 failed attempts
            for ($i = 0; $i < 5; $i++) {
                $this->post('/admin/login', [
                    'email' => 'admin@test.com',
                    'password' => 'wrong-password',
                ]);
            }

            // 6th attempt should be rate limited
            $response = $this->post('/admin/login', [
                'email' => 'admin@test.com',
                'password' => 'wrong-password',
            ]);

            $response->assertSessionHasErrors(['email']);
            expect(RateLimiter::tooManyAttempts($key, 5))->toBeTrue();
        });
    });

    describe('Admin Permissions', function () {
        it('super admin has all permissions', function () {
            $admin = Admin::factory()->superAdmin()->create();

            expect($admin->isSuperAdmin())->toBeTrue();
            expect($admin->hasPermission('manage_templates'))->toBeTrue();
            expect($admin->hasPermission('manage_users'))->toBeTrue();
            expect($admin->hasAnyPermission(['manage_templates', 'manage_categories']))->toBeTrue();
            expect($admin->hasAllPermissions(['manage_templates', 'manage_categories']))->toBeTrue();
        });

        it('regular admin respects permission system', function () {
            $admin = Admin::factory()->create([
                'role' => 'admin',
                'permissions' => ['manage_templates', 'manage_categories'],
            ]);

            expect($admin->isSuperAdmin())->toBeFalse();
            expect($admin->hasPermission('manage_templates'))->toBeTrue();
            expect($admin->hasPermission('manage_users'))->toBeFalse();
            expect($admin->hasAnyPermission(['manage_templates', 'manage_users']))->toBeTrue();
            expect($admin->hasAllPermissions(['manage_templates', 'manage_users']))->toBeFalse();
        });

        it('can check admin is active', function () {
            $activeAdmin = Admin::factory()->active()->create();
            $inactiveAdmin = Admin::factory()->inactive()->create();

            expect($activeAdmin->isActive())->toBeTrue();
            expect($inactiveAdmin->isActive())->toBeFalse();
        });
    });

    describe('Admin Middleware', function () {
        it('allows authenticated admin to access protected routes', function () {
            $admin = Admin::factory()->create();
            $this->actingAs($admin, 'admin');

            $response = $this->get('/admin/dashboard');

            $response->assertStatus(200);
        });

        it('redirects unauthenticated user to admin login', function () {
            $response = $this->get('/admin/dashboard');

            $response->assertRedirect('/admin/login');
        });

        it('redirects inactive admin to login with error', function () {
            $admin = Admin::factory()->inactive()->create();
            $this->actingAs($admin, 'admin');

            $response = $this->get('/admin/dashboard');

            $response->assertRedirect('/admin/login');
            $response->assertSessionHas('error', 'Your account has been deactivated.');
        });

        it('handles JSON requests for API', function () {
            $response = $this->getJson('/admin/dashboard');

            $response->assertStatus(401);
            $response->assertJson(['message' => 'Unauthorized']);
        });
    });

    describe('User Authentication', function () {
        it('can access user login page', function () {
            $response = $this->get('/login');

            $response->assertStatus(200);
        });

        it('can login with valid user credentials', function () {
            $user = User::factory()->create([
                'email' => 'user@test.com',
                'password' => bcrypt('password'),
            ]);

            $response = $this->post('/login', [
                'email' => 'user@test.com',
                'password' => 'password',
            ]);

            $response->assertRedirect('/dashboard');
            $this->assertAuthenticated('user');
        });

        it('rejects login with invalid user credentials', function () {
            $response = $this->post('/login', [
                'email' => 'user@test.com',
                'password' => 'wrong-password',
            ]);

            $response->assertSessionHasErrors(['email']);
            $this->assertGuest('user');
        });

        it('can logout user', function () {
            $user = User::factory()->create();
            $this->actingAs($user, 'user');

            $response = $this->post('/logout');

            $response->assertRedirect('/');
            $this->assertGuest('user');
        });
    });

    describe('User Middleware', function () {
        it('allows authenticated user to access protected routes', function () {
            $user = User::factory()->create();
            $this->actingAs($user, 'user');

            $response = $this->get('/dashboard');

            $response->assertStatus(200);
        });

        it('redirects unauthenticated user to login', function () {
            $response = $this->get('/dashboard');

            $response->assertRedirect('/login');
        });

        it('handles JSON requests for API', function () {
            $response = $this->getJson('/dashboard');

            $response->assertStatus(401);
            $response->assertJson(['message' => 'Unauthorized']);
        });
    });

    describe('Session Isolation', function () {
        it('admin and user sessions are completely separate', function () {
            $admin = Admin::factory()->create();
            $user = User::factory()->create();

            // Login as admin
            $this->actingAs($admin, 'admin');
            $this->assertAuthenticated('admin');
            $this->assertGuest('user');

            // Login as user (should not affect admin session)
            $this->actingAs($user, 'user');
            $this->assertAuthenticated('user');
            $this->assertAuthenticated('admin'); // Admin session should still be active

            // Logout admin
            Auth::guard('admin')->logout();
            $this->assertGuest('admin');
            $this->assertAuthenticated('user'); // User session should still be active
        });

        it('can have both admin and user authenticated simultaneously', function () {
            $admin = Admin::factory()->create();
            $user = User::factory()->create();

            $this->actingAs($admin, 'admin');
            $this->actingAs($user, 'user');

            $this->assertAuthenticated('admin');
            $this->assertAuthenticated('user');
        });
    });

    describe('Route Protection', function () {
        it('protects admin routes with admin middleware', function () {
            $response = $this->get('/admin/categories');
            $response->assertRedirect('/admin/login');

            $admin = Admin::factory()->create();
            $this->actingAs($admin, 'admin');
            
            $response = $this->get('/admin/categories');
            $response->assertStatus(200);
        });

        it('protects user routes with user middleware', function () {
            $response = $this->get('/user/profile');
            $response->assertRedirect('/login');

            $user = User::factory()->create();
            $this->actingAs($user, 'user');
            
            $response = $this->get('/user/profile');
            $response->assertStatus(200);
        });

        it('allows public access to template routes', function () {
            $response = $this->get('/');
            $response->assertStatus(200);

            $response = $this->get('/templates');
            $response->assertStatus(200);
        });
    });

    describe('Admin Scopes', function () {
        it('can scope active admins', function () {
            Admin::factory()->active()->count(3)->create();
            Admin::factory()->inactive()->count(2)->create();

            $activeAdmins = Admin::active()->get();
            expect($activeAdmins)->toHaveCount(3);
        });

        it('can scope admins by role', function () {
            Admin::factory()->admin()->count(2)->create();
            Admin::factory()->superAdmin()->count(1)->create();

            $regularAdmins = Admin::role('admin')->get();
            $superAdmins = Admin::role('super_admin')->get();

            expect($regularAdmins)->toHaveCount(2);
            expect($superAdmins)->toHaveCount(1);
        });
    });
});
