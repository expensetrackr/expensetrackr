<?php

declare(strict_types=1);

use App\Enums\ProviderType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bank_connections', function (Blueprint $table): void {
            $table->id();

            // Institution details
            $table->string('institution_id')->nullable();
            $table->string('institution_name');
            $table->string('institution_logo_url')->nullable();

            // Provider-specific identifiers
            $table->string('provider_connection_id')->nullable(); // Plaid item_id, MX member_guid, Teller enrollment_id
            $table->enum('provider_type', ProviderType::values());

            // Authentication details
            $table->text('access_token');
            $table->text('refresh_token')->nullable();
            $table->timestamp('token_expires_at')->nullable();

            // Connection status
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_sync_at')->nullable();
            $table->text('error_message')->nullable();

            // Metadata
            $table->json('provider_metadata')->nullable(); // For provider-specific data

            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->string('public_id')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_connections');
    }
};
