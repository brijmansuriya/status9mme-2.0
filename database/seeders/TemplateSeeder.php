<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Template;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $birthdayCategory = Category::where('slug', 'birthday')->first();
        $diwaliCategory = Category::where('slug', 'diwali')->first();
        $whatsappCategory = Category::where('slug', 'whatsapp-status')->first();
        $quotesCategory = Category::where('slug', 'quotes')->first();

        $templates = [
            [
                'category_id' => $birthdayCategory->id,
                'name' => 'Happy Birthday Celebration',
                'slug' => 'happy-birthday-celebration',
                'description' => 'A vibrant birthday template with confetti and balloons',
                'json_config' => [
                    'duration' => 15,
                    'resolution' => '1080x1920',
                    'background' => [
                        'type' => 'gradient',
                        'colors' => ['#FF6B6B', '#4ECDC4']
                    ],
                    'layers' => [
                        [
                            'type' => 'text',
                            'content' => '{{name}}',
                            'position' => [540, 400],
                            'fontSize' => 48,
                            'color' => '#FFFFFF',
                            'fontFamily' => 'Arial',
                            'textAlign' => 'center',
                            'animation' => 'fadeInUp'
                        ],
                        [
                            'type' => 'text',
                            'content' => 'Happy Birthday!',
                            'position' => [540, 500],
                            'fontSize' => 36,
                            'color' => '#FFD93D',
                            'fontFamily' => 'Arial',
                            'textAlign' => 'center',
                            'animation' => 'bounce'
                        ],
                        [
                            'type' => 'image',
                            'placeholder' => 'user_photo',
                            'position' => [540, 700],
                            'size' => [200, 200],
                            'shape' => 'circle',
                            'animation' => 'scaleIn'
                        ]
                    ]
                ],
                'is_premium' => false,
                'is_active' => true,
                'keywords' => ['birthday', 'celebration', 'party', 'happy'],
                'resolution' => '1080x1920',
                'duration' => 15,
            ],
            [
                'category_id' => $diwaliCategory->id,
                'name' => 'Diwali Festival Lights',
                'slug' => 'diwali-festival-lights',
                'description' => 'Beautiful Diwali template with traditional lights and decorations',
                'json_config' => [
                    'duration' => 20,
                    'resolution' => '1080x1920',
                    'background' => [
                        'type' => 'gradient',
                        'colors' => ['#1a1a2e', '#16213e']
                    ],
                    'layers' => [
                        [
                            'type' => 'text',
                            'content' => 'Happy Diwali',
                            'position' => [540, 300],
                            'fontSize' => 52,
                            'color' => '#FFD93D',
                            'fontFamily' => 'serif',
                            'textAlign' => 'center',
                            'animation' => 'glow'
                        ],
                        [
                            'type' => 'text',
                            'content' => '{{greeting}}',
                            'position' => [540, 400],
                            'fontSize' => 32,
                            'color' => '#FFFFFF',
                            'fontFamily' => 'serif',
                            'textAlign' => 'center',
                            'animation' => 'fadeIn'
                        ],
                        [
                            'type' => 'lottie',
                            'placeholder' => 'diwali_lights',
                            'position' => [540, 600],
                            'size' => [400, 400],
                            'animation' => 'loop'
                        ]
                    ]
                ],
                'is_premium' => false,
                'is_active' => true,
                'keywords' => ['diwali', 'festival', 'lights', 'celebration', 'india'],
                'resolution' => '1080x1920',
                'duration' => 20,
            ],
            [
                'category_id' => $whatsappCategory->id,
                'name' => 'Motivational Quote Status',
                'slug' => 'motivational-quote-status',
                'description' => 'Inspirational quote template for WhatsApp status',
                'json_config' => [
                    'duration' => 10,
                    'resolution' => '1080x1920',
                    'background' => [
                        'type' => 'image',
                        'src' => '/assets/backgrounds/quote-bg.jpg'
                    ],
                    'layers' => [
                        [
                            'type' => 'text',
                            'content' => '{{quote}}',
                            'position' => [540, 400],
                            'fontSize' => 28,
                            'color' => '#FFFFFF',
                            'fontFamily' => 'Arial',
                            'textAlign' => 'center',
                            'animation' => 'typewriter',
                            'maxWidth' => 800
                        ],
                        [
                            'type' => 'text',
                            'content' => '- {{author}}',
                            'position' => [540, 600],
                            'fontSize' => 20,
                            'color' => '#CCCCCC',
                            'fontFamily' => 'Arial',
                            'textAlign' => 'center',
                            'animation' => 'fadeIn'
                        ]
                    ]
                ],
                'is_premium' => false,
                'is_active' => true,
                'keywords' => ['motivation', 'quote', 'inspiration', 'whatsapp', 'status'],
                'resolution' => '1080x1920',
                'duration' => 10,
            ],
        ];

        foreach ($templates as $template) {
            Template::create($template);
        }
    }
}
