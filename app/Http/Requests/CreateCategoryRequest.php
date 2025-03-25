<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\CategoryClassification;
use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

final class CreateCategoryRequest extends FormRequest
{
    protected $errorBag = 'createCategory';

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', Category::class) ?? false;
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
            'slug' => ['required', 'string', 'max:255', 'unique:categories,slug'],
            'color' => ['required', 'hex_color'],
            'description' => ['nullable', 'string', 'max:255'],
            'classification' => ['required', 'string', Rule::enum(CategoryClassification::class)],
            'parent_id' => [
                'nullable',
                'exists:categories,id',
                'not_in:id',
                function ($attribute, $value, $fail): void {
                    if ($value) {
                        $parent = Category::find($value);
                        if ($parent && $parent->children()->exists()) {
                            $fail('Cannot set a parent category that already has children. Only two levels of nesting are allowed.');
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

        $this->merge([
            'slug' => Str::slug($this->name),
        ]);
    }
}
