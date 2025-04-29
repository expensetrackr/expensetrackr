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

    public function __construct(?Resend\Client $resend = null)
    {
        $this->resend = $resend ?? resolve(Resend\Client::class);
    }

    /**
     * Execute the action.
     */
    public function handle(User $user): bool
    {
        try {
            [$firstName, $lastName] = $this->parseNameComponents($user->name);
            $this->resend->contacts->create(type(config('services.resend.audience_id'))->asString(), [
                'id' => $user->id,
                'email' => $user->email,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'unsubscribed' => false,
                'created_at' => now()->toString(),
            ]);

            return true;
        } catch (Resend\Exceptions\ErrorException $e) {
            Log::error('Failed to create Resend contact for user', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        } catch (Exception $e) {
            Log::error('Unexpected error creating Resend contact', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Parse full name into first and last components.
     */
    private function parseNameComponents(?string $fullName): array
    {
        if (! $fullName) {
            return ['', ''];
        }

        $nameParts = explode(' ', $fullName, 2);
        $firstName = trim($nameParts[0]);
        $lastName = isset($nameParts[1]) ? trim($nameParts[1]) : '';

        return [$firstName, $lastName];
    }
}
