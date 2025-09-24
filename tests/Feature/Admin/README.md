# Admin Module Test Suite

This comprehensive test suite covers the Admin module for the Laravel 12 + Inertia + React application, testing Authentication, Navigation, and CRUD operations for Templates & Categories.

## 🧪 Test Strategy

### Backend Testing
- **Framework**: Pest (preferred in Laravel 10+)
- **Database**: RefreshDatabase trait for clean state between tests
- **Authentication**: Laravel's `actingAs()` for admin guard authentication
- **File Uploads**: Laravel's `UploadedFile::fake()` for testing file operations

### Test Structure
- **Feature Tests**: Full HTTP request/response cycle testing
- **Inertia Testing**: Component and props validation
- **Database Testing**: CRUD operations and data integrity
- **File Upload Testing**: Thumbnail and video upload handling

## 📋 Test Coverage

### A. Authentication Tests (`AdminAuthenticationTest.php`)
- ✅ Login page loads correctly
- ✅ Valid credentials redirect to dashboard
- ✅ Invalid credentials show error messages
- ✅ Rate limiting protection (5 attempts per 5 minutes)
- ✅ Account deactivation handling
- ✅ Remember me functionality
- ✅ Logout functionality
- ✅ Last login tracking

### B. Navigation Tests (`AdminNavigationTest.php`)
- ✅ Dashboard loads with correct menu items
- ✅ Navigation links render correctly
- ✅ Templates and Categories pages load
- ✅ Create/Edit forms load with proper data
- ✅ Search and filtering parameters
- ✅ Pagination handling
- ✅ Navigation state preservation

### C. Categories CRUD Tests (`CategoriesCRUDTest.php`)
- ✅ **Index/Listing**: Display all categories with template counts
- ✅ **Search**: By name and description
- ✅ **Filtering**: By active status
- ✅ **Sorting**: By different fields (name, created_at, etc.)
- ✅ **Pagination**: Large datasets handling
- ✅ **Creation**: Valid data, validation, unique constraints
- ✅ **Viewing**: Category details with associated templates
- ✅ **Editing**: Update data, slug generation, validation
- ✅ **Deletion**: Safe deletion (prevents deletion with templates)
- ✅ **Bulk Operations**: Toggle active status for multiple categories
- ✅ **Permissions**: Role-based access control

### D. Templates CRUD Tests (`TemplatesCRUDTest.php`)
- ✅ **Index/Listing**: Display templates with category info
- ✅ **Creation**: Valid data, file uploads, validation
- ✅ **File Handling**: Thumbnail and preview video uploads
- ✅ **Viewing**: Template details with assets
- ✅ **Editing**: Update data, file replacements
- ✅ **Deletion**: Safe deletion with file cleanup
- ✅ **Bulk Operations**: Toggle active/premium status
- ✅ **Statistics**: Views, downloads, rating tracking
- ✅ **Permissions**: Role-based access control

### E. Authorization Tests (`AdminAuthorizationTest.php`)
- ✅ **Route Protection**: Unauthenticated user redirection
- ✅ **Guard Separation**: Admin vs User authentication
- ✅ **Role Permissions**: Super admin, admin, editor roles
- ✅ **CRUD Authorization**: Create, read, update, delete permissions
- ✅ **Permission System**: Specific permission checking
- ✅ **Session Management**: Separate sessions for different guards
- ✅ **Account Status**: Active/inactive admin handling
- ✅ **API Authorization**: JSON request handling
- ✅ **Cross-Guard Security**: Prevention of cross-guard access

## 🚀 Running Tests

### Run All Admin Tests
```bash
php artisan test tests/Feature/Admin/
```

### Run Specific Test Suites
```bash
# Authentication tests
php artisan test tests/Feature/Admin/AdminAuthenticationTest.php

# Navigation tests
php artisan test tests/Feature/Admin/AdminNavigationTest.php

# Categories CRUD tests
php artisan test tests/Feature/Admin/CategoriesCRUDTest.php

# Templates CRUD tests
php artisan test tests/Feature/Admin/TemplatesCRUDTest.php

# Authorization tests
php artisan test tests/Feature/Admin/AdminAuthorizationTest.php
```

### Run with Coverage
```bash
php artisan test tests/Feature/Admin/ --coverage
```

### Run Specific Test Cases
```bash
# Run specific test
php artisan test --filter="admin can create category"

# Run tests matching pattern
php artisan test --filter="Authentication"
```

## 🔧 Test Configuration

### Database Setup
Tests use `RefreshDatabase` trait which:
- Creates fresh database for each test
- Runs all migrations
- Seeds necessary data
- Cleans up after each test

### Authentication Setup
Each test file includes:
- Admin factory creation
- Super admin factory creation
- User factory creation (for cross-guard testing)
- Proper guard authentication

### File Upload Testing
Tests include:
- Fake file generation
- Storage disk mocking
- File validation testing
- File cleanup verification

## 📊 Test Data

### Admin Users
- **Super Admin**: Full permissions, can access all features
- **Admin**: Standard permissions, can manage templates and categories
- **Editor**: Limited permissions, can only view templates
- **Inactive Admin**: Deactivated account for testing restrictions

### Sample Data
- **Categories**: Various categories with different statuses
- **Templates**: Templates with different configurations and file uploads
- **Assets**: Media files for template associations

## 🛡️ Security Testing

### Authentication Security
- Rate limiting protection
- Account deactivation handling
- Session management
- Cross-guard security

### Authorization Security
- Role-based access control
- Permission-based restrictions
- Route protection
- API security

### Data Security
- Input validation
- File upload security
- SQL injection prevention
- XSS protection

## 📈 Coverage Goals

- **Authentication**: 100% coverage of login/logout flows
- **Navigation**: 100% coverage of all admin routes
- **CRUD Operations**: 100% coverage of all CRUD endpoints
- **Authorization**: 100% coverage of permission checks
- **Error Handling**: 100% coverage of error scenarios

## 🔍 Test Quality

### Best Practices
- Descriptive test names
- Clear test structure with beforeEach setup
- Comprehensive assertions
- Edge case coverage
- Performance considerations

### Assertions
- HTTP status codes
- Redirect responses
- Session data
- Database state
- Inertia component props
- File system state

## 🚨 Common Issues

### Database Issues
- Ensure migrations are up to date
- Check foreign key constraints
- Verify factory relationships

### Authentication Issues
- Ensure admin guard is properly configured
- Check middleware registration
- Verify route protection

### File Upload Issues
- Ensure storage disk is properly mocked
- Check file validation rules
- Verify file cleanup

## 📝 Maintenance

### Adding New Tests
1. Follow existing test structure
2. Use descriptive test names
3. Include proper setup in beforeEach
4. Add comprehensive assertions
5. Test both success and failure scenarios

### Updating Tests
1. Update when adding new features
2. Modify when changing business logic
3. Ensure all edge cases are covered
4. Maintain backward compatibility

This test suite provides comprehensive coverage of the Admin module, ensuring reliability, security, and maintainability of the admin functionality.
