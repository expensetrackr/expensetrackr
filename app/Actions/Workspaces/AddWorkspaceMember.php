<?php

declare(strict_types=1);

namespace App\Actions\Workspaces;

use App\Models\User;
use App\Models\Workspace;
use Closure;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;
use Workspaces\Contracts\AddsWorkspaceMembers;
use Workspaces\Events\AddingWorkspaceMember;
use Workspaces\Events\WorkspaceMemberAdded;
use Workspaces\Rules\Role;
use Workspaces\Workspaces;

final class AddWorkspaceMember implements AddsWorkspaceMembers
{
    /**
     * Add a new workspace member to the given workspace.
     */
    public function add(User $user, Workspace $workspace, string $email, ?string $role = null): void
    {
        Gate::forUser($user)->authorize('addWorkspaceMember', $workspace);

        $this->validate($workspace, $email, $role);

        $newWorkspaceMember = Workspaces::findUserByEmailOrFail($email);

        AddingWorkspaceMember::dispatch($workspace, $newWorkspaceMember);

        $workspace->users()->attach(
            $newWorkspaceMember, ['role' => $role]
        );

        WorkspaceMemberAdded::dispatch($workspace, $newWorkspaceMember);
    }

    /**
     * Validate the add member operation.
     */
    private function validate(Workspace $workspace, string $email, ?string $role): void
    {
        Validator::make([
            'email' => $email,
            'role' => $role,
        ], $this->rules(), [
            'email.exists' => __('We were unable to find a registered user with this email address.'),
        ])->after(
            $this->ensureUserIsNotAlreadyOnWorkspace($workspace, $email)
        )->validateWithBag('addWorkspaceMember');
    }

    /**
     * Get the validation rules for adding a workspace member.
     *
     * @return array<string, array<int, string|Role>>
     */
    private function rules(): array
    {
        return array_filter([
            'email' => ['required', 'email', 'exists:users'],
            'role' => Workspaces::hasRoles()
                ? ['required', 'string', new Role]
                : null,
        ]);
    }

    /**
     * Ensure that the user is not already on the workspace.
     */
    private function ensureUserIsNotAlreadyOnWorkspace(Workspace $workspace, string $email): Closure
    {
        return function ($validator) use ($workspace, $email): void {
            $validator->errors()->addIf(
                $workspace->hasUserWithEmail($email),
                'email',
                __('This user already belongs to the workspace.')
            );
        };
    }
}
