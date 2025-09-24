<?php

use App\Models\Template;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->category = Category::factory()->create();
    $this->template = Template::factory()->create([
        'category_id' => $this->category->id,
        'json_config' => [
            'duration' => 15,
            'resolution' => '1080x1920',
            'layers' => [
                [
                    'type' => 'text',
                    'content' => '{{name}}',
                    'position' => ['x' => 100, 'y' => 100],
                    'size' => ['width' => 200, 'height' => 50],
                    'fontSize' => 24,
                    'color' => '#000000',
                    'fontFamily' => 'Arial',
                    'textAlign' => 'center'
                ]
            ]
        ]
    ]);
});

test('user can view template editor', function () {
    $this->get(route('templates.editor', $this->template))
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('Templates/Editor')
            ->has('template')
        );
});

test('user can generate preview with customizations', function () {
    $customizations = [
        'text_0' => [
            'content' => 'Hello World',
            'fontSize' => 30,
            'color' => '#ff0000',
        ]
    ];

    $this->post(route('templates.preview', $this->template), [
        'customizations' => $customizations
    ])
    ->assertStatus(200)
    ->assertJsonStructure([
        'config',
        'preview_url'
    ]);
});

test('user can export video with customizations', function () {
    $customizations = [
        'text_0' => [
            'content' => 'Custom Text',
            'fontSize' => 28,
            'color' => '#00ff00',
        ]
    ];

    $this->post(route('templates.export', $this->template), [
        'customizations' => $customizations,
        'format' => 'mp4',
        'quality' => 'high'
    ])
    ->assertStatus(200)
    ->assertJsonStructure([
        'job_id',
        'status',
        'download_url'
    ]);
});

test('export status endpoint works', function () {
    $jobId = 'test_job_123';
    
    $this->get(route('exports.status', $jobId))
        ->assertStatus(200)
        ->assertJsonStructure([
            'job_id',
            'status',
            'download_url',
            'progress'
        ]);
});
