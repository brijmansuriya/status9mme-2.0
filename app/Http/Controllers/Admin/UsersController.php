<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class UsersController extends Controller
{
    public function index()
    {
        $admin = auth()->guard('admin')->user();

        return Inertia::render('admin/users', [
            'admin' => $admin,
            'auth'  => [
                'user' => $admin,
            ],
        ]);
    }
}
