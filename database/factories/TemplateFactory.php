<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Template;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Template>
 */
class TemplateFactory extends Factory
{
    protected $model = Template::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->words(3, true);
        
        return [
            'category_id' => Category::factory(),
            'name' => ucwords($name),
            'slug' => \Illuminate\Support\Str::slug($name),
            'description' => $this->faker->sentence(),
            'json_config' => [
                'duration' => $this->faker->numberBetween(5, 30),
                'resolution' => '1080x1920',
                'background' => [
                    'type' => 'gradient',
                    'colors' => [$this->faker->hexColor(), $this->faker->hexColor()]
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
                    ]
                ]
            ],
            'thumbnail' => null,
            'preview_video' => null,
            'is_premium' => $this->faker->boolean(20), // 20% chance of being premium
            'is_active' => $this->faker->boolean(90), // 90% chance of being active
            'keywords' => $this->faker->words(5),
            'resolution' => '1080x1920',
            'duration' => $this->faker->numberBetween(5, 30),
            'downloads_count' => $this->faker->numberBetween(0, 1000),
            'views_count' => $this->faker->numberBetween(0, 5000),
            'rating' => $this->faker->randomFloat(2, 1, 5),
            'ratings_count' => $this->faker->numberBetween(0, 100),
        ];
    }

    /**
     * Indicate that the template is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the template is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the template is premium.
     */
    public function premium(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_premium' => true,
        ]);
    }

    /**
     * Indicate that the template is free.
     */
    public function free(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_premium' => false,
        ]);
    }

    /**
     * Create a template with high download count.
     */
    public function popular(): static
    {
        return $this->state(fn (array $attributes) => [
            'downloads_count' => $this->faker->numberBetween(500, 2000),
            'views_count' => $this->faker->numberBetween(2000, 10000),
            'rating' => $this->faker->randomFloat(2, 4, 5),
        ]);
    }

    /**
     * Create a template with specific category.
     */
    public function forCategory(Category $category): static
    {
        return $this->state(fn (array $attributes) => [
            'category_id' => $category->id,
        ]);
    }

    /**
     * Create a template with specific name.
     */
    public function withName(string $name): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => $name,
            'slug' => \Illuminate\Support\Str::slug($name),
        ]);
    }

    /**
     * Create a template with complex JSON configuration.
     */
    public function complex(): static
    {
        return $this->state(fn (array $attributes) => [
            'json_config' => [
                'duration' => 20,
                'resolution' => '1080x1920',
                'background' => [
                    'type' => 'gradient',
                    'colors' => ['#FF6B6B', '#4ECDC4']
                ],
                'layers' => [
                    [
                        'type' => 'text',
                        'content' => '{{name}}',
                        'position' => [540, 300],
                        'fontSize' => 52,
                        'color' => '#FFFFFF',
                        'fontFamily' => 'Arial',
                        'textAlign' => 'center',
                        'animation' => 'fadeInUp'
                    ],
                    [
                        'type' => 'text',
                        'content' => 'Happy Birthday!',
                        'position' => [540, 400],
                        'fontSize' => 36,
                        'color' => '#FFD93D',
                        'fontFamily' => 'Arial',
                        'textAlign' => 'center',
                        'animation' => 'bounce'
                    ],
                    [
                        'type' => 'image',
                        'placeholder' => 'user_photo',
                        'position' => [540, 600],
                        'size' => [200, 200],
                        'shape' => 'circle',
                        'animation' => 'scaleIn'
                    ],
                    [
                        'type' => 'lottie',
                        'placeholder' => 'celebration_animation',
                        'position' => [540, 800],
                        'size' => [300, 300],
                        'animation' => 'loop'
                    ]
                ]
            ],
        ]);
    }
}
