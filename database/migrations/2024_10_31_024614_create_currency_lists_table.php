<?php

declare(strict_types=1);

use App\Services\CurrencyService;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(CurrencyService $currency): void
    {
        if (! $currency->isEnabled()) {
            return;
        }

        Schema::create('currency_lists', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->string('name');
            $table->boolean('available');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('currency_lists');
    }
};
