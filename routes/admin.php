<?php

use App\Http\Controllers\Admin\AdminsController;
use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DatabaseController;
use App\Http\Controllers\Admin\ReportsController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\UsersController;
use Illuminate\Support\Facades\Route;

// Admin authentication routes
Route::prefix('admin')->name('admin.')->group(function () {
    // Login routes
    Route::get('login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->name('logout');

    // Protected admin routes
    Route::middleware(['admin'])->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('users', [UsersController::class, 'index'])->name('users');
        Route::get('analytics', [AnalyticsController::class, 'index'])->name('analytics');
        Route::get('reports', [ReportsController::class, 'index'])->name('reports');
        Route::get('settings', [SettingsController::class, 'index'])->name('settings');

        // Category management routes
        Route::resource('categories', CategoryController::class);
        Route::patch('categories/{category}/toggle-status', [CategoryController::class, 'toggleStatus'])->name('categories.toggle-status');

        // Test route for debugging
        Route::get('test-categories', function () {
            return response()->json([
                'message'          => 'Admin routes are working',
                'categories_count' => \App\Models\Category::count(),
                'admin_user'       => auth()->guard('admin')->user() ? auth()->guard('admin')->user()->name : 'Not authenticated',
            ]);
        })->name('test.categories');

        // Additional admin routes
        Route::get('admins', [AdminsController::class, 'index'])->name('admins');
        Route::get('database', [DatabaseController::class, 'index'])->name('database');
    });
});
