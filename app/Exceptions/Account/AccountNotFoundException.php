<?php

declare(strict_types=1);

namespace App\Exceptions\Account;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class AccountNotFoundException extends Exception
{
    /**
     * The account identifier that was not found.
     */
    private string $accountId;

    /**
     * Create a new AccountNotFoundException instance.
     */
    public function __construct(string $accountId, string $message = null, int $code = 404)
    {
        $this->accountId = $accountId;
        
        $message = $message ?? "Account with ID '{$accountId}' was not found.";
        
        parent::__construct($message, $code);
    }

    /**
     * Get the account identifier that was not found.
     */
    public function getAccountId(): string
    {
        return $this->accountId;
    }

    /**
     * Render the exception as an HTTP response.
     */
    public function render(Request $request): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $this->getMessage(),
            'code' => 'ACCOUNT_NOT_FOUND',
            'account_id' => $this->accountId,
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
            'user_id' => auth()->id(),
            'workspace_id' => auth()->user()?->current_workspace_id,
        ];
    }
}