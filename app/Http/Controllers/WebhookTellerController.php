<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Webhooks\ValidateTellerWebhookSignature;
use App\Http\Requests\Webhooks\TellerWebhookRequest;
use App\Jobs\SyncBankAccounts;
use App\Models\BankConnection;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

final class WebhookTellerController extends Controller
{
    /**
     * Handle incoming Teller webhook events.
     */
    public function __invoke(TellerWebhookRequest $request, ValidateTellerWebhookSignature $action): JsonResponse
    {
        // Validate webhook signature
        if (! $action->handle($request)) {
            Log::warning('Invalid Teller webhook signature', [
                'ip' => $request->ip(),
                'type' => $request->input('type'),
                'signature' => $request->header('teller-signature'),
            ]);

            abort(401, 'Invalid webhook signature');
        }

        // Handle different webhook event types
        return match ($request->input('type')) {
            'enrollment.disconnected' => $this->handleEnrollmentDisconnected($request),
            'transactions.processed' => $this->handleTransactionsProcessed($request),
            'account.number_verification.processed' => $this->handleAccountNumberVerification($request),
            'webhook.test' => $this->handleWebhookTest($request),
            default => abort(400, 'Unhandled webhook type'),
        };
    }

    /**
     * Handle enrollment disconnected event.
     */
    private function handleEnrollmentDisconnected(TellerWebhookRequest $request): JsonResponse
    {
        Log::info('Teller enrollment disconnected', [
            'enrollment_id' => $request->input('payload.enrollment_id'),
            'reason' => $request->input('payload.reason'),
        ]);

        return response()->json(['success' => true]);
    }

    /**
     * Handle transactions processed event.
     */
    private function handleTransactionsProcessed(TellerWebhookRequest $request): JsonResponse
    {
        Log::info('Teller transactions processed', [
            'enrollment_id' => $request->input('payload.enrollment_id'),
        ]);

        $bankConnection = BankConnection::whereProviderConnectionId($request->input('payload.enrollment_id'))->firstOrFail(['id', 'created_at']);

        SyncBankAccounts::dispatch(
            $bankConnection->workspace_id,
            $bankConnection->id,
            $bankConnection->created_at->diffInHours() < 24,
        )->onQueue('financial');

        return response()->json(['success' => true]);
    }

    /**
     * Handle account number verification processed event.
     */
    private function handleAccountNumberVerification(TellerWebhookRequest $request): JsonResponse
    {
        Log::info('Teller account number verification processed', [
            'enrollment_id' => $request->input('payload.enrollment_id'),
        ]);

        return response()->json(['success' => true]);
    }

    /**
     * Handle webhook test event.
     */
    private function handleWebhookTest(TellerWebhookRequest $request): JsonResponse
    {
        Log::info('Teller webhook test received', [
            'id' => $request->input('id'),
        ]);

        return response()->json(['success' => true]);
    }
}
