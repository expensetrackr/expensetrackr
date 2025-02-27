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
        $certBase64 = env('TELLER_CERT_BASE64');
        $keyBase64 = env('TELLER_KEY_BASE64');

        if ($certBase64 && $keyBase64) {
            // Define the paths from your config
            $certPath = config('teller.CERT_PATH');
            $keyPath = config('teller.KEY_PATH');

            // Create directory if it doesn't exist
            $directory = dirname((string) $certPath);
            if (! is_dir($directory)) {
                mkdir($directory, 0755, true);
            }

            // Write decoded content to the files
            file_put_contents($certPath, base64_decode((string) $certBase64));
            file_put_contents($keyPath, base64_decode((string) $keyBase64));

            // Set proper permissions
            chmod($keyPath, 0600); // Private key should be more restricted
            chmod($certPath, 0644);
        }
    }
}
