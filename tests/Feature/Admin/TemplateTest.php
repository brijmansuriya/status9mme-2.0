<?php

use App\Models\Template;
use App\Models\Category;
use App\Models\Admin;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = Admin::factory()->create();
    $this->category = Category::factory()->create();
});

test('admin can view templates index', function () {
    $template = Template::factory()->create();
    
    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.templates.index'))
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('Admin/Templates/Index')
            ->has('templates')
        );
});

test('admin can create template', function () {
    $templateData = [
        'category_id' => $this->category->id,
        'name' => 'Test Template',
        'description' => 'A test template',
        'json_config' => [
            'duration' => 15,
            'resolution' => '1080x1920',
            'layers' => [
                [
                    'type' => 'text',
                    'content' => 'Hello World',
                    'position' => ['x' => 100, 'y' => 100],
                    'size' => ['width' => 200, 'height' => 50],
                    'fontSize' => 24,
                    'color' => '#000000',
                    'fontFamily' => 'Arial',
                    'textAlign' => 'center'
                ]
            ]
        ],
        'is_premium' => false,
        'is_active' => true,
        'keywords' => ['test', 'template'],
        'resolution' => '1080x1920',
        'duration' => 15,
    ];

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.templates.store'), $templateData)
        ->assertRedirect(route('admin.templates.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('templates', [
        'name' => 'Test Template',
        'category_id' => $this->category->id,
    ]);
});

test('admin can update template', function () {
    $template = Template::factory()->create();
    
    $updateData = [
        'category_id' => $template->category_id,
        'name' => 'Updated Template',
        'description' => 'Updated description',
        'json_config' => $template->json_config,
        'is_premium' => true,
        'is_active' => true,
        'keywords' => ['updated'],
        'resolution' => '1080x1920',
        'duration' => 20,
    ];

    $this->actingAs($this->admin, 'admin')
        ->put(route('admin.templates.update', $template), $updateData)
        ->assertRedirect(route('admin.templates.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('templates', [
        'id' => $template->id,
        'name' => 'Updated Template',
        'is_premium' => true,
    ]);
});

test('admin can delete template', function () {
    $template = Template::factory()->create();

    $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.templates.destroy', $template))
        ->assertRedirect(route('admin.templates.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('templates', [
        'id' => $template->id,
    ]);
});

test('template validation works', function () {
    $invalidData = [
        'name' => '', // Required field missing
        'category_id' => 999, // Non-existent category
        'json_config' => 'invalid', // Should be array
    ];

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.templates.store'), $invalidData)
        ->assertSessionHasErrors(['name', 'category_id', 'json_config']);
});
