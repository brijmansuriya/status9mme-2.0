<?php

namespace App\Console\Commands;

use App\Models\Admin;
use App\Models\Category;
use App\Models\Template;
use Illuminate\Console\Command;

class CheckDatabaseStatus extends Command
{
    protected $signature = 'db:status';
    protected $description = 'Check database status and record counts';

    public function handle()
    {
        $this->info('Database Status Check');
        $this->line('==================');

        $categories = Category::count();
        $templates = Template::count();
        $admins = Admin::count();

        $this->info("Categories: {$categories}");
        $this->info("Templates: {$templates}");
        $this->info("Admins: {$admins}");

        if ($categories > 0) {
            $this->line("\nCategory Details:");
            Category::all()->each(function ($category) {
                $this->line("- {$category->name} ({$category->slug}) - Active: " . ($category->is_active ? 'Yes' : 'No'));
            });
        }

        if ($admins > 0) {
            $this->line("\nAdmin Details:");
            Admin::all()->each(function ($admin) {
                $this->line("- {$admin->name} ({$admin->email}) - Role: {$admin->role} - Active: " . ($admin->is_active ? 'Yes' : 'No'));
            });
        }

        $this->line("\nDatabase seeding completed successfully!");
    }
}
