<?php

declare(strict_types=1);

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
        Schema::create('transaction_enrichments', function (Blueprint $table): void {
            $table->id();
            $table->string('merchant_name')->index();
            $table->string('website')->nullable();
            $table->string('icon')->nullable();
            $table->json('address')->nullable();
            $table->string('public_id')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_enrichments');
    }
};
