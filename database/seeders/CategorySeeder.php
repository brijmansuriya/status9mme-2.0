<?php
namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name'        => 'Technology',
                'description' => 'All technology-related items and services',
                'status'      => 'active',
                'sort_order'  => 1,
            ],
            [
                'name'        => 'Business',
                'description' => 'Business tools, services, and resources',
                'status'      => 'active',
                'sort_order'  => 2,
            ],
            [
                'name'        => 'Education',
                'description' => 'Educational content and learning resources',
                'status'      => 'active',
                'sort_order'  => 3,
            ],
            [
                'name'        => 'Health & Wellness',
                'description' => 'Health, fitness, and wellness related items',
                'status'      => 'active',
                'sort_order'  => 4,
            ],
            [
                'name'        => 'Entertainment',
                'description' => 'Entertainment and media content',
                'status'      => 'active',
                'sort_order'  => 5,
            ],
            [
                'name'        => 'Finance',
                'description' => 'Financial services and tools',
                'status'      => 'inactive',
                'sort_order'  => 6,
            ],
            [
                'name'        => 'Travel',
                'description' => 'Travel services and booking tools',
                'status'      => 'active',
                'sort_order'  => 7,
            ],
            [
                'name'        => 'Food & Dining',
                'description' => 'Food delivery, restaurants, and dining services',
                'status'      => 'active',
                'sort_order'  => 8,
            ],
        ];

        foreach ($categories as $categoryData) {
            Category::create($categoryData);
        }
    }
}
