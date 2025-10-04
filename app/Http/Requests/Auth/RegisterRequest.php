<?php
namespace App\Http\Requests\Auth;

use App\Models\User;
use App\Rules\StrongPassword;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'     => [
                'required',
                'string',
                'max:255',
                'min:2',
                'regex:/^[a-zA-Z\s\'-]+$/', // Only letters, spaces, hyphens, and apostrophes
            ],
            'email'    => [
                'required',
                'string',
                'lowercase',
                'email:rfc,dns',
                'max:255',
                'unique:' . User::class,
            ],
            'password' => [
                'required',
                'confirmed',
                new StrongPassword(),
            ],
            'terms'    => ['required', 'accepted'],
        ];
    }

    /**
     * Get custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required'      => 'Your name is required.',
            'name.min'           => 'Your name must be at least 2 characters long.',
            'name.max'           => 'Your name cannot exceed 255 characters.',
            'name.regex'         => 'Your name can only contain letters, spaces, hyphens, and apostrophes.',

            'email.required'     => 'An email address is required.',
            'email.email'        => 'Please enter a valid email address.',
            'email.unique'       => 'This email address is already registered.',
            'email.lowercase'    => 'Email address must be in lowercase.',

            'password.required'  => 'A password is required.',
            'password.confirmed' => 'Password confirmation does not match.',
            'password.min'       => 'Password must be at least 8 characters long.',

            'terms.required'     => 'You must accept the terms and conditions.',
            'terms.accepted'     => 'You must accept the terms and conditions.',
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name'                  => 'full name',
            'email'                 => 'email address',
            'password'              => 'password',
            'password_confirmation' => 'password confirmation',
            'terms'                 => 'terms and conditions',
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Additional custom validation logic can be added here
            if ($this->input('password') && $this->input('email')) {
                // Check if password contains email
                if (str_contains(strtolower($this->input('password')), strtolower($this->input('email')))) {
                    $validator->errors()->add('password', 'Password cannot contain your email address.');
                }
            }
        });
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => strtolower($this->email),
            'name'  => trim($this->name),
        ]);
    }
}
