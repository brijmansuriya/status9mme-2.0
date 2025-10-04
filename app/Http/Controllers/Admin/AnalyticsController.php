<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index()
    {
        $admin = auth()->guard('admin')->user();

        return Inertia::render('admin/analytics', [
            'admin' => $admin,
            'auth'  => [
                'user' => $admin,
            ],
        ]);
    }
}
