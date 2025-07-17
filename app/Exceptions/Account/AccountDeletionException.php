<?php

declare(strict_types=1);

namespace App\Exceptions\Account;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class AccountDeletionException extends Exception
{
    /**
     * The account identifier that couldn't be deleted.
     */
    private string $accountId;

    /**
     * The reason why the deletion failed.
     */
    private string $reason;

    /**
     * Additional context about the failure.
     */
    private array $context;

    /**
     * Create a new AccountDeletionException instance.
     */
    public function __construct(
        string $accountId,
        string $reason,
        array $context = [],
        ?string $message = null,
        int $code = 422
    ) {
        $this->accountId = $accountId;
        $this->reason = $reason;
        $this->context = $context;

        $message = $message ?? $this->generateMessage();

        parent::__construct($message, $code);
    }

    /**
     * Get the account identifier that couldn't be deleted.
     */
    public function getAccountId(): string
    {
        return $this->accountId;
    }

    /**
     * Get the reason for the deletion failure.
     */
    public function getReason(): string
    {
        return $this->reason;
    }

    /**
     * Get the additional context.
     */
    public function getContext(): array
    {
        return $this->context;
    }

    /**
     * Render the exception as an HTTP response.
     */
    public function render(Request $request): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $this->getMessage(),
            'code' => 'ACCOUNT_DELETION_FAILED',
            'account_id' => $this->accountId,
            'reason' => $this->reason,
            'context' => $this->context,
        ];

        // Add debug information in development
        if (app()->environment('local', 'testing')) {
            $response['debug'] = [
                'file' => $this->getFile(),
                'line' => $this->getLine(),
                'trace' => $this->getTraceAsString(),
            ];
        }

        return response()->json($response, $this->getCode());
    }

    /**
     * Get the exception context for logging.
     *
     * @return array<string, mixed>
     */
    public function context(): array
    {
        return [
            'account_id' => $this->accountId,
            'deletion_reason' => $this->reason,
            'deletion_context' => $this->context,
            'user_id' => auth()->id(),
            'workspace_id' => auth()->user()?->current_workspace_id,
        ];
    }

    /**
     * Generate a descriptive error message.
     */
    private function generateMessage(): string
    {
        $message = "Cannot delete account '{$this->accountId}': {$this->reason}";

        if (! empty($this->context)) {
            $contextString = implode(', ', array_map(
                fn ($key, $value) => "{$key}: {$value}",
                array_keys($this->context),
                array_values($this->context)
            ));
            $message .= " ({$contextString})";
        }

        return $message;
    }
}
