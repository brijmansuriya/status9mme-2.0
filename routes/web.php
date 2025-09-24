<?php

use App\Http\Controllers\Admin\Auth\LoginController as AdminLoginController;
use App\Http\Controllers\Admin\Auth\LogoutController as AdminLogoutController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\TemplateController as AdminTemplateController;
use App\Http\Controllers\Admin\AssetController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\User\HomeController;
use App\Http\Controllers\User\TemplatesController;
use App\Http\Controllers\User\TemplateEditorController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/templates', [TemplatesController::class, 'index'])->name('templates');

// Template Editor routes for user customization
Route::get('/templates/{template:slug}/editor', [TemplateEditorController::class, 'show'])->name('templates.editor');
Route::post('/templates/{template:slug}/preview', [TemplateEditorController::class, 'preview'])->name('templates.preview');
Route::post('/templates/{template:slug}/export', [TemplateEditorController::class, 'export'])->name('templates.export');
Route::get('/exports/{jobId}/status', [TemplateEditorController::class, 'exportStatus'])->name('exports.status');

// Admin authentication routes (public)
Route::prefix('admin')->name('admin.')->group(function () {
    // Admin login routes
    Route::get('/login', [AdminLoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AdminLoginController::class, 'login']);
    Route::post('/logout', [AdminLogoutController::class, 'logout'])->name('logout');
    
    // Protected admin routes
    Route::middleware(['auth.admin'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        
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
