<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\ProviderHandler;
use App\Data\Banking\TellerAccountBalanceData;
use App\Data\Banking\TellerAccountData;
use App\Data\Banking\TellerTransactionData;
use App\Data\Finance\BalanceData;
use App\Data\Finance\BankAccountData;
use App\Data\Finance\TransactionData;
use App\Enums\Banking\TellerTransactionStatus;
use App\Enums\Teller\TellerEnvironment;
use App\Exceptions\MissingTellerCertException;
use App\Exceptions\MissingTellerConfigurationException;
use App\Exceptions\MissingTellerKeyException;
use App\Exceptions\ProviderErrorException;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use JsonException;
use Throwable;

final class TellerService implements ProviderHandler
{
    private string $BASE_URL = 'https://api.teller.io';

    private readonly string $access_token;

    public function __construct(string $accessToken)
    {
        if ($accessToken === '') {
            throw new Exception('Access token is required');
        }

        $this->access_token = $accessToken;
    }

    /**
     * List all accounts for the authenticated user.
     *
     * @return Collection<int, AccountData>
     */
    public function getAccounts(): Collection
    {
        $accounts = collect(TellerAccountData::collect((array) $this->get('/accounts')));

        return $accounts->map(function (TellerAccountData $account): BankAccountData {
            $balance = $this->getAccountBalances($account->id);

            return BankAccountData::fromTeller($account, $balance);
        });
    }

    /**
     * Get a single account by ID
     */
    public function getAccount(string $accountId): BankAccountData
    {
        $account = TellerAccountData::from($this->get("/accounts/{$accountId}"));

        return BankAccountData::fromTeller($account, $this->getAccountBalances($accountId));
    }

    /**
     * Get the balances for an account
     */
    public function getAccountBalances(string $accountId): BalanceData
    {
        $balance = TellerAccountBalanceData::from($this->get("/accounts/{$accountId}/balances"));

        return BalanceData::fromTeller($balance);
    }

    /**
     * List account transactions for a specific account.
     *
     * @param  string  $accountId  The account ID
     * @param  bool|null  $latest  Whether to get only the latest transactions
     * @param  int|null  $count  The number of transactions to get
     * @return Collection<int, TransactionData>
     */
    public function getTransactions(string $accountId, ?bool $latest = false, ?int $count = 0): Collection
    {
        $transactions = $this->get("/accounts/{$accountId}/transactions", [
            'count' => $latest === true ? 100 : $count,
        ]);
        $transactions = TellerTransactionData::collect($transactions);

        // NOTE: Remove pending transactions until upsert issue is fixed
        return TransactionData::collectFromTeller($transactions)->filter(fn ($transaction): bool => $transaction->status !== TellerTransactionStatus::Pending);
    }

    /**
     * Get the connection status of the account
     *
     * @return array<string, string>
     */
    public function getConnectionStatus(): array
    {
        try {
            $accounts = $this->getAccounts();

            if ($accounts->isEmpty()) {
                return [
                    'status' => 'disconnected',
                ];
            }

            // Check all accounts in parallel
            $results = $accounts->map(function (TellerAccountData $account): void {
                $this->getAccount($account->id);
            });

            // If any account request succeeded, connection is valid
            if ($results->every(fn ($result): bool => $result !== null)) {
                return [
                    'status' => 'connected',
                ];
            }

            // If we couldn't verify any accounts, assume disconnected
            return [
                'status' => 'disconnected',
            ];
        } catch (Throwable $th) {
            $response = ProviderErrorException::createErrorResponse(
                requestId: (string) Str::uuid(),
                error: $th,
            );

            if ($response['code'] === 'disconnected') {
                return [
                    'status' => 'disconnected',
                ];
            }
        }

        // If we get here, the account is not disconnected
        // But it could be a connection issue between Teller and the institution
        return [
            'status' => 'connected',
        ];
    }

    /**
     * @param  ?array<array-key, mixed>  $data
     *
     * @throws MissingTellerConfigurationException
     * @throws JsonException
     * @throws MissingTellerKeyException
     * @throws MissingTellerCertException
     */
    public function get(string $path, ?array $data = null): mixed
    {
        return json_decode($this->request('GET', $path, $data), false, 512, JSON_THROW_ON_ERROR);
    }

    /**
     * @param  ?array<array-key, mixed>  $data
     *
     * @throws MissingTellerConfigurationException
     * @throws MissingTellerCertException
     * @throws MissingTellerKeyException
     * @throws Exception
     */
    private function request(string $method, string $path, ?array $data = null): bool|string
    {
        $url = "{$this->BASE_URL}$path";
        $accessToken = base64_encode("{$this->access_token}:");

        $headers = [
            'Content-Type: application/json',
            "Authorization: Basic $accessToken",
        ];

        $tellerEnvironment = config('services.teller.environment');

        if ($tellerEnvironment === null) {
            throw new Exception('Environment is not set');
        }

        if (! in_array($tellerEnvironment, TellerEnvironment::values())) {
            throw new Exception('Invalid environment');
        }

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => $headers,
        ]);

        if ($data !== null && $data !== []) {
            curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data, JSON_THROW_ON_ERROR));
        }

        // Check if we have a cached response for this request
        $cacheKey = md5($method.$path.json_encode($data));
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        if ($tellerEnvironment === TellerEnvironment::Production || $tellerEnvironment === TellerEnvironment::Development) {
            $certPath = config('services.teller.cert_path');
            $keyPath = config('services.teller.key_path');

            if (! file_exists($certPath)) {
                throw new MissingTellerCertException();
            }

            if (! file_exists($keyPath)) {
                throw new MissingTellerKeyException();
            }

            curl_setopt($curl, CURLOPT_SSLCERT, $certPath);
            curl_setopt($curl, CURLOPT_SSLKEY, $keyPath);
        }

        $response = curl_exec($curl);

        if ($response === false) {
            $error = curl_error($curl);
            curl_close($curl);
            throw new Exception("cURL request failed: $error");
        }

        $statusCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);

        if ($statusCode === 200) {
            // Cache the response
            Cache::put($cacheKey, $response, now()->addMinutes(5));

            return $response;
        }

        $errorObj = json_decode($response, true);

        if ($errorObj && isset($errorObj['error'])) {
            $errorCode = $errorObj['error']['code'];
            $errorMessage = $errorObj['error']['message'];

            Log::error("Teller API Error: {$errorCode} - {$errorMessage}");
            throw new Exception("Teller API Error: {$errorCode} - {$errorMessage}");
        }

        throw new Exception('Unexpected error response');
    }
}
