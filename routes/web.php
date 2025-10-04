<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// User routes (read-only access)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    })->name('dashboard');

    // User-specific routes (read-only)
    Route::get('user/data', function () {
        return Inertia::render('user/data', [
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    })->name('user.data');

    Route::get('user/reports', function () {
        return Inertia::render('user/reports', [
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    })->name('user.reports');

    Route::get('user/analytics', function () {
        return Inertia::render('user/analytics', [
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    })->name('user.analytics');

    Route::get('user/help', function () {
        return Inertia::render('user/help', [
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    })->name('user.help');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
