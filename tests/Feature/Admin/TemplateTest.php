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

test('admin can view create template form', function () {
    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.templates.create'))
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('Admin/Templates/Create')
            ->has('categories')
        );
});

test('admin can view template details', function () {
    $template = Template::factory()->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.templates.show', $template))
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('Admin/Templates/Show')
            ->has('template')
            ->where('template.name', $template->name)
        );
});

test('admin can view edit template form', function () {
    $template = Template::factory()->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.templates.edit', $template))
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('Admin/Templates/Edit')
            ->has('template')
            ->has('categories')
            ->where('template.name', $template->name)
        );
});

test('template search functionality works', function () {
    Template::factory()->create(['name' => 'Design Template']);
    Template::factory()->create(['name' => 'Business Template']);
    Template::factory()->create(['name' => 'Creative Template']);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.templates.index', ['search' => 'Design']))
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->has('templates.data', 1)
            ->where('templates.data.0.name', 'Design Template')
        );
});

test('template filter by category works', function () {
    $category1 = Category::factory()->create(['name' => 'Category 1']);
    $category2 = Category::factory()->create(['name' => 'Category 2']);
    
    Template::factory()->create(['category_id' => $category1->id]);
    Template::factory()->create(['category_id' => $category2->id]);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.templates.index', ['category_id' => $category1->id]))
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->has('templates.data', 1)
        );
});

test('template filter by premium status works', function () {
    Template::factory()->create(['is_premium' => true]);
    Template::factory()->create(['is_premium' => false]);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.templates.index', ['is_premium' => '1']))
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->has('templates.data', 1)
        );
});

test('template filter by active status works', function () {
    Template::factory()->create(['is_active' => true]);
    Template::factory()->create(['is_active' => false]);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.templates.index', ['is_active' => '1']))
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->has('templates.data', 1)
        );
});

test('guest cannot access admin templates', function () {
    $this->get(route('admin.templates.index'))
        ->assertRedirect(route('admin.login'));
});

test('regular user cannot access admin templates', function () {
    $user = \App\Models\User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.templates.index'))
        ->assertRedirect(route('admin.login'));
});
