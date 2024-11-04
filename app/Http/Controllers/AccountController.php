<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;
use Workspaces\Workspaces;

final class AccountController extends Controller
{
    /**
     * Display all accounts.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Account::class);

        return Workspaces::inertia()->render($request, 'accounts/index');
    }

    /**
     * Create a new account.
     */
    public function create(Request $request): Response
    {
        Gate::authorize('create', Account::class);

        return Workspaces::inertia()->render($request, 'accounts/create/index');
    }
}
