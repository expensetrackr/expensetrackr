<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\CategoryClassification;
use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

final class UpdateCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->category) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'color' => ['required', 'hex_color'],
            'description' => ['nullable', 'string', 'max:255'],
            'classification' => ['required', 'string', Rule::enum(CategoryClassification::class)],
            'parent_id' => [
                'nullable',
                'exists:categories,public_id',
                'not_in:public_id',
                function ($attribute, $value, $fail): void {
                    if ($value) {
                        // Get the current category being updated
                        $category = Category::wherePublicId($this->route('category'))->first();

                        // If this category has children, it cannot be assigned a parent
                        if ($category && $category->children()->exists()) {
                            $fail('Cannot assign a parent to this category because it already has children. Only two levels of nesting are allowed.');
                        }
                    }
                },
            ],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    public function prepareForValidation(): void
    {
        $input = $this->all();
        $snakeCaseInput = [];

        foreach ($input as $key => $value) {
            $snakeCaseInput[Str::snake($key)] = $value;
        }

        $this->replace($snakeCaseInput);
    }

    /**
     * Handle a failed authorization attempt.
     */
    protected function failedAuthorization(): RedirectResponse
    {
        return to_route('categories.index');
    }
}
