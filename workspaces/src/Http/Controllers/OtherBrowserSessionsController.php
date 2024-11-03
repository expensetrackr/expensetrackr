<?php

declare(strict_types=1);

namespace Workspaces\Http\Controllers;

use App\Models\User;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Actions\ConfirmPassword;

final class OtherBrowserSessionsController extends Controller
{
    /**
     * Log out from other browser sessions.
     */
    public function destroy(Request $request, StatefulGuard $guard): RedirectResponse
    {
        $confirmed = app(ConfirmPassword::class)(
            $guard, type($request->user())->as(User::class), type($request->password)->asString()
        );

        if (! $confirmed) {
            throw ValidationException::withMessages([
                'password' => __('The password is incorrect.'),
            ]);
        }

        $guard->logoutOtherDevices(type($request->password)->asString());

        $this->deleteOtherSessionRecords($request);

        return back(303);
    }

    /**
     * Delete the other browser session records from storage.
     *
     * @return void
     */
    protected function deleteOtherSessionRecords(Request $request)
    {
        if (config('session.driver') !== 'database') {
            return;
        }

        DB::connection(type(config('session.connection'))->asString())->table(type(config('session.table', 'sessions'))->asString())
            ->where('user_id', $request->user()?->getAuthIdentifier())
            ->where('id', '!=', $request->session()->getId())
            ->delete();
    }
}
