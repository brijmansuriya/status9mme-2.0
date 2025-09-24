<?php

namespace App\Http\Requests\User;

use App\Http\Requests\FormRequest;

class TemplatePreviewRequest extends FormRequest
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
            'customizations' => 'required|array',
            'customizations.*' => 'array',
            'customizations.*.content' => 'nullable|string|max:500',
            'customizations.*.fontSize' => 'nullable|numeric|min:8|max:200',
            'customizations.*.color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'customizations.*.fontFamily' => 'nullable|string|max:100',
            'customizations.*.textAlign' => 'nullable|string|in:left,center,right',
            'customizations.*.src' => 'nullable|string|max:500',
            'customizations.*.size' => 'nullable|array',
            'customizations.*.position' => 'nullable|array',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'customizations.required' => 'Customizations are required.',
            'customizations.*.content.max' => 'Text content cannot exceed 500 characters.',
            'customizations.*.fontSize.min' => 'Font size must be at least 8.',
            'customizations.*.fontSize.max' => 'Font size cannot exceed 200.',
            'customizations.*.color.regex' => 'Color must be a valid hex color code.',
        ];
    }
}
