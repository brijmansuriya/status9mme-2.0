<?php

use App\Http\Controllers\TemplateController;
use App\Http\Controllers\VideoEditorController;
use App\Http\Controllers\Admin\Auth\LoginController as AdminLoginController;
use App\Http\Controllers\Admin\Auth\LogoutController as AdminLogoutController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\TemplateController as AdminTemplateController;
use App\Http\Controllers\Admin\AssetController;
use App\Models\Category;
use App\Models\Template;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    $categories = Category::withCount('templates')->where('is_active', true)->orderBy('sort_order')->get();
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
})->name('home');

Route::get('/templates', function () {
    $categories = Category::withCount('templates')->where('is_active', true)->orderBy('sort_order')->get();
    $templates = Template::with('category')
        ->where('is_active', true)
        ->orderBy('created_at', 'desc')
        ->get();
    
    return Inertia::render('Templates', [
        'categories' => $categories,
        'templates' => $templates,
    ]);
})->name('templates');

Route::get('/templates/{template:slug}', function (Template $template) {
    $template->load('category');
    return Inertia::render('VideoEditor', [
        'template' => $template,
    ]);
})->name('template.edit');

// Admin authentication routes (public)
Route::prefix('admin')->name('admin.')->group(function () {
    // Admin login routes
    Route::get('/login', [AdminLoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AdminLoginController::class, 'login']);
    Route::post('/logout', [AdminLogoutController::class, 'logout'])->name('logout');
    
    // Protected admin routes
    Route::middleware(['auth.admin'])->group(function () {
        Route::get('/dashboard', function () {
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
        })->name('dashboard');
        
        Route::resource('categories', CategoryController::class);
        Route::resource('templates', AdminTemplateController::class);
        Route::resource('assets', AssetController::class);
        
        // Additional asset routes
        Route::post('assets/{asset}/upload', [AssetController::class, 'uploadFile'])->name('assets.upload');
        Route::get('assets/{asset}/download', [AssetController::class, 'download'])->name('assets.download');
        Route::get('assets/{asset}/url/{conversion?}', [AssetController::class, 'url'])->name('assets.url');
    });
});

// User authentication routes (using Fortify)
// These are handled by Laravel Fortify in routes/auth.php

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
