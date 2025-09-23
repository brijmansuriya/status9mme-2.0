# Authentication System - Video Status Maker

This document describes the complete authentication system for the Video Status Maker application, featuring separate authentication for Admin and User roles.

## 🔐 Authentication Overview

The application uses a **dual authentication system** with completely separated admin and user authentication:

- **Admin Authentication**: Separate login, session, and routes for administrators
- **User Authentication**: Regular user login/register using Laravel Fortify
- **Isolated Sessions**: Admin and user sessions are completely separate
- **Role-Based Access**: Different permissions and access levels

## 🏗️ Architecture

### Authentication Guards

```php
// config/auth.php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
    'admin' => [
        'driver' => 'session',
        'provider' => 'admins',
    ],
    'user' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
],
```

### User Providers

```php
'providers' => [
    'users' => [
        'driver' => 'eloquent',
        'model' => App\Models\User::class,
    ],
    'admins' => [
        'driver' => 'eloquent',
        'model' => App\Models\Admin::class,
    ],
],
```

## 👥 User Types

### 1. Admin Users (`admins` table)

**Purpose**: Manage the platform, templates, categories, and assets

**Features**:
- Separate login system
- Role-based permissions (admin, super_admin)
- Custom permissions system
- Activity tracking (last login, IP)
- Account status management

**Default Accounts**:
- **Super Admin**: `admin@videostatusmaker.com` / `admin123`
- **Manager**: `manager@videostatusmaker.com` / `manager123`
- **Editor**: `editor@videostatusmaker.com` / `editor123`

### 2. Regular Users (`users` table)

**Purpose**: Browse templates, create videos, and use the platform

**Features**:
- Standard Laravel Fortify authentication
- Email verification
- Two-factor authentication support
- Password reset functionality

## 🛡️ Middleware

### AdminAuth Middleware

```php
// Protects admin routes
Route::middleware(['auth.admin'])->group(function () {
    // Admin-only routes
});
```

**Features**:
- Checks admin authentication
- Validates admin is active
- Updates last login information
- Handles JSON responses for API calls

### UserAuth Middleware

```php
// Protects user routes
Route::middleware(['auth.user'])->group(function () {
    // User-only routes
});
```

**Features**:
- Checks user authentication
- Handles JSON responses for API calls

## 🛣️ Route Structure

### Admin Routes

```php
// Admin authentication (public)
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AdminLoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AdminLoginController::class, 'login']);
    Route::post('/logout', [AdminLogoutController::class, 'logout'])->name('logout');
    
    // Protected admin routes
    Route::middleware(['auth.admin'])->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::resource('categories', CategoryController::class);
        Route::resource('templates', TemplateController::class);
        Route::resource('assets', AssetController::class);
    });
});
```

### User Routes

```php
// User authentication handled by Laravel Fortify
// Routes defined in routes/auth.php
```

## 🔑 Admin Model Features

### Permissions System

```php
// Check specific permission
$admin->hasPermission('manage_templates');

// Check any of multiple permissions
$admin->hasAnyPermission(['manage_templates', 'manage_categories']);

// Check all permissions
$admin->hasAllPermissions(['manage_templates', 'manage_categories']);
```

### Role System

```php
// Check if super admin
$admin->isSuperAdmin();

// Check if active
$admin->isActive();

// Update last login
$admin->updateLastLogin($request->ip());
```

### Scopes

```php
// Get active admins
Admin::active()->get();

// Get admins by role
Admin::role('admin')->get();
```

## 🎨 Frontend Authentication

### Admin Login Page

**Location**: `/admin/login`
**Component**: `Admin/Auth/Login.tsx`

**Features**:
- Modern gradient design
- Email/password authentication
- Remember me functionality
- Rate limiting protection
- Error handling
- Responsive design

### User Authentication

**Handled by**: Laravel Fortify
**Components**: Standard Fortify components
**Features**: Registration, login, password reset, email verification

## 🔒 Security Features

### Rate Limiting

