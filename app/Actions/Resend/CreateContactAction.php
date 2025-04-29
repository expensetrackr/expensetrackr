<?php

declare(strict_types=1);

namespace App\Actions\Resend;

use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Log;
use Lorisleiva\Actions\Concerns\AsAction;
use Resend;

final readonly class CreateContactAction
{
    use AsAction;

    protected Resend\Client $resend;

    public function __construct()
    {
        $this->resend = Resend::client(type(config('services.resend.key'))->asString());
    }

    /**
     * Execute the action.
     */
    public function handle(User $user): void
    {
        try {
            $this->resend->contacts->create(type(config('services.resend.audience_id'))->asString(), [
                'id' => $user->id,
                'email' => $user->email,
                'first_name' => $user->name ? trim(strtok($user->name, ' ')) : '',
                'last_name' => $user->name ? trim(mb_substr($user->name, mb_strlen(strtok($user->name, ' ')))) : '',
                'unsubscribed' => false,
                'created_at' => now()->toString(),
            ]);
        } catch (Exception $e) {
            Log::error('Failed to create Resend contact for user', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
