<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ReportsController extends Controller
{
    public function index()
    {
        $admin = auth()->guard('admin')->user();

        return Inertia::render('admin/reports', [
            'admin' => $admin,
            'auth'  => [
                'user' => $admin,
            ],
        ]);
    }
}
