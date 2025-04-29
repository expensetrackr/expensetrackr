<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Actions\Resend\CreateContactAction;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Resend;

final class SyncUsersWithResend extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:sync-with-resend';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync users with Resend';

    /**
     * Execute the console command.
     */
    public function handle(CreateContactAction $action)
    {
        $users = User::all();
        $resend = Resend::client(type(config('services.resend.key'))->asString());
        $resendUsers = collect($resend->contacts->list(type(config('services.resend.audience_id'))->asString()));

        foreach ($users as $user) {
            $existingUser = $resendUsers->firstWhere('email', $user->email);

            if (empty($existingUser)) {
                $action->handle($user);

                Log::info("Created Resend user: {$user->email}");
                sleep(1);
            }

        }

        Log::info('Users synced with Resend');
    }
}
