<?php

declare(strict_types=1);

namespace App\Exceptions\Account;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class InvalidAccountTypeException extends Exception
{
    /**
     * The invalid account type that was provided.
     */
    private string $providedType;

    /**
     * The valid account types.
     */
    private array $validTypes;

    /**
     * Create a new InvalidAccountTypeException instance.
     */
    public function __construct(string $providedType, array $validTypes = [], string $message = null, int $code = 422)
    {
        $this->providedType = $providedType;
        $this->validTypes = $validTypes;
        
        $message = $message ?? $this->generateMessage();
        
        parent::__construct($message, $code);
    }

    /**
     * Generate a descriptive error message.
     */
    private function generateMessage(): string
    {
        $message = "Invalid account type '{$this->providedType}' provided.";
        
        if (!empty($this->validTypes)) {
            $validTypesString = implode(', ', $this->validTypes);
            $message .= " Valid types are: {$validTypesString}.";
        }
        
        return $message;
    }

    /**
     * Get the provided account type.
     */
    public function getProvidedType(): string
    {
        return $this->providedType;
    }

    /**
     * Get the valid account types.
     */
    public function getValidTypes(): array
    {
        return $this->validTypes;
    }

    /**
     * Render the exception as an HTTP response.
     */
    public function render(Request $request): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $this->getMessage(),
            'code' => 'INVALID_ACCOUNT_TYPE',
            'provided_type' => $this->providedType,
            'valid_types' => $this->validTypes,
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
            'provided_type' => $this->providedType,
            'valid_types' => $this->validTypes,
            'user_id' => auth()->id(),
            'workspace_id' => auth()->user()?->current_workspace_id,
        ];
    }
}