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
        Schema::create('merchants', function (Blueprint $table): void {
            $table->id();
            $table->string('name')->index();
            $table->string('category')->nullable();
            $table->string('website')->nullable();
            $table->string('icon')->nullable();
            $table->json('address')->nullable();
            $table->boolean('is_system')->default(false);
            $table->string('external_id')->unique();
            $table->string('public_id')->unique();
            $table->timestamps();

            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('merchants');
    }
};
