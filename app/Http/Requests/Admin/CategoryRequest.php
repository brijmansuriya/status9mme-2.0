<?php
namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
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
        $categoryId = $this->route('category') ? $this->route('category')->id : null;

        return [
            'name'        => [
                'required',
                'string',
                'max:255',
                'min:2',
                Rule::unique('categories', 'name')->ignore($categoryId),
            ],
            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],
            'status'      => [
                'required',
                'string',
                'in:active,inactive',
            ],
            'sort_order'  => [
                'nullable',
                'integer',
                'min:0',
                'max:9999',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required'      => 'The category name is required.',
            'name.string'        => 'The category name must be a valid text.',
            'name.max'           => 'The category name may not be greater than 255 characters.',
            'name.min'           => 'The category name must be at least 2 characters.',
            'name.unique'        => 'A category with this name already exists.',

            'description.string' => 'The description must be a valid text.',
            'description.max'    => 'The description may not be greater than 1000 characters.',

            'status.required'    => 'The status is required.',
            'status.string'      => 'The status must be a valid text.',
            'status.in'          => 'The status must be either active or inactive.',

            'sort_order.integer' => 'The sort order must be a number.',
            'sort_order.min'     => 'The sort order must be at least 0.',
            'sort_order.max'     => 'The sort order may not be greater than 9999.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name'        => 'category name',
            'description' => 'description',
            'status'      => 'status',
            'sort_order'  => 'sort order',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'name'        => trim($this->name),
            'description' => $this->description ? trim($this->description) : null,
            'sort_order'  => $this->sort_order ? (int) $this->sort_order : 0,
        ]);
    }
}
