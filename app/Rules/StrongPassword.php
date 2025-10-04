<?php
namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class StrongPassword implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Check minimum length
        if (strlen($value) < 8) {
            $fail('The :attribute must be at least 8 characters long.');
            return;
        }

        // Check for at least one uppercase letter
        if (! preg_match('/[A-Z]/', $value)) {
            $fail('The :attribute must contain at least one uppercase letter.');
            return;
        }

        // Check for at least one lowercase letter
        if (! preg_match('/[a-z]/', $value)) {
            $fail('The :attribute must contain at least one lowercase letter.');
            return;
        }

        // Check for at least one number
        if (! preg_match('/[0-9]/', $value)) {
            $fail('The :attribute must contain at least one number.');
            return;
        }

        // Check for at least one special character
        if (! preg_match('/[^A-Za-z0-9]/', $value)) {
            $fail('The :attribute must contain at least one special character.');
            return;
        }

        // Check for common weak passwords
        $commonPasswords = [
            'password', 'password123', '123456', '12345678', 'qwerty',
            'abc123', 'password1', 'admin', 'letmein', 'welcome',
            'monkey', '1234567890', 'password123', 'dragon', 'master',
        ];

        if (in_array(strtolower($value), $commonPasswords)) {
            $fail('The :attribute is too common. Please choose a more unique password.');
            return;
        }

        // Check for repeated characters (more than 3 in a row)
        if (preg_match('/(.)\1{3,}/', $value)) {
            $fail('The :attribute cannot contain more than 3 repeated characters in a row.');
            return;
        }
    }
}
