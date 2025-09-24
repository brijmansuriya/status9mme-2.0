<?php

/**
 * Admin Module Test Runner
 * 
 * This script provides an easy way to run all admin tests with different configurations.
 * Usage: php run-admin-tests.php [options]
 */

$options = getopt('', [
    'help',
    'coverage',
    'filter:',
    'group:',
    'stop-on-failure',
    'verbose',
    'parallel',
]);

if (isset($options['help'])) {
    showHelp();
    exit(0);
}

$testCommand = 'php artisan test tests/Feature/Admin/';

// Add coverage if requested
if (isset($options['coverage'])) {
    $testCommand .= ' --coverage';
}

// Add filter if specified
if (isset($options['filter'])) {
    $testCommand .= ' --filter="' . $options['filter'] . '"';
}

// Add group if specified
if (isset($options['group'])) {
    $testCommand .= ' --group=' . $options['group'];
}

// Add stop on failure if requested
if (isset($options['stop-on-failure'])) {
    $testCommand .= ' --stop-on-failure';
}

// Add verbose if requested
if (isset($options['verbose'])) {
    $testCommand .= ' -v';
}

// Add parallel if requested
if (isset($options['parallel'])) {
    $testCommand .= ' --parallel';
}

echo "🧪 Running Admin Module Tests...\n";
echo "Command: $testCommand\n\n";

// Run the tests
$exitCode = 0;
$output = [];
exec($testCommand . ' 2>&1', $output, $exitCode);

// Display output
foreach ($output as $line) {
    echo $line . "\n";
}

// Display summary
echo "\n" . str_repeat("=", 60) . "\n";
if ($exitCode === 0) {
    echo "✅ All admin tests passed!\n";
} else {
    echo "❌ Some admin tests failed.\n";
    echo "Exit code: $exitCode\n";
}

echo "\n📊 Test Summary:\n";
echo "- Authentication Tests: AdminAuthenticationTest.php\n";
echo "- Navigation Tests: AdminNavigationTest.php\n";
echo "- Categories CRUD Tests: CategoriesCRUDTest.php\n";
echo "- Templates CRUD Tests: TemplatesCRUDTest.php\n";
echo "- Authorization Tests: AdminAuthorizationTest.php\n";

exit($exitCode);

function showHelp()
{
    echo "Admin Module Test Runner\n\n";
    echo "Usage: php run-admin-tests.php [options]\n\n";
    echo "Options:\n";
    echo "  --help              Show this help message\n";
    echo "  --coverage          Run tests with coverage report\n";
    echo "  --filter=<pattern>  Filter tests by name pattern\n";
    echo "  --group=<group>     Run tests in specific group\n";
    echo "  --stop-on-failure   Stop on first failure\n";
    echo "  --verbose           Verbose output\n";
    echo "  --parallel          Run tests in parallel\n\n";
    echo "Examples:\n";
    echo "  php run-admin-tests.php\n";
    echo "  php run-admin-tests.php --coverage\n";
    echo "  php run-admin-tests.php --filter=\"Authentication\"\n";
    echo "  php run-admin-tests.php --group=crud --stop-on-failure\n";
    echo "  php run-admin-tests.php --parallel --verbose\n";
}
