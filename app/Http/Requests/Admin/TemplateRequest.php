<?php
namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TemplateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->guard('admin')->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $templateId = $this->route('template') ? $this->route('template')->id : null;

        return [
            'name'                => [
                'required',
                'string',
                'max:255',
                Rule::unique('templates', 'name')->ignore($templateId),
            ],
            'description'         => 'nullable|string|max:1000',
            'json_layout'         => 'required|array',
            'json_layout.version' => 'required|string',
            'json_layout.objects' => 'required|array',
            'thumbnail_url'       => 'nullable|string|max:500',
            'category'            => [
                'required',
                'string',
                'max:100',
                Rule::in([
                    'birthday',
                    'wedding',
                    'festival',
                    'quotes',
                    'anniversary',
                    'graduation',
                    'holiday',
                    'business',
                    'social',
                    'general',
                ]),
            ],
            'tags'                => 'nullable|array',
            'tags.*'              => 'string|max:50',
            'version'             => 'nullable|integer|min:1',
            'status'              => [
                'required',
                Rule::in(['draft', 'published', 'archived']),
            ],
            'is_default'          => 'boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required'                => 'Template name is required.',
            'name.unique'                  => 'A template with this name already exists.',
            'name.max'                     => 'Template name cannot exceed 255 characters.',
            'description.max'              => 'Description cannot exceed 1000 characters.',
            'json_layout.required'         => 'Template layout is required.',
            'json_layout.array'            => 'Template layout must be a valid JSON structure.',
            'json_layout.version.required' => 'Template layout version is required.',
            'json_layout.objects.required' => 'Template must contain at least one object.',
            'json_layout.objects.array'    => 'Template objects must be an array.',
            'thumbnail_url.max'            => 'Thumbnail URL cannot exceed 500 characters.',
            'category.required'            => 'Template category is required.',
            'category.in'                  => 'Invalid template category selected.',
            'tags.array'                   => 'Tags must be an array.',
            'tags.*.string'                => 'Each tag must be a string.',
            'tags.*.max'                   => 'Each tag cannot exceed 50 characters.',
            'version.integer'              => 'Version must be a number.',
            'version.min'                  => 'Version must be at least 1.',
            'status.required'              => 'Template status is required.',
            'status.in'                    => 'Invalid template status selected.',
            'is_default.boolean'           => 'Default flag must be true or false.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Ensure tags is always an array
        if ($this->has('tags') && is_string($this->tags)) {
            $this->merge([
                'tags' => array_filter(explode(',', $this->tags)),
            ]);
        }

        // Set default values
        $this->merge([
            'created_by' => auth()->guard('admin')->id(),
            'version'    => $this->version ?? 1,
            'is_default' => $this->boolean('is_default', false),
        ]);
    }
}
