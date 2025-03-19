<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;
use Throwable;

final class ProviderErrorException extends Exception
{
    private readonly string $customCode;

    public function __construct(string $message, string $code)
    {
        parent::__construct($message);
        $this->customCode = $this->setCode($code);
    }

    /**
     * Create an error response array
     */
    public static function createErrorResponse(string $requestId, Throwable $error): array
    {
        if ($error instanceof self) {
            return [
                'requestId' => $requestId,
                'message' => $error->getMessage(),
                'code' => $error->getProviderCode(),
            ];
        }

        return [
            'requestId' => $requestId,
            'message' => $error->getMessage(),
            'code' => 'unknown',
        ];
    }

    public function getProviderCode(): string
    {
        return $this->customCode;
    }

    private function setCode(string $code): string
    {
        // Teller specific error handling
        if ($this->message === 'The requested account is closed') {
            return 'disconnected';
        }

        // Handle different provider error codes
        return match ($code) {
            // Teller errors
            'enrollment.disconnected',
            'enrollment.disconnected.user_action.mfa_required',
            'enrollment.disconnected.account_locked',
            'enrollment.disconnected.credentials_invalid',
            'enrollment.disconnected.enrollment_inactive',
            'enrollment.disconnected.user_action.contact_information_required',
            'enrollment.disconnected.user_action.insufficient_permissions',
            'enrollment.disconnected.user_action.captcha_required',
            'enrollment.disconnected.user_action.web_login_required' => 'disconnected',
            default => 'unknown'
        };
    }
}
