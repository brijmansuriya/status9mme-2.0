<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
                'name' => 'Birthday',
                'slug' => 'birthday',
                'description' => 'Birthday celebration templates',
                'color' => '#FF6B6B',
                'icon' => 'cake',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Diwali',
                'slug' => 'diwali',
                'description' => 'Diwali festival templates',
                'color' => '#FFD93D',
                'icon' => 'sparkles',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'WhatsApp Status',
                'slug' => 'whatsapp-status',
                'description' => 'WhatsApp status video templates',
                'color' => '#25D366',
                'icon' => 'message-circle',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Instagram Reels',
                'slug' => 'instagram-reels',
                'description' => 'Instagram Reels video templates',
                'color' => '#E4405F',
                'icon' => 'video',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Quotes',
                'slug' => 'quotes',
                'description' => 'Inspirational and motivational quote templates',
                'color' => '#8B5CF6',
                'icon' => 'quote',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Anniversary',
                'slug' => 'anniversary',
                'description' => 'Anniversary celebration templates',
                'color' => '#F59E0B',
                'icon' => 'heart',
                'is_active' => true,
                'sort_order' => 6,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
