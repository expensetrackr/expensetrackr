<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
        Request $request,
        #[CurrentUser] User $user,
    ): RedirectResponse {
        $productId = $request->query('product_id');
        $code = $request->query('code', 'default');
        $isSinglePurchase = $request->query('single_purchase') === 'true';

        if (! $productId) {
            throw new Exception('Product ID is required');
        }

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
