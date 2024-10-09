<?php

declare(strict_types=1);

namespace App\Providers;

use App\Actions\Workspaces\AddWorkspaceMember;
use App\Actions\Workspaces\CreateWorkspace;
use App\Actions\Workspaces\DeleteUser;
use App\Actions\Workspaces\DeleteWorkspace;
use App\Actions\Workspaces\InviteWorkspaceMember;
use App\Actions\Workspaces\RemoveWorkspaceMember;
use App\Actions\Workspaces\UpdateWorkspaceName;
use Illuminate\Support\ServiceProvider;
use Workspaces\Workspaces;

final class WorkspacesServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configurePermissions();

        Workspaces::createWorkspacesUsing(CreateWorkspace::class);
        Workspaces::updateWorkspaceNamesUsing(UpdateWorkspaceName::class);
        Workspaces::addWorkspaceMembersUsing(AddWorkspaceMember::class);
        Workspaces::inviteWorkspaceMembersUsing(InviteWorkspaceMember::class);
        Workspaces::removeWorkspaceMembersUsing(RemoveWorkspaceMember::class);
        Workspaces::deleteWorkspacesUsing(DeleteWorkspace::class);
        Workspaces::deleteUsersUsing(DeleteUser::class);
    }

    /**
     * Configure the roles and permissions that are available within the application.
     */
    private function configurePermissions(): void
    {
        Workspaces::defaultApiTokenPermissions(['read']);

        Workspaces::role('admin', 'Administrator', [
            'create',
            'read',
            'update',
            'delete',
        ])->description('Administrator users can perform any action.');

        Workspaces::role('editor', 'Editor', [
            'read',
            'create',
            'update',
        ])->description('Editor users have the ability to read, create, and update.');
    }
}
