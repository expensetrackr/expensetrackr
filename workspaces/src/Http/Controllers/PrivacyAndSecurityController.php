<?php

declare(strict_types=1);

namespace Workspaces\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Response;
use Laravel\Fortify\Features;
use Workspaces\Agent;
use Workspaces\Workspaces;

final class PrivacyAndSecurityController extends Controller
{
    use Concerns\ConfirmsTwoFactorAuthentication;

    /**
     * Show the general profile settings screen.
     */
    public function show(Request $request): Response
    {
        $this->validateTwoFactorAuthenticationState($request);

        return Workspaces::inertia()->render($request, 'settings/privacy-and-security/show', [
            'confirmsTwoFactorAuthentication' => Features::optionEnabled(Features::twoFactorAuthentication(), 'confirm'),
            'sessions' => $this->sessions($request)->all(),
        ]);
    }

    /**
     * Get the current sessions.
     */
    // @phpstan-ignore-next-line This method is not type-safe because it uses the database session driver. Maybe we can check later the types.
    public function sessions(Request $request): Collection
    {
        if (config('session.driver') !== 'database') {
            return collect();
        }

        return DB::connection(type(config('session.connection'))->asString())->table(type(config('session.table', 'sessions'))->asString())
            ->where('user_id', $request->user()?->getAuthIdentifier())
            ->orderBy('last_activity', 'desc')
            ->get()->map(function ($session) use ($request) {
                $agent = $this->createAgent($session);

                return (object) [
                    'id' => $session->id, // @phpstan-ignore-line
                    'agent' => [
                        'is_desktop' => $agent->isDesktop(),
                        'platform' => $agent->platform(),
                        'browser' => $agent->browser(),
                    ],
                    'ip_address' => $session->ip_address, // @phpstan-ignore-line
                    'is_current_device' => $session->id === $request->session()->getId(), // @phpstan-ignore-line
                    'last_active' => Carbon::createFromTimestamp($session->last_activity)->diffForHumans(), // @phpstan-ignore-line
                ];
            });
    }

    /**
     * Create a new agent instance from the given session.
     */
    protected function createAgent(mixed $session): Agent
    {
        return tap(new Agent(), fn ($agent) => $agent->setUserAgent($session->user_agent)); // @phpstan-ignore-line
    }
}
