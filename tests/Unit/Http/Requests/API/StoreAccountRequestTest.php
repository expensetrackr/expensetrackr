<?php

declare(strict_types=1);

namespace Tests\Unit\Http\Requests\API;

use App\Enums\Finance\AccountType;
use App\Http\Requests\API\StoreAccountRequest;
use App\Models\Account;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

final class StoreAccountRequestTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Workspace $workspace;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->workspace = Workspace::factory()->create();
        $this->user->workspaces()->attach($this->workspace);
        $this->user->update(['current_workspace_id' => $this->workspace->id]);
    }

    public function test_validates_required_fields(): void
    {
        $request = new StoreAccountRequest();
        $validator = Validator::make([], $request->rules());

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('name', $validator->errors()->toArray());
        $this->assertArrayHasKey('currency_code', $validator->errors()->toArray());
        $this->assertArrayHasKey('initial_balance', $validator->errors()->toArray());
        $this->assertArrayHasKey('type', $validator->errors()->toArray());
    }

    public function test_validates_basic_field_types(): void
    {
        $data = [
            'name' => 123, // Should be string
            'currency_code' => 'TOOLONG', // Should be max 3 chars
            'initial_balance' => 'not-numeric', // Should be numeric
            'type' => 'invalid_type', // Should be valid enum
        ];

        $request = new StoreAccountRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('name', $validator->errors()->toArray());
        $this->assertArrayHasKey('currency_code', $validator->errors()->toArray());
        $this->assertArrayHasKey('initial_balance', $validator->errors()->toArray());
        $this->assertArrayHasKey('type', $validator->errors()->toArray());
    }

    public function test_validates_minimum_balance(): void
    {
        $data = [
            'name' => 'Test Account',
            'currency_code' => 'USD',
            'initial_balance' => 0.001, // Below minimum
            'type' => AccountType::Depository->value,
        ];

        $request = new StoreAccountRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('initial_balance', $validator->errors()->toArray());
    }

    public function test_validates_credit_card_specific_fields(): void
    {
        $data = [
            'name' => 'Credit Card',
            'currency_code' => 'USD',
            'initial_balance' => 1000.00,
            'type' => AccountType::CreditCard->value,
            // Missing required credit card fields
        ];

        $request = new StoreAccountRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('available_credit', $validator->errors()->toArray());
        $this->assertArrayHasKey('minimum_payment', $validator->errors()->toArray());
        $this->assertArrayHasKey('apr', $validator->errors()->toArray());
        $this->assertArrayHasKey('annual_fee', $validator->errors()->toArray());
        $this->assertArrayHasKey('expires_at', $validator->errors()->toArray());
    }

    public function test_validates_loan_specific_fields(): void
    {
        $data = [
            'name' => 'Loan Account',
            'currency_code' => 'USD',
            'initial_balance' => 10000.00,
            'type' => AccountType::Loan->value,
            // Missing required loan fields
        ];

        $request = new StoreAccountRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('interest_rate', $validator->errors()->toArray());
        $this->assertArrayHasKey('rate_type', $validator->errors()->toArray());
        $this->assertArrayHasKey('term_months', $validator->errors()->toArray());
    }

    public function test_passes_with_valid_depository_account_data(): void
    {
        $data = [
            'name' => 'Savings Account',
            'description' => 'My savings account',
            'currency_code' => 'USD',
            'initial_balance' => 1000.00,
            'type' => AccountType::Depository->value,
            'is_default' => true,
        ];

        $request = new StoreAccountRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertTrue($validator->passes());
    }

    public function test_passes_with_valid_credit_card_data(): void
    {
        $data = [
            'name' => 'Credit Card',
            'currency_code' => 'USD',
            'initial_balance' => 500.00,
            'type' => AccountType::CreditCard->value,
            'available_credit' => 5000.00,
            'minimum_payment' => 25.00,
            'apr' => 18.99,
            'annual_fee' => 95.00,
            'expires_at' => '2026-12-31',
        ];

        $request = new StoreAccountRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertTrue($validator->passes());
    }

    public function test_passes_with_valid_loan_data(): void
    {
        $data = [
            'name' => 'Mortgage',
            'currency_code' => 'USD',
            'initial_balance' => 250000.00,
            'type' => AccountType::Loan->value,
            'interest_rate' => 3.5,
            'rate_type' => 'fixed',
            'term_months' => 360,
        ];

        $request = new StoreAccountRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertTrue($validator->passes());
    }

    public function test_validates_external_id_uniqueness(): void
    {
        // Create an existing account with external_id
        Account::factory()->create([
            'external_id' => 'existing-external-id',
            'workspace_id' => $this->workspace->id,
        ]);

        $data = [
            'name' => 'New Account',
            'currency_code' => 'USD',
            'initial_balance' => 1000.00,
            'type' => AccountType::Depository->value,
            'external_id' => 'existing-external-id', // Duplicate
        ];

        $request = new StoreAccountRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('external_id', $validator->errors()->toArray());
    }

    public function test_validates_bank_connection_exists(): void
    {
        $data = [
            'name' => 'Bank Account',
            'currency_code' => 'USD',
            'initial_balance' => 1000.00,
            'type' => AccountType::Depository->value,
            'bank_connection_id' => 99999, // Non-existent
        ];

        $request = new StoreAccountRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('bank_connection_id', $validator->errors()->toArray());
    }

    public function test_authorization_passes_when_user_can_create_accounts(): void
    {
        $request = new StoreAccountRequest();
        $request->setUserResolver(fn () => $this->user);

        // Set user as admin to ensure authorization passes
        $this->user->update(['is_admin' => true]);

        $this->assertTrue($request->authorize());
    }

    public function test_custom_error_messages_are_returned(): void
    {
        $request = new StoreAccountRequest();
        $messages = $request->messages();

        $this->assertArrayHasKey('name.required', $messages);
        $this->assertArrayHasKey('currency_code.required', $messages);
        $this->assertArrayHasKey('initial_balance.required', $messages);
        $this->assertArrayHasKey('type.required', $messages);
        $this->assertArrayHasKey('available_credit.required_if', $messages);
        $this->assertArrayHasKey('interest_rate.required_if', $messages);

        $this->assertStringContainsString('account name', $messages['name.required']);
        $this->assertStringContainsString('currency code', $messages['currency_code.required']);
        $this->assertStringContainsString('initial balance', $messages['initial_balance.required']);
    }

    public function test_validates_field_lengths(): void
    {
        $data = [
            'name' => str_repeat('a', 256), // Too long
            'description' => str_repeat('a', 501), // Too long
            'currency_code' => 'TOOLONG', // Too long
            'initial_balance' => 1000.00,
            'type' => AccountType::Depository->value,
            'external_id' => str_repeat('a', 256), // Too long
        ];

        $request = new StoreAccountRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('name', $validator->errors()->toArray());
        $this->assertArrayHasKey('description', $validator->errors()->toArray());
        $this->assertArrayHasKey('currency_code', $validator->errors()->toArray());
        $this->assertArrayHasKey('external_id', $validator->errors()->toArray());
    }

    public function test_validates_numeric_field_minimums(): void
    {
        $data = [
            'name' => 'Test Account',
            'currency_code' => 'USD',
            'initial_balance' => 1000.00,
            'type' => AccountType::CreditCard->value,
            'available_credit' => -1, // Below minimum
            'minimum_payment' => -1, // Below minimum
            'apr' => -1, // Below minimum
            'annual_fee' => -1, // Below minimum
            'expires_at' => '2026-12-31',
        ];

        $request = new StoreAccountRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('available_credit', $validator->errors()->toArray());
        $this->assertArrayHasKey('minimum_payment', $validator->errors()->toArray());
        $this->assertArrayHasKey('apr', $validator->errors()->toArray());
        $this->assertArrayHasKey('annual_fee', $validator->errors()->toArray());
    }
}
