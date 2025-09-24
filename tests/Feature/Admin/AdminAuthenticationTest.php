<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

describe('Admin Authentication', function () {
    beforeEach(function () {
        $this->admin = Admin::factory()->create([
            'email' => 'admin@test.com',
            'password' => bcrypt('password123'),
            'is_active' => true,
        ]);
        
        $this->user = User::factory()->create([
            'email' => 'user@test.com',
            'password' => bcrypt('password123'),
        ]);
    });

    it('shows admin login page', function () {
        $response = $this->get(route('admin.login'));
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Auth/Login')
        );
    });

    it('redirects authenticated admin to dashboard', function () {
        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.login'));
            
        $response->assertRedirect(route('admin.dashboard'));
    });

    it('allows admin to login with valid credentials', function () {
        $response = $this->post(route('admin.login'), [
            'email' => 'admin@test.com',
            'password' => 'password123',
            'remember' => false,
        ]);

        $response->assertRedirect(route('admin.dashboard'));
        $this->assertAuthenticatedAs($this->admin, 'admin');
    });

    it('allows admin to login with remember me', function () {
        $response = $this->post(route('admin.login'), [
            'email' => 'admin@test.com',
            'password' => 'password123',
            'remember' => true,
        ]);

        $response->assertRedirect(route('admin.dashboard'));
        $this->assertAuthenticatedAs($this->admin, 'admin');
    });

    it('rejects login with invalid credentials', function () {
        $response = $this->post(route('admin.login'), [
            'email' => 'admin@test.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertSessionHasErrors(['email']);
        $this->assertGuest('admin');
    });

    it('rejects login with non-existent email', function () {
        $response = $this->post(route('admin.login'), [
            'email' => 'nonexistent@test.com',
            'password' => 'password123',
        ]);

        $response->assertSessionHasErrors(['email']);
        $this->assertGuest('admin');
    });

    it('rejects login with inactive admin account', function () {
        $inactiveAdmin = Admin::factory()->create([
            'email' => 'inactive@test.com',
            'password' => bcrypt('password123'),
            'is_active' => false,
        ]);

        $response = $this->post(route('admin.login'), [
            'email' => 'inactive@test.com',
            'password' => 'password123',
        ]);

        $response->assertSessionHasErrors(['email']);
        $this->assertGuest('admin');
    });

    it('validates required fields', function () {
        $response = $this->post(route('admin.login'), []);

        $response->assertSessionHasErrors(['email', 'password']);
    });

    it('validates email format', function () {
        $response = $this->post(route('admin.login'), [
            'email' => 'invalid-email',
            'password' => 'password123',
        ]);

        $response->assertSessionHasErrors(['email']);
    });

    it('implements rate limiting', function () {
        $key = 'admin-login:' . '127.0.0.1';
        
        // Make multiple failed attempts
        for ($i = 0; $i < 5; $i++) {
            $this->post(route('admin.login'), [
                'email' => 'admin@test.com',
                'password' => 'wrongpassword',
            ]);
        }

        // 6th attempt should be rate limited
        $response = $this->post(route('admin.login'), [
            'email' => 'admin@test.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertSessionHasErrors(['email']);
        expect(RateLimiter::tooManyAttempts($key, 5))->toBeTrue();
    });

    it('clears rate limiting on successful login', function () {
        $key = 'admin-login:' . '127.0.0.1';
        
        // Make some failed attempts
        for ($i = 0; $i < 3; $i++) {
            $this->post(route('admin.login'), [
                'email' => 'admin@test.com',
                'password' => 'wrongpassword',
            ]);
        }

        // Successful login should clear rate limiting
        $response = $this->post(route('admin.login'), [
            'email' => 'admin@test.com',
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('admin.dashboard'));
        expect(RateLimiter::tooManyAttempts($key, 5))->toBeFalse();
    });

    it('allows admin to logout', function () {
        $response = $this->actingAs($this->admin, 'admin')
            ->post(route('admin.logout'));

        $response->assertRedirect(route('admin.login'));
        $this->assertGuest('admin');
    });

    it('updates last login information on successful login', function () {
        $response = $this->post(route('admin.login'), [
            'email' => 'admin@test.com',
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('admin.dashboard'));
        
        $this->admin->refresh();
        expect($this->admin->last_login_at)->not->toBeNull();
        expect($this->admin->last_login_ip)->toBe('127.0.0.1');
    });
});
