<?php

declare(strict_types=1);

use App\Enums\Finance\RateType;
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
        Schema::create('accounts', function (Blueprint $table): void {
            $table->id();
            $table->morphs('accountable');
            $table->string('name');
            $table->string('description')->nullable();
            $table->string('subtype')->nullable();
            $table->string('currency_code');
            $table->decimal('initial_balance', 19, 4)->default(0);
            $table->decimal('current_balance', 19, 4)->default(0);
            $table->boolean('is_default')->default(false);
            $table->string('public_id')->unique();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->string('external_id')->index()->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['workspace_id', 'subtype']);
            $table->index('accountable_id');
        });

        Schema::create('depositories', function (Blueprint $table): void {
            $table->id();
            $table->timestamps();
        });

        Schema::create('investments', function (Blueprint $table): void {
            $table->id();
            $table->timestamps();
        });

        Schema::create('cryptos', function (Blueprint $table): void {
            $table->id();
            $table->timestamps();
        });

        Schema::create('other_assets', function (Blueprint $table): void {
            $table->id();
            $table->timestamps();
        });

        Schema::create('credit_cards', function (Blueprint $table): void {
            $table->id();
            $table->decimal('available_credit', 19, 4);
            $table->decimal('minimum_payment', 19, 4);
            $table->decimal('apr', 19, 4);
            $table->decimal('annual_fee', 19, 4);
            $table->timestamp('expires_at');
            $table->timestamps();
        });

        Schema::create('loans', function (Blueprint $table): void {
            $table->id();
            $table->decimal('interest_rate', 10, 4)->default(0);
            $table->string('rate_type')->default(RateType::Fixed);
            $table->integer('term_months');
            $table->timestamps();
        });

        Schema::create('other_liabilities', function (Blueprint $table): void {
            $table->id();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
        Schema::dropIfExists('depositories');
        Schema::dropIfExists('investments');
        Schema::dropIfExists('cryptos');
        Schema::dropIfExists('other_assets');
        Schema::dropIfExists('credit_cards');
        Schema::dropIfExists('loans');
        Schema::dropIfExists('other_liabilities');
    }
};
