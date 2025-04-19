<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\BankAccounts\CreateBankConnection;
use App\Data\Finance\BankConnectionCreateData;
use App\Enums\Banking\ProviderType;
use App\Http\Requests\CreateBankConnectionRequest;
use App\Services\FinanceCoreService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class BankConnectionController extends Controller
{
    /**
     * Store a newly created bank connection in storage.
     */
    public function store(CreateBankConnectionRequest $request, CreateBankConnection $action): RedirectResponse
    {
        $action->create(BankConnectionCreateData::from($request->validated()));

        return redirect(route('accounts.index'))
            ->with('toast',
                [
                    'type' => 'success',
                    'title' => __('Great! You have connected your bank accounts.'),
                    'description' => __('We are syncing them now. This may take a few minutes.'),
                    'duration' => 10000,
                ]
            );
    }

    public function connect(string $enrollmentId, ProviderType $provider, string $token): Response
    {
        $financeCore = new FinanceCoreService(
            $enrollmentId,
            $provider,
            $token,
        );

        return Inertia::render('bank-accounts/connect/page', [
            'enrollmentId' => $enrollmentId,
            'provider' => $provider,
            'token' => $token,
            'bankAccounts' => Inertia::defer(fn (): array => $financeCore->getAccounts()->toArray()),
        ]);
    }
}
