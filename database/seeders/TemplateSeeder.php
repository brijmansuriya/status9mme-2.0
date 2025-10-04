<?php
namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Template;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first admin user
        $admin = Admin::first();

        if (! $admin) {
            $this->command->error('No admin user found. Please create an admin user first.');
            return;
        }

        $templates = [
            [
                'name'        => 'Happy Birthday Template',
                'description' => 'A colorful birthday celebration template with balloons and confetti',
                'category'    => 'birthday',
                'tags'        => ['celebration', 'colorful', 'fun'],
                'status'      => 'published',
                'is_default'  => true,
                'json_layout' => [
                    'version'    => '5.3.0',
                    'objects'    => [
                        [
                            'type'       => 'text',
                            'text'       => 'Happy Birthday!',
                            'fontSize'   => 72,
                            'fontFamily' => 'Arial',
                            'fill'       => '#FF6B6B',
                            'x'          => 100,
                            'y'          => 150,
                            'width'      => 400,
                            'height'     => 80,
                        ],
                        [
                            'type'       => 'text',
                            'text'       => 'Wishing you a wonderful day!',
                            'fontSize'   => 32,
                            'fontFamily' => 'Arial',
                            'fill'       => '#4ECDC4',
                            'x'          => 150,
                            'y'          => 250,
                            'width'      => 300,
                            'height'     => 40,
                        ],
                    ],
                    'background' => [
                        'type'  => 'color',
                        'color' => '#FFF8E7',
                    ],
                ],
            ],
            [
                'name'        => 'Wedding Invitation Template',
                'description' => 'Elegant wedding invitation with floral design',
                'category'    => 'wedding',
                'tags'        => ['elegant', 'romantic', 'formal'],
                'status'      => 'published',
                'is_default'  => true,
                'json_layout' => [
                    'version'    => '5.3.0',
                    'objects'    => [
                        [
                            'type'       => 'text',
                            'text'       => 'You are cordially invited',
                            'fontSize'   => 24,
                            'fontFamily' => 'Times New Roman',
                            'fill'       => '#8B4513',
                            'x'          => 200,
                            'y'          => 100,
                            'width'      => 200,
                            'height'     => 30,
                        ],
                        [
                            'type'       => 'text',
                            'text'       => 'Sarah & John',
                            'fontSize'   => 48,
                            'fontFamily' => 'Times New Roman',
                            'fill'       => '#8B4513',
                            'x'          => 150,
                            'y'          => 150,
                            'width'      => 300,
                            'height'     => 60,
                        ],
                        [
                            'type'       => 'text',
                            'text'       => 'June 15, 2024',
                            'fontSize'   => 28,
                            'fontFamily' => 'Times New Roman',
                            'fill'       => '#8B4513',
                            'x'          => 220,
                            'y'          => 230,
                            'width'      => 160,
                            'height'     => 35,
                        ],
                    ],
                    'background' => [
                        'type'  => 'color',
                        'color' => '#FFF8F0',
                    ],
                ],
            ],
            [
                'name'        => 'Business Presentation Template',
                'description' => 'Professional business presentation template',
                'category'    => 'business',
                'tags'        => ['professional', 'corporate', 'clean'],
                'status'      => 'published',
                'is_default'  => true,
                'json_layout' => [
                    'version'    => '5.3.0',
                    'objects'    => [
                        [
                            'type'       => 'text',
                            'text'       => 'Company Name',
                            'fontSize'   => 36,
                            'fontFamily' => 'Helvetica',
                            'fill'       => '#2C3E50',
                            'x'          => 200,
                            'y'          => 100,
                            'width'      => 200,
                            'height'     => 45,
                        ],
                        [
                            'type'       => 'text',
                            'text'       => 'Your Presentation Title',
                            'fontSize'   => 28,
                            'fontFamily' => 'Helvetica',
                            'fill'       => '#34495E',
                            'x'          => 150,
                            'y'          => 180,
                            'width'      => 300,
                            'height'     => 35,
                        ],
                        [
                            'type'       => 'text',
                            'text'       => 'Presented by: Your Name',
                            'fontSize'   => 18,
                            'fontFamily' => 'Helvetica',
                            'fill'       => '#7F8C8D',
                            'x'          => 200,
                            'y'          => 250,
                            'width'      => 200,
                            'height'     => 25,
                        ],
                    ],
                    'background' => [
                        'type'  => 'color',
                        'color' => '#FFFFFF',
                    ],
                ],
            ],
            [
                'name'        => 'Festival Celebration Template',
                'description' => 'Vibrant festival celebration template',
                'category'    => 'festival',
                'tags'        => ['vibrant', 'celebration', 'colorful'],
                'status'      => 'published',
                'is_default'  => true,
                'json_layout' => [
                    'version'    => '5.3.0',
                    'objects'    => [
                        [
                            'type'       => 'text',
                            'text'       => 'Festival 2024',
                            'fontSize'   => 64,
                            'fontFamily' => 'Arial',
                            'fill'       => '#E74C3C',
                            'x'          => 120,
                            'y'          => 120,
                            'width'      => 360,
                            'height'     => 80,
                        ],
                        [
                            'type'       => 'text',
                            'text'       => 'Join us for an amazing celebration!',
                            'fontSize'   => 24,
                            'fontFamily' => 'Arial',
                            'fill'       => '#F39C12',
                            'x'          => 100,
                            'y'          => 220,
                            'width'      => 400,
                            'height'     => 30,
                        ],
                    ],
                    'background' => [
                        'type'  => 'color',
                        'color' => '#FEF9E7',
                    ],
                ],
            ],
        ];

        foreach ($templates as $templateData) {
            Template::create([
                'name'        => $templateData['name'],
                'slug'        => \Illuminate\Support\Str::slug($templateData['name']),
                'description' => $templateData['description'],
                'category'    => $templateData['category'],
                'tags'        => $templateData['tags'],
                'status'      => $templateData['status'],
                'is_default'  => $templateData['is_default'],
                'json_layout' => $templateData['json_layout'],
                'created_by'  => $admin->id,
                'version'     => 1,
            ]);
        }

        $this->command->info('Default templates created successfully!');
    }
}
