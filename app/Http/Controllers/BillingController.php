<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\SubscribeRequest;
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

final class BillingController
{
    /**
     * Shows the billing page.
     */
    public function show(
        #[CurrentUser] User $user,
    ): RedirectResponse|Response {
        if ($user->subscribed()) {
            return $user->redirectToCustomerPortal();
        }

        return Inertia::render('settings/billing/page');
    }

    /**
     * Redirects to the billing page for the given product ID.
     */
    public function subscribe(
        SubscribeRequest $request,
        #[CurrentUser] User $user,
    ): RedirectResponse {
        /** @var string */
        $productId = $request->input('product_id');
        /** @var string */
        $code = $request->input('code');
        /** @var bool */
        $isSinglePurchase = $request->input('single_purchase');

        if ($isSinglePurchase) {
            try {
                return $user
                    ->checkout([$productId])
                    ->withSuccessUrl('https://expensetrackr.app/thank-you')
                    ->redirect();
            } catch (Throwable $e) {
                Log::error('Error while checking out', [
                    'message' => $e->getMessage(),
                ]);

                return back()->with('toast', [
                    'title' => 'Error',
                    'description' => 'There was an error while checking out. Please try again.',
                    'type' => 'error',
                ]);
            }
        }

        try {
            return $user
                ->subscribe($productId, $code)
                ->withSuccessUrl('https://expensetrackr.app/thank-you')
                ->redirect();
        } catch (Throwable $e) {
            Log::error('Error while subscribing', [
                'message' => $e->getMessage(),
            ]);

            return back()->with('toast', [
                'title' => 'Error',
                'description' => 'There was an error while subscribing. Please try again.',
                'type' => 'error',
            ]);
        }
    }
}
