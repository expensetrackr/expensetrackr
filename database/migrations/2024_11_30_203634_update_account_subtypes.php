<?php

declare(strict_types=1);

use App\Enums\AccountSubtype;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create a new enum type
        DB::statement("CREATE TYPE account_subtype_enum_new AS ENUM ('".implode("','", AccountSubtype::values())."')");

        // Alter the column to use the new enum type
        DB::statement('ALTER TABLE accounts ALTER COLUMN subtype TYPE account_subtype_enum_new USING subtype::text::account_subtype_enum_new');

        // Drop the old enum type
        DB::statement('DROP TYPE IF EXISTS account_subtype_enum');

        // Rename the new enum type to the original name
        DB::statement('ALTER TYPE account_subtype_enum_new RENAME TO account_subtype_enum');
    }
};
