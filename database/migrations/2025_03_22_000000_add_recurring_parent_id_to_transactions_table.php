<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table): void {
            $table->foreignId('recurring_parent_id')
                ->nullable()
                ->after('merchant_id')
                ->constrained('transactions')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table): void {
            $table->dropForeign(['recurring_parent_id']);
            $table->dropColumn('recurring_parent_id');
        });
    }
};
