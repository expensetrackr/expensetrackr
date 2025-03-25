<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

final class TellerCertificatesServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->setupTellerCertificates();
    }

    private function setupTellerCertificates(): void
    {
        // Check if we have the base64 encoded certs in environment
        $certBase64 = config('services.teller.cert_base64');
        $keyBase64 = config('services.teller.key_base64');

        if ($certBase64 && $keyBase64) {
            // Define the paths from your config
            $certPath = config('teller.cert_path');
            $keyPath = config('teller.key_path');

            // Create directory if it doesn't exist
            $certPathString = is_string($certPath) ? $certPath : '';
            $directory = dirname($certPathString);

            if (! is_dir($directory)) {
                mkdir($directory, 0755, true);
            }

            // Write decoded content to the files
            if (is_string($certPath) && is_string($certBase64)) {
                file_put_contents($certPath, base64_decode($certBase64));
            }

            if (is_string($keyPath) && is_string($keyBase64)) {
                file_put_contents($keyPath, base64_decode($keyBase64));
            }

            // Set proper permissions
            if (is_string($keyPath)) {
                chmod($keyPath, 0600); // Private key should be more restricted
            }

            if (is_string($certPath)) {
                chmod($certPath, 0644);
            }
        }
    }
}
