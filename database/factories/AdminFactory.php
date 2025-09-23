<?php

namespace Database\Factories;

use App\Models\Admin;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Admin>
 */
class AdminFactory extends Factory
{
    protected $model = Admin::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => $this->faker->randomElement(['admin', 'super_admin']),
            'is_active' => $this->faker->boolean(90), // 90% chance of being active
            'permissions' => $this->faker->randomElements([
                'manage_templates',
                'manage_categories',
                'manage_assets',
                'manage_users',
                'view_analytics',
                'system_settings',
            ], $this->faker->numberBetween(2, 6)),
            'last_login_at' => $this->faker->optional(0.7)->dateTimeBetween('-30 days', 'now'),
            'last_login_ip' => $this->faker->optional(0.7)->ipv4(),
        ];
    }

    /**
     * Indicate that the admin is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the admin is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Create a super admin.
     */
    public function superAdmin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'super_admin',
            'permissions' => [
                'manage_templates',
                'manage_categories',
                'manage_assets',
                'manage_users',
                'view_analytics',
                'system_settings',
            ],
        ]);
    }

    /**
     * Create a regular admin.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
            'permissions' => [
                'manage_templates',
                'manage_categories',
                'manage_assets',
                'view_analytics',
            ],
        ]);
    }

    /**
     * Create an admin with specific permissions.
     */
    public function withPermissions(array $permissions): static
    {
        return $this->state(fn (array $attributes) => [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Create an admin with recent login.
     */
    public function recentlyActive(): static
    {
        return $this->state(fn (array $attributes) => [
            'last_login_at' => $this->faker->dateTimeBetween('-7 days', 'now'),
            'last_login_ip' => $this->faker->ipv4(),
        ]);
    }
}
