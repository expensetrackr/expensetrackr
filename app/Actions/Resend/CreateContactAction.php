<?php

declare(strict_types=1);

namespace App\Actions\Resend;

use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Lorisleiva\Actions\Concerns\AsAction;
use Resend;
use RuntimeException;

final readonly class CreateContactAction
{
    use AsAction;

    protected Resend\Client $resend;

    public function __construct(?Resend\Client $resend = null)
    {
        $this->resend = $resend ?? resolve(Resend\Client::class);
    }

    /**
     * Rate limit Resend contact creation (1 call per second).
     */
    public static function rateLimit(): void
    {
        $key = 'resend-contact-create';
        $maxAttempts = 1;
        $decaySeconds = 1;
        while (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            usleep(250000); // Sleep for 250ms before checking again
        }
        RateLimiter::hit($key, $decaySeconds);
    }

    /**
     * Execute the action.
     */
    public function handle(User $user): void
    {
        self::rateLimit();

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
        } catch (Resend\Exceptions\ErrorException $e) {
            $message = $e->getMessage();
            $isRateLimit = str_contains($message, 'rate limit') || $e->getCode() === 429;

            if ($isRateLimit) {
                Log::warning('Rate limit reached when creating Resend contact', [
                    'user_id' => $user->id,
                    'error' => $message,
                ]);

                throw new RuntimeException("Rate limit reached when creating Resend contact: $message", 429, $e);
            }

            Log::error('Failed to create Resend contact for user', [
                'user_id' => $user->id,
                'error' => $message,
            ]);

            throw new RuntimeException("Failed to create Resend contact for user: $message", $e->getCode(), $e);
        } catch (Exception $e) {
            Log::error('Unexpected error creating Resend contact', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            throw new RuntimeException("Unexpected error creating Resend contact: {$e->getMessage()}", $e->getCode(), $e);
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
