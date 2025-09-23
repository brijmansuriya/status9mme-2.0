<?php

namespace Database\Factories;

use App\Models\Asset;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Asset>
 */
class AssetFactory extends Factory
{
    protected $model = Asset::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $fileType = $this->faker->randomElement(['image', 'video', 'audio', 'lottie']);
        $name = $this->faker->words(2, true);
        
        return [
            'name' => ucwords($name),
            'original_name' => $this->faker->word() . $this->getFileExtension($fileType),
            'file_path' => 'assets/' . $this->faker->uuid() . $this->getFileExtension($fileType),
            'file_type' => $fileType,
            'mime_type' => $this->getMimeType($fileType),
            'file_size' => $this->faker->numberBetween(100000, 10000000), // 100KB to 10MB
            'metadata' => $this->getMetadata($fileType),
            'thumbnail' => $fileType === 'video' ? 'assets/thumbnails/' . $this->faker->uuid() . '.jpg' : null,
            'is_public' => $this->faker->boolean(80), // 80% chance of being public
        ];
    }

    /**
     * Get file extension based on file type.
     */
    private function getFileExtension(string $fileType): string
    {
        return match ($fileType) {
            'image' => '.' . $this->faker->randomElement(['jpg', 'png', 'gif', 'webp']),
            'video' => '.' . $this->faker->randomElement(['mp4', 'webm', 'mov']),
            'audio' => '.' . $this->faker->randomElement(['mp3', 'wav', 'm4a']),
            'lottie' => '.json',
            default => '.bin',
        };
    }

    /**
     * Get MIME type based on file type.
     */
    private function getMimeType(string $fileType): string
    {
        return match ($fileType) {
            'image' => 'image/' . $this->faker->randomElement(['jpeg', 'png', 'gif', 'webp']),
            'video' => 'video/' . $this->faker->randomElement(['mp4', 'webm', 'quicktime']),
            'audio' => 'audio/' . $this->faker->randomElement(['mpeg', 'wav', 'mp4']),
            'lottie' => 'application/json',
            default => 'application/octet-stream',
        };
    }

    /**
     * Get metadata based on file type.
     */
    private function getMetadata(string $fileType): array
    {
        return match ($fileType) {
            'image' => [
                'width' => $this->faker->randomElement([800, 1080, 1920]),
                'height' => $this->faker->randomElement([600, 1080, 1920]),
                'format' => $this->faker->randomElement(['jpeg', 'png', 'gif', 'webp']),
                'quality' => $this->faker->numberBetween(70, 100),
                'color_space' => 'sRGB',
            ],
            'video' => [
                'width' => $this->faker->randomElement([720, 1080, 1920]),
                'height' => $this->faker->randomElement([480, 1080, 1920]),
                'duration' => $this->faker->randomFloat(2, 1, 60),
                'fps' => $this->faker->randomElement([24, 30, 60]),
                'codec' => $this->faker->randomElement(['h264', 'h265', 'vp9']),
                'bitrate' => $this->faker->numberBetween(1000000, 10000000),
            ],
            'audio' => [
                'duration' => $this->faker->randomFloat(2, 5, 300),
                'bitrate' => $this->faker->randomElement([128, 192, 320]),
                'sample_rate' => $this->faker->randomElement([44100, 48000, 96000]),
                'channels' => $this->faker->randomElement([1, 2, 6]),
                'format' => $this->faker->randomElement(['mp3', 'wav', 'aac']),
            ],
            'lottie' => [
                'version' => '5.7.4',
                'frame_rate' => $this->faker->randomElement([24, 30, 60]),
                'duration' => $this->faker->randomFloat(2, 1, 10),
                'width' => $this->faker->randomElement([200, 400, 800]),
                'height' => $this->faker->randomElement([200, 400, 800]),
                'total_frames' => $this->faker->numberBetween(30, 300),
            ],
            default => [],
        };
    }

    /**
     * Indicate that the asset is public.
     */
    public function public(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_public' => true,
        ]);
    }

    /**
     * Indicate that the asset is private.
     */
    public function private(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_public' => false,
        ]);
    }

    /**
     * Create an image asset.
     */
    public function image(): static
    {
        return $this->state(fn (array $attributes) => [
            'file_type' => 'image',
            'mime_type' => 'image/jpeg',
            'metadata' => [
                'width' => 1920,
                'height' => 1080,
                'format' => 'jpeg',
                'quality' => 90,
                'color_space' => 'sRGB',
            ],
        ]);
    }

    /**
     * Create a video asset.
     */
    public function video(): static
    {
        return $this->state(fn (array $attributes) => [
            'file_type' => 'video',
            'mime_type' => 'video/mp4',
            'metadata' => [
                'width' => 1920,
                'height' => 1080,
                'duration' => 15.5,
                'fps' => 30,
                'codec' => 'h264',
                'bitrate' => 5000000,
            ],
            'thumbnail' => 'assets/thumbnails/' . $this->faker->uuid() . '.jpg',
        ]);
    }

    /**
     * Create an audio asset.
     */
    public function audio(): static
    {
        return $this->state(fn (array $attributes) => [
            'file_type' => 'audio',
            'mime_type' => 'audio/mpeg',
            'metadata' => [
                'duration' => 30.0,
                'bitrate' => 320,
                'sample_rate' => 44100,
                'channels' => 2,
                'format' => 'mp3',
            ],
        ]);
    }

    /**
     * Create a Lottie animation asset.
     */
    public function lottie(): static
    {
        return $this->state(fn (array $attributes) => [
            'file_type' => 'lottie',
            'mime_type' => 'application/json',
            'metadata' => [
                'version' => '5.7.4',
                'frame_rate' => 30,
                'duration' => 3.0,
                'width' => 400,
                'height' => 400,
                'total_frames' => 90,
            ],
        ]);
    }

    /**
     * Create a large file asset.
     */
    public function large(): static
    {
        return $this->state(fn (array $attributes) => [
            'file_size' => $this->faker->numberBetween(50000000, 100000000), // 50MB to 100MB
        ]);
    }

    /**
     * Create a small file asset.
     */
    public function small(): static
    {
        return $this->state(fn (array $attributes) => [
            'file_size' => $this->faker->numberBetween(1000, 100000), // 1KB to 100KB
        ]);
    }
}
