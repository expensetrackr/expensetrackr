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
        Schema::table('transactions', function (Blueprint $table): void {
            $table->timestamp('enriched_at')->nullable();

            $table->foreignId('merchant_id')->nullable()->constrained();

            $table->index('merchant_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table): void {
            $table->dropForeign(['merchant_id']);
            $table->dropIndex('merchant_id');
            $table->dropColumn('enriched_at');
            $table->dropColumn('merchant_id');
        });
    }
};