```php
// Admin login rate limiting
$key = 'admin-login:' . $request->ip();
if (RateLimiter::tooManyAttempts($key, 5)) {
    // Block for 5 minutes
}
```

### Session Management

- Separate sessions for admin and user
- Automatic session regeneration on login
- Secure logout with session invalidation

### Account Security

- Password hashing
- Account deactivation support
- Last login tracking
- IP address logging

## 📊 Database Schema

### Admins Table

```sql
CREATE TABLE admins (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    permissions JSON NULL,
    last_login_at TIMESTAMP NULL,
    last_login_ip VARCHAR(45) NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### Users Table

```sql
-- Standard Laravel users table with Fortify additions
-- Includes two-factor authentication fields
```

## 🚀 Usage Examples

### Protecting Admin Routes

```php
// In routes/web.php
Route::middleware(['auth.admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
    Route::resource('/admin/templates', TemplateController::class);
});
```

### Protecting User Routes

```php
// In routes/web.php
Route::middleware(['auth.user'])->group(function () {
    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::get('/user/videos', [UserController::class, 'videos']);
});
```

### Checking Authentication in Controllers

```php
// Admin controller
public function index()
{
    $admin = Auth::guard('admin')->user();
    
    if (!$admin->hasPermission('view_templates')) {
        abort(403, 'Insufficient permissions');
    }
    
    // Controller logic
}

// User controller
public function profile()
{
    $user = Auth::guard('user')->user();
    
    // Controller logic
}
```

### Checking Authentication in Blade/Inertia

```php
// In controller
return Inertia::render('Dashboard', [
    'isAdmin' => Auth::guard('admin')->check(),
    'isUser' => Auth::guard('user')->check(),
    'admin' => Auth::guard('admin')->user(),
    'user' => Auth::guard('user')->user(),
]);
```

## 🔧 Configuration

### Environment Variables

```env
# Default authentication guard
AUTH_GUARD=web

# Password reset tokens
AUTH_PASSWORD_RESET_TOKEN_TABLE=password_reset_tokens

# Password timeout (seconds)
AUTH_PASSWORD_TIMEOUT=10800
```

### Fortify Configuration

```php
// config/fortify.php
'features' => [
    Features::registration(),
    Features::resetPasswords(),
    Features::emailVerification(),
    Features::twoFactorAuthentication(),
],
```

## 🧪 Testing

### Admin Authentication Tests

```php
// Test admin login
public function test_admin_can_login()
{
    $admin = Admin::factory()->create();
    
    $response = $this->post('/admin/login', [
        'email' => $admin->email,
        'password' => 'password',
    ]);
    
    $response->assertRedirect('/admin/dashboard');
    $this->assertAuthenticated('admin');
}

// Test admin permissions
public function test_admin_requires_permission()
{
    $admin = Admin::factory()->create([
        'permissions' => ['manage_templates']
    ]);
    
    $this->actingAs($admin, 'admin');
    
    $this->assertTrue($admin->hasPermission('manage_templates'));
    $this->assertFalse($admin->hasPermission('manage_users'));
}
```

### User Authentication Tests

```php
// Test user login
public function test_user_can_login()
{
    $user = User::factory()->create();
    
    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);
    
    $response->assertRedirect('/dashboard');
    $this->assertAuthenticated('user');
}
```

## 🚨 Security Considerations

1. **Separate Sessions**: Admin and user sessions are completely isolated
2. **Rate Limiting**: Login attempts are rate limited to prevent brute force
3. **Account Status**: Admins can be deactivated without deleting accounts
4. **Permission System**: Granular permissions for different admin roles
5. **Activity Tracking**: Last login and IP tracking for security monitoring
6. **Session Security**: Automatic session regeneration and secure logout

## 📝 Best Practices

1. **Always use appropriate guards** when checking authentication
2. **Check permissions** before allowing admin actions
3. **Use middleware** to protect routes rather than manual checks
4. **Log security events** for monitoring and auditing
5. **Regular security updates** for authentication packages
6. **Test authentication flows** thoroughly

---

**Authentication System Status**: ✅ Complete and Production Ready
