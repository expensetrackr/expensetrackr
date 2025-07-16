<?php

declare(strict_types=1);

namespace Tests\Unit\Http\Requests\API;

use App\Enums\Finance\AccountType;
use App\Http\Requests\API\UpdateAccountRequest;
use App\Models\Account;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

final class UpdateAccountRequestTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Workspace $workspace;
    private Account $account;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->workspace = Workspace::factory()->create();
        $this->user->workspaces()->attach($this->workspace);
        $this->user->update(['current_workspace_id' => $this->workspace->id]);

        $this->account = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);
    }

    public function test_all_fields_are_optional_for_updates(): void
    {
        $request = new UpdateAccountRequest();
        $validator = Validator::make([], $request->rules());

        $this->assertTrue($validator->passes());
    }

    public function test_validates_field_types_when_provided(): void
    {
        $data = [
            'name' => 123, // Should be string
            'currency_code' => 'TOOLONG', // Should be max 3 chars
            'is_default' => 'not-boolean', // Should be boolean
        ];

        $request = new UpdateAccountRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('name', $validator->errors()->toArray());
        $this->assertArrayHasKey('currency_code', $validator->errors()->toArray());
        $this->assertArrayHasKey('is_default', $validator->errors()->toArray());
    }

    public function test_validates_external_id_uniqueness_excluding_current_account(): void
    {
        // Create another account with external_id
        Account::factory()->create([
            'external_id' => 'existing-external-id',
            'workspace_id' => $this->workspace->id,
        ]);

        $data = [
            'external_id' => 'existing-external-id', // Duplicate
        ];

        $request = new UpdateAccountRequest();
        $request->setRouteResolver(fn() => new class {
            public function __construct(private Account $account) {}
            public function parameter(string $key): Account { return $this->account; }
        }($this->account));
        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('external_id', $validator->errors()->toArray());
    }

    public function test_allows_keeping_same_external_id(): void
    {
        $this->account->update(['external_id' => 'my-external-id']);

        $data = [
            'external_id' => 'my-external-id', // Same as current
        ];

        $request = new UpdateAccountRequest();
        $request->setRouteResolver(fn() => new class {
            public function __construct(private Account $account) {}
            public function parameter(string $key): Account { return $this->account; }
        }($this->account));
        $validator = Validator::make($data, $request->rules());

        $this->assertTrue($validator->passes());
    }

    public function test_validates_credit_card_fields_when_provided(): void
    {
        $data = [
            'available_credit' => -1, // Below minimum
            'minimum_payment' => -1, // Below minimum
            'apr' => -1, // Below minimum
            'annual_fee' => -1, // Below minimum
            'expires_at' => 'invalid-date', // Invalid date
        ];

        $request = new UpdateAccountRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('available_credit', $validator->errors()->toArray());
        $this->assertArrayHasKey('minimum_payment', $validator->errors()->toArray());
        $this->assertArrayHasKey('apr', $validator->errors()->toArray());
        $this->assertArrayHasKey('annual_fee', $validator->errors()->toArray());
        $this->assertArrayHasKey('expires_at', $validator->errors()->toArray());
    }

    public function test_validates_loan_fields_when_provided(): void
    {
        $data = [
            'interest_rate' => -1, // Below minimum
            'rate_type' => 'invalid_type', // Invalid enum
            'term_months' => 0, // Below minimum
        ];

        $request = new UpdateAccountRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('interest_rate', $validator->errors()->toArray());
        $this->assertArrayHasKey('rate_type', $validator->errors()->toArray());
        $this->assertArrayHasKey('term_months', $validator->errors()->toArray());
    }

    public function test_passes_with_valid_update_data(): void
    {
        $data = [
            'name' => 'Updated Account Name',
            'description' => 'Updated description',
            'currency_code' => 'EUR',
            'is_default' => false,
        ];

        $request = new UpdateAccountRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertTrue($validator->passes());
    }

    public function test_validates_field_lengths(): void
    {
        $data = [
            'name' => str_repeat('a', 256), // Too long
            'description' => str_repeat('a', 501), // Too long
            'currency_code' => 'TOOLONG', // Too long
            'external_id' => str_repeat('a', 256), // Too long
        ];

        $request = new UpdateAccountRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('name', $validator->errors()->toArray());
        $this->assertArrayHasKey('description', $validator->errors()->toArray());
        $this->assertArrayHasKey('currency_code', $validator->errors()->toArray());
        $this->assertArrayHasKey('external_id', $validator->errors()->toArray());
    }

    public function test_authorization_passes_when_user_can_update_account(): void
    {
        $request = new UpdateAccountRequest();
        $request->setUserResolver(fn() => $this->user);
        $request->setRouteResolver(fn() => new class {
            public function __construct(private Account $account) {}
            public function parameter(string $key): Account { return $this->account; }
        }($this->account));

        $this->assertTrue($request->authorize());
    }

    public function test_authorization_fails_when_user_cannot_update_account(): void
    {
        $otherUser = User::factory()->create();
        $otherAccount = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $otherUser->id,
        ]);

        $request = new UpdateAccountRequest();
        $request->setUserResolver(fn() => $this->user);
        $request->setRouteResolver(fn() => new class {
            public function __construct(private Account $account) {}
            public function parameter(string $key): Account { return $this->account; }
        }($otherAccount));

        $this->assertFalse($request->authorize());
    }

    public function test_custom_error_messages_are_returned(): void
    {
        $request = new UpdateAccountRequest();
        $messages = $request->messages();

        $this->assertArrayHasKey('name.required', $messages);
        $this->assertArrayHasKey('currency_code.required', $messages);
        $this->assertArrayHasKey('available_credit.numeric', $messages);
        $this->assertArrayHasKey('interest_rate.numeric', $messages);

        $this->assertStringContainsString('account name', $messages['name.required']);
        $this->assertStringContainsString('currency code', $messages['currency_code.required']);
        $this->assertStringContainsString('available credit', $messages['available_credit.numeric']);
    }

    public function test_nullable_fields_accept_null_values(): void
    {
        $data = [
            'description' => null,
            'external_id' => null,
        ];

        $request = new UpdateAccountRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertTrue($validator->passes());
    }

    public function test_validates_subtype_enum_when_provided(): void
    {
        $data = [
            'subtype' => 'invalid_subtype',
        ];

        $request = new UpdateAccountRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('subtype', $validator->errors()->toArray());
    }

    public function test_sometimes_validation_works_correctly(): void
    {
        // Test that fields are only validated when present
        $data = [
            'name' => 'Valid Name',
            // Other fields omitted - should pass
        ];

        $request = new UpdateAccountRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertTrue($validator->passes());
    }

    public function test_numeric_fields_accept_valid_values(): void
    {
        $data = [
            'available_credit' => 5000.00,
            'minimum_payment' => 25.00,
            'apr' => 18.99,
            'annual_fee' => 95.00,
            'interest_rate' => 3.5,
            'term_months' => 360,
        ];

        $request = new UpdateAccountRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertTrue($validator->passes());
    }

    public function test_date_fields_accept_valid_dates(): void
    {
        $data = [
            'expires_at' => '2026-12-31',
        ];

        $request = new UpdateAccountRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertTrue($validator->passes());
    }

    public function test_boolean_fields_accept_valid_booleans(): void
    {
        $data = [
            'is_default' => true,
        ];

        $request = new UpdateAccountRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertTrue($validator->passes());
    }
}
