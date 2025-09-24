<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Template;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'totalTemplates' => Template::count(),
            'totalCategories' => Category::count(),
            'totalDownloads' => Template::sum('downloads_count'),
            'totalViews' => Template::sum('views_count'),
            'recentTemplates' => Template::with('category')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(),
            'topCategories' => Category::withCount('templates')
                ->orderBy('templates_count', 'desc')
                ->limit(5)
                ->get(),
        ];
        
        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }
}
