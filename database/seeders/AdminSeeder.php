<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Admin::create([
            'name' => 'Super Admin',
            'email' => 'admin@admin.com',
            'email_verified_at' => now(),
            'password' => bcrypt('12345678'),
            'role' => 'super_admin',
        ]);

        \App\Models\Admin::create([
            'name' => 'Admin User',
            'email' => 'admin2@example.com',
            'email_verified_at' => now(),
            'password' => bcrypt('12345678'),
            'role' => 'admin',
        ]);
    }
}
