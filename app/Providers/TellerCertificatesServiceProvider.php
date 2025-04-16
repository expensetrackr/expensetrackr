<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\Facades\Storage;
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
            $certPath = config('services.teller.cert_path');
            $keyPath = config('services.teller.key_path');

            // Create directory if it doesn't exist
            $certPathString = is_string($certPath) ? $certPath : '';
            $directory = dirname($certPathString);

            // Ensure directory exists with proper permissions
            if (! is_dir($directory)) {
                Storage::disk('local')->makeDirectory('teller');
            }

            // Write decoded content to the files
            if (is_string($certPath) && is_string($certBase64)) {
                Storage::disk('local')->put('teller/teller_cert.pem', base64_decode($certBase64));
                chmod(Storage::disk('local')->path('teller/teller_cert.pem'), 0644); // Certificate can be readable
            }

            if (is_string($keyPath) && is_string($keyBase64)) {
                Storage::disk('local')->put('teller/teller_pk.pem', base64_decode($keyBase64));
                chmod(Storage::disk('local')->path('teller/teller_pk.pem'), 0600); // Private key should be more restricted
            }
        }
    }
}
