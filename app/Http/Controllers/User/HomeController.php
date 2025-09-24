<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Template;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('templates')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();
            
        $featuredTemplates = Template::with('category')
            ->where('is_active', true)
            ->orderBy('downloads_count', 'desc')
            ->limit(8)
            ->get();
            
        $templates = Template::with('category')
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('Home', [
            'categories' => $categories,
            'featuredTemplates' => $featuredTemplates,
            'templates' => $templates,
        ]);
    }
}
