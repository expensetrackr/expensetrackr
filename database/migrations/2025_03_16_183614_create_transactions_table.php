<?php

declare(strict_types=1);

use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
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
        Schema::create('transactions', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('note')->nullable();
            $table->string('status')->default(TransactionStatus::Posted->value);
            $table->string('type')->default(TransactionType::Expense->value);
            $table->decimal('base_amount', 19, 4)->nullable();
            $table->char('base_currency', 3)->nullable();
            $table->decimal('currency_rate', 19, 6)->nullable();
            $table->decimal('amount', 19, 4);
            $table->char('currency', 3);
            $table->boolean('is_recurring')->default(false);
            $table->boolean('is_manual')->default(false);
            $table->timestamp('dated_at');
            $table->timestamp('enriched_at')->nullable();
            $table->string('external_id')->unique()->nullable();
            $table->string('public_id')->unique();

            $table->foreignId('account_id')->constrained()->cascadeOnDelete();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->foreignId('enrichment_id')->nullable()->constrained('transaction_enrichments');

            $table->timestamps();

            $table->index(['base_currency', 'currency', 'workspace_id', 'dated_at']);
            $table->index('enrichment_id');
            $table->index('account_id');
            $table->index('workspace_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
