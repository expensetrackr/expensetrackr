<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Actions\Resend\CreateContactAction;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

final class CreateResendContactJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 60;

    public function __construct(public int $userId) {}

    public function handle(CreateContactAction $action): void
    {
        $user = User::find($this->userId)->first();

        if ($user) {
            $action->handle($user);
        }
    }
}
