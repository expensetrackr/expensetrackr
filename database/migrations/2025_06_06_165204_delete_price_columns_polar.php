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
        Schema::table('polar_orders', function (Blueprint $table): void {
            $table->dropColumn('product_price_id');
        });

        Schema::table('polar_subscriptions', function (Blueprint $table): void {
            $table->dropColumn('price_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('polar_orders', function (Blueprint $table): void {
            $table->string('product_price_id')->index();
        });

        Schema::table('polar_subscriptions', function (Blueprint $table): void {
            $table->string('price_id');
        });
    }
};
