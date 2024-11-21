<?php

declare(strict_types=1);

use App\Enums\RateType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loans', function (Blueprint $table): void {
            $table->id();
            $table->decimal('interest_rate', 10);
            $table->enum('rate_type', array_column(RateType::cases(), 'value'))->default(RateType::Fixed->value);
            $table->integer('term_months');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};
