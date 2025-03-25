<?php

declare(strict_types=1);

namespace App\Actions\Webhooks;

use Illuminate\Http\Request;
use InvalidArgumentException;
use Throwable;

final class ValidateTellerWebhookSignature
{
    /**
     * Validates the signature of a Teller webhook request.
     *
     * @return bool Whether the signature is valid
     */
    public function handle(Request $request): bool
    {
        $signatureHeader = $request->header('teller-signature');

        if (! $signatureHeader) {
            return false;
        }

        try {
            $parsed = $this->parseTellerSignatureHeader($signatureHeader);
            $timestamp = $parsed['timestamp'];
            $signatures = $parsed['signatures'];

            // Check if the webhook was sent within the last 3 minutes
            $threeMinutesAgo = time() - 3 * 60;
            if ((int) $timestamp < $threeMinutesAgo) {
                return false;
            }

            // Get the raw request body
            $body = $request->getContent();

            // Create the signed message using timestamp and raw body
            $signedMessage = "$timestamp.$body";

            // Calculate the signature
            $calculatedSignature = hash_hmac('sha256', $signedMessage, type(config('services.teller.signing_key'))->asString());

            // Compare with provided signatures
            return in_array($calculatedSignature, $signatures, true);
        } catch (Throwable) {
            return false;
        }
    }

    /**
     * Parses the Teller signature header into timestamp and signatures.
     *
     * @param  string  $header  The Teller-Signature header value
     * @return array{timestamp: string, signatures: array<int, string>}
     *
     * @throws InvalidArgumentException If the header format is invalid
     */
    private function parseTellerSignatureHeader(string $header): array
    {
        $parts = explode(',', $header);

        $timestampPart = null;
        $signatures = [];

        foreach ($parts as $part) {
            if (str_starts_with($part, 't=')) {
                $timestampPart = mb_substr($part, 2);
            } elseif (str_starts_with($part, 'v1=')) {
                $signatures[] = mb_substr($part, 3);
            }
        }

        if ($timestampPart === null || $timestampPart === '' || $timestampPart === '0' || $signatures === []) {
            throw new InvalidArgumentException('Invalid Teller-Signature header format');
        }

        return [
            'timestamp' => $timestampPart,
            'signatures' => $signatures,
        ];
    }
}
