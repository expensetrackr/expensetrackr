<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use App\Utilities\Workspaces\WorkspaceFeatures;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

final class ManageWorkspaceMemberRequest extends FormRequest
{
    /**
     * The workspace instance.
     */
    public Workspace $workspace;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, string|\Illuminate\Validation\Rules\Unique>>
     */
    public function rules(): array
    {
        $rules = [
            'email' => [
                'required',
                'email',
            ],
            'role' => ['required', 'string', 'exists:roles,name'],
        ];

        // Add conditional unique rule for invitations
        if (WorkspaceFeatures::sendsWorkspaceInvitations()) {
            $rules['email'][] = Rule::unique('workspace_invitations')->where(function (Builder $query): void {
                $query->where('workspace_id', $this->workspace->id);
            });
        } else {
            $rules['email'][] = Rule::unique(WorkspaceInvitation::class, 'email')->where('workspace_id', $this->workspace->id);
        }

        return $rules;
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $email = type($this->input('email'))->asString();

            if ($this->workspace->hasUserWithEmail($email)) {
                $validator->errors()->add(
                    'email',
                    __('This user already belongs to the workspace.')
                );
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.unique' => WorkspaceFeatures::sendsWorkspaceInvitations()
                ? __('This user has already been invited to the workspace.')
                : __('We were unable to find a registered user with this email address.'),
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var User|null */
        $user = $this->user();

        return $user !== null && $user->can('addWorkspaceMember', $this->workspace);
    }
}
