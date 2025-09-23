<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create super admin
        Admin::firstOrCreate(
            ['email' => 'admin@videostatusmaker.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('admin123'),
                'role' => 'super_admin',
                'is_active' => true,
                'permissions' => [
                    'manage_templates',
                    'manage_categories',
                    'manage_assets',
                    'manage_users',
                    'view_analytics',
                    'system_settings',
                ],
            ]
        );

        // Create regular admin
        Admin::firstOrCreate(
            ['email' => 'manager@videostatusmaker.com'],
            [
                'name' => 'Content Manager',
                'password' => Hash::make('manager123'),
                'role' => 'admin',
                'is_active' => true,
                'permissions' => [
                    'manage_templates',
                    'manage_categories',
                    'manage_assets',
                    'view_analytics',
                ],
            ]
        );

        // Create content editor
        Admin::firstOrCreate(
            ['email' => 'editor@videostatusmaker.com'],
            [
                'name' => 'Content Editor',
                'password' => Hash::make('editor123'),
                'role' => 'admin',
                'is_active' => true,
                'permissions' => [
                    'manage_templates',
                    'manage_categories',
                ],
            ]
        );
    }
}
