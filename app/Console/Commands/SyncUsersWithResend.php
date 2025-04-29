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
        $syncedCount = 0;
        $users = User::all();
        $resend = Resend::client(type(config('services.resend.key'))->asString());
        $resendUsers = collect($resend->contacts->list(type(config('services.resend.audience_id'))->asString()));

        $this->output->progressStart(count($users));

        foreach ($users as $user) {
            $existingUser = $resendUsers->firstWhere('email', $user->email);

            if (empty($existingUser)) {
                $action->rateLimit();
                $action->handle($user);

                Log::info("Created Resend user: {$user->email}");
            }

            $this->output->progressAdvance();
            $syncedCount++;
        }

        $this->output->progressFinish();

        $this->info("{$syncedCount} users synced with Resend");
    }
}
