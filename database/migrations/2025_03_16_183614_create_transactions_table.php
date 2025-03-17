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
            $table->unsignedBigInteger('base_amount')->nullable();
            $table->char('base_currency', 3)->nullable();
            $table->decimal('currency_rate', 19, 6)->nullable();
            $table->unsignedBigInteger('amount');
            $table->char('currency', 3);
            $table->boolean('is_recurring')->default(false);
            $table->boolean('is_manual')->default(false);
            $table->timestamp('dated_at');

            $table->string('external_id')->unique()->nullable();

            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->string('public_id')->unique();

            $table->timestamps();

            $table->index(['base_currency', 'currency', 'workspace_id', 'dated_at']);
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
