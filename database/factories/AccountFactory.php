<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\Finance\AccountSubtype;
use App\Enums\Finance\AccountType;
use App\Models\Account;
use App\Models\CreditCard;
use App\Models\Crypto;
use App\Models\Depository;
use App\Models\Investment;
use App\Models\Loan;
use App\Models\OtherAsset;
use App\Models\OtherLiability;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Account> */
final class AccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $accountableTypes = [
            Depository::class,
            Investment::class,
            Crypto::class,
            OtherAsset::class,
            CreditCard::class,
            Loan::class,
            OtherLiability::class,
        ];

        $accountableType = $this->faker->randomElement($accountableTypes);

        /**
         * Map accountable type to corresponding account type.
         *
         * @var array<class-string, AccountType>
         */
        $typeMapping = [
            Depository::class => AccountType::Depository,
            Investment::class => AccountType::Investment,
            Crypto::class => AccountType::Crypto,
            OtherAsset::class => AccountType::OtherAsset,
            CreditCard::class => AccountType::CreditCard,
            Loan::class => AccountType::Loan,
            OtherLiability::class => AccountType::OtherLiability,
        ];

        return [
            'accountable_type' => $accountableType,
            'accountable_id' => $accountableType::factory(),
            'name' => $this->faker->randomElement([
                'Primary Checking',
                'Savings Account',
                'Emergency Fund',
                'Investment Portfolio',
                'Credit Card',
                'Business Account',
                'Joint Account',
                'Retirement Fund',
            ]),
            'description' => $this->faker->optional()->sentence(),
            'type' => $typeMapping[$accountableType],
            'subtype' => $this->faker->optional()->randomElement(AccountSubtype::cases()),
            'currency_code' => $this->faker->currencyCode(),
            'base_currency' => $this->faker->optional()->currencyCode(),
            'currency_rate' => $this->faker->optional()->randomFloat(6, 0.1, 10),
            'initial_balance' => $this->faker->randomFloat(4, 0, 10000),
            'base_initial_balance' => $this->faker->optional()->randomFloat(4, 0, 10000),
            'current_balance' => $this->faker->randomFloat(4, 0, 10000),
            'base_current_balance' => $this->faker->optional()->randomFloat(4, 0, 10000),
            'is_default' => $this->faker->boolean(10), // 10% chance of being default
            'is_manual' => $this->faker->boolean(),
            'public_id' => $this->faker->uuid(),
            'workspace_id' => Workspace::factory(),
            'external_id' => $this->faker->optional()->uuid(),
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'bank_connection_id' => null, // Optional relationship
        ];
    }
}
