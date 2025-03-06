<?php

declare(strict_types=1);

namespace App\Services;

use App\Data\BalanceData;
use App\Data\Teller\TellerAccountData;
use App\Enums\AccountSubtype;
use App\Enums\AccountType;
use App\Enums\ProviderType;
use App\Enums\Teller\EnvironmentType;
use App\Exceptions\MissingTellerCertException;
use App\Exceptions\MissingTellerConfigurationException;
use App\Exceptions\MissingTellerKeyException;
use Exception;
use JsonException;

final class TellerService
{
    private string $BASE_URL = 'https://api.teller.io';

    private readonly string $access_token;

    public function __construct($accessToken)
    {
        if ($accessToken === null) {
            throw new Exception('Access token is required');
        }

        $this->access_token = $accessToken;
    }

    /**
     * Get all accounts
     *
     * @return array|\Illuminate\Contracts\Pagination\CursorPaginator|\Illuminate\Contracts\Pagination\Paginator|\Illuminate\Pagination\AbstractCursorPaginator|\Illuminate\Pagination\AbstractPaginator|\Illuminate\Support\Collection|\Illuminate\Support\Enumerable|\Illuminate\Support\LazyCollection|\Spatie\LaravelData\CursorPaginatedDataCollection|\Spatie\LaravelData\DataCollection|\Spatie\LaravelData\PaginatedDataCollection
     */
    public function listAccounts()
    {
        $accounts = collect(TellerAccountData::collect($this->get('/accounts')));

        return $accounts->map(function (TellerAccountData $account): TellerAccountData {
            $balance = $this->getAccountBalances($account->id);

            return TellerAccountData::from([
                'id' => $account->id,
                'name' => $account->name,
                'currency' => $account->currency,
                'type' => AccountType::fromExternal($account->type->value),
                'subtype' => AccountSubtype::fromExternal($account->subtype->value),
                'institution' => InstitutionData::from([
                    'id' => $account->institution->id,
                    'name' => $account->institution->name,
                    'provider' => ProviderType::Teller->value,
                ]),
                'balance' => BalanceData::from([
                    'currency' => 'USD',
                    'amount' => (float) $balance->available,
                ]),
                'enrollmentId' => $account->enrollmentId,
            ]);
        });
    }

    /**
     * Get the balances for an account
     */
    public function getAccountBalances(string $accountId): TellerAccountBalanceData
    {
        return TellerAccountBalanceData::from($this->get("/accounts/{$accountId}/balances"));
    }

    public function listAccountTransactions(string $accountId, ?bool $latest = false, ?int $count = 0): ?array
    {
        $transactions = $this->get("/accounts/{$accountId}/transactions", [
            'count' => $latest === true ? 100 : $count,
        ]);

        // NOTE: Remove pending transactions until upsert issue is fixed
        return array_filter($transactions, fn ($transaction): bool => $transaction['status'] !== 'pending');
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

        $configFilePath = config_path('teller.php');

        if (! file_exists($configFilePath)) {
            throw new MissingTellerConfigurationException();
        }

        $url = "{$this->BASE_URL}$path";
        $accessToken = base64_encode("{$this->access_token}:");

        $headers = [
            'Content-Type: application/json',
            "Authorization: Basic $accessToken",
        ];

        $tellerEnvironment = config('teller.ENVIRONMENT');

        if ($tellerEnvironment === null) {
            throw new Exception('Environment is not set');
        }

        if (! in_array($tellerEnvironment, EnvironmentType::values())) {
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

        if ($tellerEnvironment === EnvironmentType::Production || $tellerEnvironment === EnvironmentType::Development) {
            $certPath = config('teller.CERT_PATH');
            $keyPath = config('teller.KEY_PATH');

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
            return $response;
        }

        $errorObj = json_decode($response, true);

        if ($errorObj && isset($errorObj['error'])) {
            $errorCode = $errorObj['error']['code'];
            $errorMessage = $errorObj['error']['message'];

            return "Error (HTTP $statusCode): $errorCode - $errorMessage";
        }

        throw new Exception('Unexpected error response');
    }
}
