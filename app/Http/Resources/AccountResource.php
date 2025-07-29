<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Account */
final class AccountResource extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            /**
             * The public identifier for the account.
             *
             * @var string
             */
            'id' => $this->public_id,

            /**
             * The display name of the account.
             *
             * @var string
             */
            'name' => $this->name,

            /**
             * Optional description of the account.
             */
            'description' => $this->description,

            /**
             * The type of account.
             *
             * @var \App\Enums\Finance\AccountType
             */
            'type' => $this->type,

            /**
             * The subtype of account for more specific categorization.
             *
             * @var \App\Enums\Finance\AccountSubtype
             */
            'subtype' => $this->subtype,

            /**
             * The primary currency code for this account (ISO 4217 format).
             *
             * @example USD
             */
            'currencyCode' => $this->currency_code,

            /**
             * The base currency code for currency conversion.
             */
            'baseCurrency' => $this->base_currency,

            /**
             * The exchange rate from account currency to base currency.
             */
            'currencyRate' => $this->currency_rate,

            /**
             * The initial balance when the account was created.
             */
            'initialBalance' => $this->initial_balance,

            /**
             * The initial balance converted to base currency.
             */
            'baseInitialBalance' => $this->base_initial_balance,

            /**
             * The current balance of the account.
             */
            'currentBalance' => $this->current_balance,

            /**
             * The current balance converted to base currency.
             */
            'baseCurrentBalance' => $this->base_current_balance,

            /**
             * Whether this is the default account for the workspace.
             */
            'isDefault' => $this->is_default,

            /**
             * Whether this account was manually created (not from bank connection).
             */
            'isManual' => $this->is_manual,

            /**
             * External identifier from the bank or financial institution.
             */
            'externalId' => $this->external_id,

            /**
             * The timestamp when the account was created.
             */
            'createdAt' => $this->created_at,

            /**
             * The timestamp when the account was last updated.
             */
            'updatedAt' => $this->updated_at,

            /**
             * The bank connection information if account is linked to a bank.
             */
            'connection' => new BankConnectionResource($this->whenLoaded('bankConnection')),

            /**
             * The specific account type data (polymorphic relationship).
             *
             * @var \App\Models\Depository|\App\Models\Investment|\App\Models\Crypto|\App\Models\OtherAsset|\App\Models\CreditCard|\App\Models\Loan|\App\Models\OtherLiability
             */
            'accountable' => $this->whenLoaded('accountable', fn () => $this->accountable?->toArray()),

            /**
             * Collection of transactions associated with this account.
             */
            'transactions' => TransactionResource::collection($this->whenLoaded('transactions')),

            /**
             * User permissions for this account resource.
             *
             * @var array|null
             */
            'permissions' => $this->when($request->user()->exists(), fn () => [
                /**
                 * Whether the user can view this account.
                 *
                 * @var bool
                 */
                'canView' => $request->user()?->can('view', $this->resource),
                /**
                 * Whether the user can update this account.
                 *
                 * @var bool
                 */
                'canUpdate' => $request->user()?->can('update', $this->resource),
                /**
                 * Whether the user can delete this account.
                 *
                 * @var bool
                 */
                'canDelete' => $request->user()?->can('delete', $this->resource),
            ]),
        ];
    }
}
