<?php

declare(strict_types=1);

namespace App\Exceptions\Account;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class InsufficientBalanceException extends Exception
{
    /**
     * The current account balance.
     */
    private string $currentBalance;

    /**
     * The required balance amount.
     */
    private string $requiredAmount;

    /**
     * The account identifier.
     */
    private string $accountId;

    /**
     * Create a new InsufficientBalanceException instance.
     */
    public function __construct(
        string $accountId,
        string $currentBalance,
        string $requiredAmount,
        string $message = null,
        int $code = 422
    ) {
        $this->accountId = $accountId;
        $this->currentBalance = $currentBalance;
        $this->requiredAmount = $requiredAmount;
        
        $message = $message ?? $this->generateMessage();
        
        parent::__construct($message, $code);
    }

    /**
     * Generate a descriptive error message.
     */
    private function generateMessage(): string
    {
        return "Insufficient balance in account '{$this->accountId}'. " .
               "Current balance: {$this->currentBalance}, " .
               "Required amount: {$this->requiredAmount}.";
    }

    /**
     * Get the current account balance.
     */
    public function getCurrentBalance(): string
    {
        return $this->currentBalance;
    }

    /**
     * Get the required amount.
     */
    public function getRequiredAmount(): string
    {
        return $this->requiredAmount;
    }

    /**
     * Get the account identifier.
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
            'code' => 'INSUFFICIENT_BALANCE',
            'account_id' => $this->accountId,
            'current_balance' => $this->currentBalance,
            'required_amount' => $this->requiredAmount,
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
            'current_balance' => $this->currentBalance,
            'required_amount' => $this->requiredAmount,
            'user_id' => auth()->id(),
            'workspace_id' => auth()->user()?->current_workspace_id,
        ];
    }
}