<?php

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
        Schema::table('accounts', function (Blueprint $table) {
            // Composite indexes for common query patterns
            $table->index(['workspace_id', 'is_default'], 'accounts_workspace_default_idx');
            $table->index(['workspace_id', 'currency_code'], 'accounts_workspace_currency_idx');
            $table->index(['workspace_id', 'created_at'], 'accounts_workspace_created_idx');
            $table->index(['workspace_id', 'current_balance'], 'accounts_workspace_balance_idx');
            $table->index(['workspace_id', 'is_manual'], 'accounts_workspace_manual_idx');
            $table->index(['workspace_id', 'accountable_type'], 'accounts_workspace_type_idx');
            
            // Individual indexes for performance
            $table->index('external_id', 'accounts_external_id_idx');
            $table->index('bank_connection_id', 'accounts_bank_connection_idx');
            $table->index(['created_at', 'updated_at'], 'accounts_timestamps_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('accounts', function (Blueprint $table) {
            // Drop the indexes in reverse order
            $table->dropIndex('accounts_timestamps_idx');
            $table->dropIndex('accounts_bank_connection_idx');
            $table->dropIndex('accounts_external_id_idx');
            $table->dropIndex('accounts_workspace_type_idx');
            $table->dropIndex('accounts_workspace_manual_idx');
            $table->dropIndex('accounts_workspace_balance_idx');
            $table->dropIndex('accounts_workspace_created_idx');
            $table->dropIndex('accounts_workspace_currency_idx');
            $table->dropIndex('accounts_workspace_default_idx');
        });
    }
};