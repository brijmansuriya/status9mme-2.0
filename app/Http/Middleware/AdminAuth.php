<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::guard('admin')->check()) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
            
            return redirect()->route('admin.login');
        }

        $admin = Auth::guard('admin')->user();
        
        // Check if admin is active
        if (!$admin->isActive()) {
            Auth::guard('admin')->logout();
            
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Account deactivated'], 403);
            }
            
            return redirect()->route('admin.login')->with('error', 'Your account has been deactivated.');
        }

        // Update last login
        $admin->updateLastLogin($request->ip());

        return $next($request);
    }
}
