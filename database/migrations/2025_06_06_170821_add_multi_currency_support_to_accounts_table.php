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
        Schema::table('accounts', function (Blueprint $table): void {
            $table->decimal('base_initial_balance', 19, 4)->nullable()->after('initial_balance');
            $table->decimal('base_current_balance', 19, 4)->nullable()->after('current_balance');
            $table->char('base_currency', 3)->nullable()->after('currency_code');
            $table->decimal('currency_rate', 19, 6)->nullable()->after('base_currency');

            $table->index(['base_currency', 'currency_code', 'workspace_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('accounts', function (Blueprint $table): void {
            $table->dropIndex(['base_currency', 'currency_code', 'workspace_id']);
            $table->dropColumn([
                'base_initial_balance',
                'base_current_balance',
                'base_currency',
                'currency_rate',
            ]);
        });
    }
};
