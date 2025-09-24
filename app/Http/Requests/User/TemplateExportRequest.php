<?php

namespace App\Http\Requests\User;

use App\Http\Requests\FormRequest;

class TemplateExportRequest extends FormRequest
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
            'format' => 'required|string|in:mp4,webm',
            'quality' => 'required|string|in:low,medium,high',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'customizations.required' => 'Customizations are required.',
            'format.required' => 'Export format is required.',
            'format.in' => 'Export format must be mp4 or webm.',
            'quality.required' => 'Export quality is required.',
            'quality.in' => 'Export quality must be low, medium, or high.',
        ];
    }
}
