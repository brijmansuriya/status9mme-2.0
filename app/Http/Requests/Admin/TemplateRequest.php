<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class TemplateRequest extends FormRequest
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
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'json_config' => 'required|array',
            'json_config.duration' => 'required|numeric|min:1|max:60',
            'json_config.layers' => 'required|array|min:1',
            'json_config.layers.*.type' => 'required|string|in:text,image,video,audio',
            'json_config.layers.*.content' => 'required_if:json_config.layers.*.type,text|string',
            'json_config.layers.*.position' => 'required|array',
            'json_config.layers.*.position.x' => 'required|numeric',
            'json_config.layers.*.position.y' => 'required|numeric',
            'json_config.layers.*.size' => 'required|array',
            'json_config.layers.*.size.width' => 'required|numeric|min:1',
            'json_config.layers.*.size.height' => 'required|numeric|min:1',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'preview_video' => 'nullable|file|mimes:mp4,webm,mov|max:10240',
            'is_premium' => 'boolean',
            'is_active' => 'boolean',
            'keywords' => 'nullable|array',
            'keywords.*' => 'string|max:50',
            'resolution' => 'required|string|in:1080x1920,1920x1080,1080x1080',
            'duration' => 'required|numeric|min:1|max:60',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'category_id.required' => 'Please select a category.',
            'name.required' => 'Template name is required.',
            'description.required' => 'Template description is required.',
            'json_config.required' => 'Template configuration is required.',
            'json_config.layers.min' => 'Template must have at least one layer.',
            'resolution.required' => 'Template resolution is required.',
            'duration.required' => 'Template duration is required.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Ensure keywords is an array
        if ($this->has('keywords') && is_string($this->keywords)) {
            $this->merge([
                'keywords' => array_filter(explode(',', $this->keywords))
            ]);
        }

        // Set default values
        $this->merge([
            'is_premium' => $this->boolean('is_premium', false),
            'is_active' => $this->boolean('is_active', true),
            'downloads_count' => 0,
            'views_count' => 0,
            'rating' => null,
            'ratings_count' => 0,
        ]);
    }
}
