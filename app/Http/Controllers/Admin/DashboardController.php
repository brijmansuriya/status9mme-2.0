<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $admin = auth()->guard('admin')->user();

        return Inertia::render('admin/dashboard', [
            'admin' => $admin,
            'auth'  => [
                'user' => $admin, // Pass admin as user for sidebar compatibility
            ],
        ]);
    }
}
